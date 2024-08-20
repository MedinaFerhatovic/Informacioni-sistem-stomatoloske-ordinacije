using Dental_clinic.Data.DBContext;
using Dental_clinic.Data.Models;
using Dental_clinic.Data.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Dental_clinic.API.Controllers
{
    [Route("api/ordinations")]
    [ApiController]
    public class OrdinationController : ControllerBase
    {
        private readonly IOrdinationRepository _ordinationRepository;
        private readonly ILogger<OrdinationController> _logger;
        private readonly DentalClinicContext _context;
        private readonly IConfiguration _configuration;

        public OrdinationController(DentalClinicContext context, IOrdinationRepository ordinationRepository, ILogger<OrdinationController> logger, IConfiguration configuration)
        {
            _context = context;
            _ordinationRepository = ordinationRepository;
            _logger = logger;
            _configuration = configuration;
        }

        [HttpPost]
        public async Task<IActionResult> AddOrdination(OrdinationDto ordinationDto)
        {
            try
            {
                // Pronađi vlasnika na osnovu email-a
                var owner = await _context.Users.FirstOrDefaultAsync(u => u.Email == ordinationDto.OwnerEmail);
                if (owner == null)
                {
                    return NotFound(new
                    {
                        StatusCode = 404,
                        message = "Owner not found"
                    });
                }

                // Pronađi lokaciju na osnovu adrese
                var location = await _context.Locations.FirstOrDefaultAsync(l => l.Address == ordinationDto.Address);
                if (location == null)
                {
                    return NotFound(new
                    {
                        StatusCode = 404,
                        message = "Location not found"
                    });
                }

                var newOrdination = new Ordination
                {
                    Name = ordinationDto.Name,
                    PhoneNumber = ordinationDto.PhoneNumber,
                    Owner = owner.UserId,  // Postavi ID vlasnika
                    LocationId = location.LocationId,  // Postavi ID lokacije
                    Address = ordinationDto.Address
                };

                _context.Ordinations.Add(newOrdination);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetOrdinationsById), new { id = newOrdination.OrdinationId }, newOrdination);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new
                    {
                        StatusCode = 500,
                        message = ex.Message
                    });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrdination(int id, OrdinationDto ordinationDto)
        {
            try
            {
                var existingOrdination = await _context.Ordinations.FirstOrDefaultAsync(o => o.OrdinationId == id);

                if (existingOrdination == null)
                {
                    return NotFound(new { StatusCode = 404, message = "Ordination not found" });
                }

                // Pronađi vlasnika na osnovu email-a
                var owner = await _context.Users.FirstOrDefaultAsync(u => u.Email == ordinationDto.OwnerEmail);
                if (owner == null)
                {
                    return NotFound(new
                    {
                        StatusCode = 404,
                        message = "Owner not found"
                    });
                }

                // Pronađi lokaciju na osnovu adrese
                var location = await _context.Locations.FirstOrDefaultAsync(l => l.Address == ordinationDto.Address);
                if (location == null)
                {
                    return NotFound(new
                    {
                        StatusCode = 404,
                        message = "Location not found"
                    });
                }

                // Ažuriraj sve atribute
                existingOrdination.Name = ordinationDto.Name;
                existingOrdination.PhoneNumber = ordinationDto.PhoneNumber;
                existingOrdination.Owner = owner.UserId;  // Postavi ID vlasnika
                existingOrdination.LocationId = location.LocationId;  // Postavi ID lokacije
                existingOrdination.Address = ordinationDto.Address;

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, new { StatusCode = 500, message = ex.Message });
            }
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrdination(int id)
        {
            try
            {
                var existingOrdination = await _context.Ordinations.FirstOrDefaultAsync(o => o.OrdinationId == id);
                if (existingOrdination == null)
                {
                    return NotFound(new { StatusCode = 404, message = "Ordination not found" });
                }

                _context.Ordinations.Remove(existingOrdination);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, new { StatusCode = 500, message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetOrdinations()
        {
            try
            {
                var ordinations = await _context.Ordinations.Include(o => o.Location).Include(o => o.OwnerNavigation).ToListAsync();
                return Ok(ordinations);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, new { StatusCode = 500, message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrdinationsById(int id)
        {
            try
            {
                var ordination = await _context.Ordinations.Include(o => o.Location).Include(o => o.OwnerNavigation).FirstOrDefaultAsync(o => o.OrdinationId == id);
                if (ordination == null)
                {
                    return NotFound(new { StatusCode = 404, message = "Ordination not found" });
                }
                return Ok(ordination);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, new { StatusCode = 500, message = ex.Message });
            }
        }
    }
}
