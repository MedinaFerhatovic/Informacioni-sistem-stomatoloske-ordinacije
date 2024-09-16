using Dental_clinic.Data.DTO;
using Dental_clinic.Data.Models;
using Dental_clinic.Data.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Dental_clinic.API.Controllers
{
    [Route("api/dentalRecord")]
    [ApiController]
    public class DentalRecordsController : ControllerBase
    {
        private readonly IDentalRecordRepository _repository;

        public DentalRecordsController(IDentalRecordRepository repository)
        {
            _repository = repository;
        }

        [HttpPost]
        public async Task<ActionResult<Dentalrecord>> CreateDentalRecord([FromBody] DentalRecordDto dto)
        {
            try
            {
                var dentalRecord = await _repository.CreateDentalRecordAsync(dto);
                return CreatedAtAction(nameof(GetDentalRecordById), new { id = dentalRecord.DentalRecordId }, dentalRecord);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Dentalrecord>> GetDentalRecordById(int id)
        {
            var dentalRecord = await _repository.GetDentalRecordByIdAsync(id);

            if (dentalRecord == null)
            {
                return NotFound();
            }

            return Ok(dentalRecord);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Dentalrecord>>> GetAllDentalRecords()
        {
            var dentalRecords = await _repository.GetAllDentalRecordsAsync();
            return Ok(dentalRecords);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDentalRecord(int id, [FromBody] DentalRecordDto dentalRecordDto)
        {
            if (dentalRecordDto == null || id <= 0)
            {
                return BadRequest("Invalid data.");
            }

            // Pronađi postojeći dentalni karton
            var dentalRecord = await _repository.GetDentalRecordByIdAsync(id);
            if (dentalRecord == null)
            {
                return NotFound();
            }

            // Mapiraj DTO u entitet
            dentalRecord.PatientId = await _repository.GetPatientIdByEmailAsync(dentalRecordDto.PatientEmail); // Pronađi pacijenta po emailu
            dentalRecord.VisitDate = dentalRecordDto.VisitDate;
            dentalRecord.Examination = dentalRecordDto.Examination;
            dentalRecord.Recipe = dentalRecordDto.Recipe;
            dentalRecord.Addition = dentalRecordDto.Addition;
            dentalRecord.OrdinationId = dentalRecordDto.OrdinationId;

            try
            {
                await _repository.UpdateDentalRecordAsync(dentalRecord);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("{id}/add-visit")]
        public async Task<IActionResult> AddVisit(int id, [FromBody] VisitDto visitDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid data.");
            }

            try
            {
                await _repository.AddVisitToDentalRecordAsync(id, visitDto);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("visits/{id}")]
        public async Task<ActionResult<IEnumerable<Visit>>> GetVisitsByDentalRecordId(int id)
        {
            try
            {
                var visits = await _repository.GetVisitsByDentalRecordIdAsync(id);

                if (visits == null || !visits.Any())
                {
                    return NotFound();
                }

                return Ok(visits);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDentalRecord(int id)
        {
            try
            {
                await _repository.DeleteDentalRecordAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
