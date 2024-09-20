using Dental_clinic.Data.DTO;
using Dental_clinic.Data.Models;
using Dental_clinic.Data.Repositories;
using Microsoft.AspNetCore.Mvc;
using System;
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

        // GET: api/Reservation
        // GET: api/reservations
        [HttpGet]
        public async Task<IActionResult> GetAllReservations()
        {
            var reservations = await _reservationRepository.GetAllReservationsAsync();

            // Dohvati korisnike i termine na osnovu ID-a iz rezervacija
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


        // GET: api/Reservation/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetReservationById(int id)
        {
            var reservation = await _reservationRepository.GetReservationByIdAsync(id);
            if (reservation == null)
                return NotFound();

            return Ok(reservation);
        }

        // POST: api/Reservation
        [HttpPost]
        public async Task<IActionResult> CreateReservation([FromBody] ReservationCreateDTO reservationDto)
        {
            // Validacija unosa
            if (reservationDto == null)
            {
                return BadRequest("Podaci o rezervaciji su neispravni.");
            }

            // Pretraga korisnika na osnovu email-a
            var user = await _userRepository.GetUserByEmailAsync(reservationDto.Email);
            if (user == null)
            {
                return NotFound("Korisnik sa datim email-om ne postoji.");
            }

            // Validacija ordinacije (ako je potrebno)
            var ordination = await _ordinationRepository.GetOrdinationByIdAsync(reservationDto.OrdinationID);
            if (ordination == null)
            {
                return BadRequest("Odabrana ordinacija ne postoji.");
            }

            // Validacija termina (provjeravamo da li termin postoji i da li je dostupan)
            var appointment = await _appointmentRepository.GetAppointmentById(reservationDto.AppointmentID);
            if (appointment == null || !appointment.Available)
            {
                return BadRequest("Odabrani termin nije dostupan.");
            }

            // Kreiramo novu rezervaciju
            var newReservation = new Reservation
            {
                UserId = user.UserId, // Povezano s korisnikom
                AppointmentId = reservationDto.AppointmentID,
                ReservationDate = DateTime.Now,  // Datum kada je rezervacija napravljena
                Status = "na cekanju",  // Inicijalni status rezervacije
                Description = reservationDto.Description,
                Age = reservationDto.Age,
                PhoneNumber = reservationDto.PhoneNumber
            };

            // Označavamo termin kao zauzet
            appointment.Available = false;

            // Spremamo promjene u bazu podataka
            var createdReservation = await _reservationRepository.CreateReservationAsync(newReservation);
            await _appointmentRepository.UpdateAppointmentAvailability(appointment.AppointmentId); // Ovdje ažuriramo dostupnost termina

            // Vraćamo podatke o novoj rezervaciji
            return CreatedAtAction(nameof(GetReservationById), new { id = createdReservation.ReservationId }, createdReservation);
        }


        // PUT: api/Reservation/{id}/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateReservationStatus(int id, [FromBody] string newStatus)
        {
            var validStatuses = new[] { "na cekanju", "odobrena", "odbijena" };
            if (!Array.Exists(validStatuses, status => status.Equals(newStatus, StringComparison.OrdinalIgnoreCase)))
                return BadRequest("Invalid status");

            var success = await _reservationRepository.UpdateReservationStatusAsync(id, newStatus);
            if (!success)
                return NotFound();

            return NoContent();
        }

        // DELETE: api/Reservation/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReservation(int id)
        {
            var success = await _reservationRepository.DeleteReservationAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }
    }
}
