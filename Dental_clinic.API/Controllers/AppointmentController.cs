using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Dental_clinic.Data.Models;
using Dental_clinic.Data.Repositories;
using Dental_clinic.Data.DTO;

namespace Dental_clinic.Api.Controllers
{
    [Route("api/appointments")]
    [ApiController]
    public class AppointmentsController : ControllerBase
    {
        private readonly IAppointmentRepository _appointmentRepository;

        public AppointmentsController(IAppointmentRepository appointmentRepository)
        {
            _appointmentRepository = appointmentRepository;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddAppointments([FromBody] AddAppointmentsDto addAppointmentsDto)
        {
            if (addAppointmentsDto == null)
            {
                return BadRequest("The addAppointmentsDto field is required.");
            }

            try
            {
                foreach (var dateWithSlots in addAppointmentsDto.DatesWithSlots)
                {
                    if (!DateTime.TryParseExact(dateWithSlots.Date, "dd.MM.yyyy",
                        System.Globalization.CultureInfo.InvariantCulture,
                        System.Globalization.DateTimeStyles.None,
                        out var date))
                    {
                        return BadRequest($"Invalid date format: {dateWithSlots.Date}");
                    }

                    var timeSlots = dateWithSlots.TimeSlots.Select(slot => (slot.StartTime, slot.EndTime)).ToList();
                    await _appointmentRepository.AddAppointmentsForDate(addAppointmentsDto.OrdinationId, date, timeSlots);
                }
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("{ordinationId}/{date}")]
        public async Task<ActionResult<List<Appointment>>> GetAppointmentsByDate(int ordinationId, DateTime date)
        {
            var appointments = await _appointmentRepository.GetAppointmentsByDate(ordinationId, date);
            return Ok(appointments);
        }

        [HttpGet("all/{ordinationId}")]
        public async Task<ActionResult<List<Appointment>>> GetAllAppointments(int ordinationId)
        {
            try
            {
                var appointments = await _appointmentRepository.GetAllAppointments(ordinationId);
                if (appointments == null || appointments.Count == 0)
                {
                    return NotFound("Nema dostupnih termina za ovu ordinaciju.");
                }

                return Ok(appointments);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Greška prilikom dohvaćanja termina: {ex.Message}");
            }
        }

        [HttpGet("{appointmentId}")]
        public async Task<ActionResult<Appointment>> GetAppointmentById(int appointmentId)
        {
            try
            {
                var appointment = await _appointmentRepository.GetAppointmentById(appointmentId);
                if (appointment == null)
                {
                    return NotFound("Termin nije pronađen.");
                }

                return Ok(appointment);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Greška prilikom dohvaćanja termina: {ex.Message}");
            }
        }


        [HttpPut("toggle-availability/{appointmentId}")]
        public async Task<IActionResult> ToggleAppointmentAvailability(int appointmentId)
        {
            await _appointmentRepository.UpdateAppointmentAvailability(appointmentId);
            return NoContent();
        }

        [HttpDelete("delete/{appointmentId}")]
        public async Task<IActionResult> DeleteAppointment(int appointmentId)
        {
            await _appointmentRepository.DeleteAppointment(appointmentId);
            return NoContent();
        }

        [HttpPut("update/{appointmentId}")]
        public async Task<IActionResult> UpdateAppointment(int appointmentId, [FromBody] UpdateAppointmentDto updateDto)
        {
          
            if (!DateTime.TryParseExact(updateDto.NewDate, "dd.MM.yyyy",
                System.Globalization.CultureInfo.InvariantCulture,
                System.Globalization.DateTimeStyles.None,
                out var newDate))
            {
                return BadRequest($"Invalid date format: {updateDto.NewDate}");
            }

            if (!TimeSpan.TryParse(updateDto.NewStartTime, out var newStartTime))
            {
                return BadRequest($"Invalid start time format: {updateDto.NewStartTime}");
            }

            if (!TimeSpan.TryParse(updateDto.NewEndTime, out var newEndTime))
            {
                return BadRequest($"Invalid end time format: {updateDto.NewEndTime}");
            }

            await _appointmentRepository.UpdateAppointment(
                appointmentId,
                newDate,
                newStartTime,
                newEndTime,
                updateDto.IsAvailable
            );

            return NoContent();
        }

    }
}
