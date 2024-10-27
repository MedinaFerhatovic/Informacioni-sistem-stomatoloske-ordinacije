using Dental_clinic.Data.DTO;
using Dental_clinic.Data.Models;
using Dental_clinic.Data.Repositories;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Text;
using System.Threading.Tasks;

namespace Dental_clinic.Controllers
{
    [Route("api/reservations")]
    [ApiController]
    public class ReservationController : ControllerBase
    {
        private readonly IReservationRepository _reservationRepository;
        private readonly IUserRepository _userRepository;
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IOrdinationRepository _ordinationRepository;

        public ReservationController(IReservationRepository reservationRepository, IUserRepository userRepository, IAppointmentRepository appointmentRepository, IOrdinationRepository ordinationRepository)
        {
            _reservationRepository = reservationRepository;
            _userRepository = userRepository;
            _appointmentRepository = appointmentRepository;
            _ordinationRepository = ordinationRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllReservations()
        {
            var reservations = await _reservationRepository.GetAllReservationsAsync();

            var userIds = reservations.Select(r => r.UserId).Distinct().ToList();
            var appointmentIds = reservations.Select(r => r.AppointmentId).Distinct().ToList();

            var users = await _userRepository.GetUsersByIds(userIds);
            var appointments = await _appointmentRepository.GetAppointmentsByIds(appointmentIds);

            var reservationDetails = reservations.Select(r => new
            {
                r.ReservationId,
                r.UserId,
                r.AppointmentId,
                r.ReservationDate,
                r.Status,
                r.Description,
                r.Age,
                r.PhoneNumber,
                User = users.FirstOrDefault(u => u.UserId == r.UserId),
                Appointment = appointments.FirstOrDefault(a => a.AppointmentId == r.AppointmentId)
            });

            return Ok(reservationDetails);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetReservationById(int id)
        {
            var reservation = await _reservationRepository.GetReservationByIdAsync(id);
            if (reservation == null)
                return NotFound();

            return Ok(reservation);
        }

        [HttpPost]
        public async Task<IActionResult> CreateReservation([FromBody] ReservationCreateDTO reservationDto)
        {
            if (reservationDto == null)
            {
                return BadRequest("Podaci o rezervaciji su neispravni.");
            }

            var user = await _userRepository.GetUserByEmailAsync(reservationDto.Email);
            if (user == null)
            {
                return NotFound("Korisnik sa datim email-om ne postoji.");
            }

            var ordination = await _ordinationRepository.GetOrdinationByIdAsync(reservationDto.OrdinationID);
            if (ordination == null)
            {
                return BadRequest("Odabrana ordinacija ne postoji.");
            }

            var appointment = await _appointmentRepository.GetAppointmentById(reservationDto.AppointmentID);
            if (appointment == null || !appointment.Available)
            {
                return BadRequest("Odabrani termin nije dostupan.");
            }

            var newReservation = new Reservation
            {
                UserId = user.UserId, 
                AppointmentId = reservationDto.AppointmentID,
                ReservationDate = DateTime.Now,  
                Status = "na cekanju",  
                Description = reservationDto.Description,
                Age = reservationDto.Age,
                PhoneNumber = reservationDto.PhoneNumber
            };

            appointment.Available = false;

            var createdReservation = await _reservationRepository.CreateReservationAsync(newReservation);
            await _appointmentRepository.UpdateAppointmentAvailability(appointment.AppointmentId); 

            return CreatedAtAction(nameof(GetReservationById), new { id = createdReservation.ReservationId }, createdReservation);
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateReservationStatus(int id, [FromBody] string newStatus)
        {
            var validStatuses = new[] { "na cekanju", "odobrena", "odbijena" };
            if (!Array.Exists(validStatuses, status => status.Equals(newStatus, StringComparison.OrdinalIgnoreCase)))
                return BadRequest("Invalid status");

            var reservation = await _reservationRepository.GetReservationByIdAsync(id);
            if (reservation == null)
                return NotFound("Rezervacija nije pronađena.");

            // Ažuriraj status rezervacije
            var success = await _reservationRepository.UpdateReservationStatusAsync(id, newStatus);
            if (!success)
                return NotFound();

            // Pronađi korisnika rezervacije
            var user = await _userRepository.GetUsersByIdAsync(reservation.UserId);
            if (user == null || string.IsNullOrEmpty(user.fcmToken))
                return NotFound("Korisnik ili njegov push token nije pronađen.");

            // Pripremi i pošalji push notifikaciju
            var pushNotificationPayload = new
            {
                to = user.fcmToken,  // Koristi Expo push token korisnika
                sound = "default",
                title = "Promjena statusa rezervacije",
                body = $"Vaša rezervacija je {newStatus}",
                data = new { reservationId = reservation.ReservationId }
            };

            using (var client = new HttpClient())
            {
                var response = await client.PostAsync("https://exp.host/--/api/v2/push/send",
                    new StringContent(JsonConvert.SerializeObject(pushNotificationPayload), Encoding.UTF8, "application/json"));

                if (!response.IsSuccessStatusCode)
                {
                    var responseBody = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"Error sending notification: {responseBody}");
                    return StatusCode(500, "Slanje push obavijesti nije uspjelo.");
                }
            }

            return NoContent();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReservation(int id)
        {
            var reservation = await _reservationRepository.GetReservationByIdAsync(id);
            if (reservation == null)
            {
                return NotFound("Rezervacija nije pronađena.");
            }

            // Oslobodi termin koji je rezervisan
            var appointment = await _appointmentRepository.GetAppointmentById(reservation.AppointmentId);
            if (appointment != null)
            {
                appointment.Available = true; // Oznaci termin kao dostupan
                await _appointmentRepository.UpdateAppointmentAvailability2(appointment.AppointmentId); // Ažuriraj status termina
            }

            var success = await _reservationRepository.DeleteReservationAsync(id);
            if (!success)
                return NotFound();

            return Ok();
        }


        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetReservationsByUserId(int userId)
        {
            var reservations = await _reservationRepository.GetReservationsByUserIdAsync(userId);
            if (reservations == null || !reservations.Any())
                return NotFound("Nema rezervacija za ovog korisnika.");

            var appointmentIds = reservations.Select(r => r.AppointmentId).Distinct().ToList();
            var appointments = await _appointmentRepository.GetAppointmentsByIds(appointmentIds);

            var reservationDetails = reservations.Select(r => new
            {
                r.ReservationId,
                r.UserId,
                r.AppointmentId,
                r.ReservationDate,
                r.Status,
                r.Description,
                r.Age,
                r.PhoneNumber,
                Appointment = appointments.FirstOrDefault(a => a.AppointmentId == r.AppointmentId)
            });

            return Ok(reservationDetails);
        }

        [HttpGet("ordination/{ordinationId}")]
        public async Task<IActionResult> GetReservationsByOrdination(int ordinationId)
        {
            var reservations = await _reservationRepository.GetReservationsByOrdinationIdAsync(ordinationId);
            if (reservations == null || !reservations.Any())
                return NotFound("Nema rezervacija za ovu ordinaciju.");

            var userIds = reservations.Select(r => r.UserId).Distinct().ToList();
            var appointmentIds = reservations.Select(r => r.AppointmentId).Distinct().ToList();

            var users = await _userRepository.GetUsersByIds(userIds);
            var appointments = await _appointmentRepository.GetAppointmentsByIds(appointmentIds);

            var reservationDetails = reservations.Select(r => new
            {
                r.ReservationId,
                r.UserId,
                r.AppointmentId,
                r.ReservationDate,
                r.Status,
                r.Description,
                r.Age,
                r.PhoneNumber,
                User = users.FirstOrDefault(u => u.UserId == r.UserId),
                Appointment = appointments.FirstOrDefault(a => a.AppointmentId == r.AppointmentId)
            });

            return Ok(reservationDetails);
        }

        [HttpPost("{userId}/expo-token")]
        public async Task<IActionResult> SaveExpoToken(int userId, [FromBody] TokenDto tokenDto)
        {
            // Provjeri da li je token DTO ispravan
            if (tokenDto == null || string.IsNullOrEmpty(tokenDto.Token))
            {
                return BadRequest("Token is missing or invalid.");
            }

            // Pronađi korisnika po ID-u
            var user = await _userRepository.GetUsersByIdAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Spremi Expo push token za korisnika
            user.fcmToken = tokenDto.Token;
            await _userRepository.UpdateUserAsync(user);

            // Vrati uspješan odgovor
            return NoContent(); // Status 204 - bez sadržaja
        }




    }
}
