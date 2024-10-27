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

            var dentalRecord = await _repository.GetDentalRecordByIdAsync(id);
            if (dentalRecord == null)
            {
                return NotFound();
            }

            dentalRecord.PatientId = await _repository.GetPatientIdByEmailAsync(dentalRecordDto.PatientEmail); 
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
                var visits = await _repository.GetVisitsByDentalRecordIdAsync(id);

                if (visits != null && visits.Any())
                {
                    // Izbriši sve posjete
                    foreach (var visit in visits)
                    {
                        await _repository.DeleteVisitAsync(visit.VisitId);
                    }
                }

                await _repository.DeleteDentalRecordAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<DentalRecordWithUserDto>>> GetDentalRecordsByUserId(int userId)
        {
            try
            {
                var dentalRecords = await _repository.GetDentalRecordsByUserIdAsync(userId);

                if (dentalRecords == null || !dentalRecords.Any())
                {
                    return NotFound("Nema dentalnih kartona za ovog korisnika.");
                }

                var result = new List<DentalRecordWithUserDto>();

                foreach (var record in dentalRecords)
                {
                    var patient = await _repository.GetPatientByIdAsync(record.PatientId ?? 0);

                    if (patient != null)
                    {
                        result.Add(new DentalRecordWithUserDto
                        {
                            DentalRecordId = record.DentalRecordId,
                            PatientEmail = patient.Email, 
                            PatientFirstName = patient.FirstName, 
                            PatientLastName = patient.LastName,  
                            Number = record.Number,
                            VisitDate = record.VisitDate,
                            Examination = record.Examination,
                            Recipe = record.Recipe,
                            Addition = record.Addition,
                            OrdinationId = record.OrdinationId,
                            Visits = record.Visits.Select(v => new VisitDto
                            {
                                VisitDate = v.VisitDate,
                                Examination = v.Examination,
                                Recipe = v.Recipe,
                                Addition = v.Addition
                            }).ToList()
                        });
                    }
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("ordination/{ordinationId}")]
        public async Task<ActionResult<IEnumerable<DentalRecordWithUserDto>>> GetDentalRecordsByOrdinationId(int ordinationId)
        {
            try
            {
                var dentalRecords = await _repository.GetDentalRecordsByOrdinationIdAsync(ordinationId);

                if (dentalRecords == null || !dentalRecords.Any())
                {
                    return NotFound("Nema dentalnih kartona za ovu ordinaciju.");
                }

                var result = new List<DentalRecordWithUserDto>();

                foreach (var record in dentalRecords)
                {
                    var patient = await _repository.GetPatientByIdAsync(record.PatientId ?? 0);

                    if (patient != null)
                    {
                        result.Add(new DentalRecordWithUserDto
                        {
                            DentalRecordId = record.DentalRecordId,
                            PatientEmail = patient.Email,
                            PatientFirstName = patient.FirstName,
                            PatientLastName = patient.LastName,
                            Number = record.Number,
                            VisitDate = record.VisitDate,
                            Examination = record.Examination,
                            Recipe = record.Recipe,
                            Addition = record.Addition,
                            OrdinationId = record.OrdinationId,
                            Visits = record.Visits.Select(v => new VisitDto
                            {
                                VisitDate = v.VisitDate,
                                Examination = v.Examination,
                                Recipe = v.Recipe,
                                Addition = v.Addition
                            }).ToList()
                        });
                    }
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



    }
}
