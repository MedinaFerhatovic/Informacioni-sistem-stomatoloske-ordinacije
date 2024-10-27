using Dental_clinic.Data.DBContext;
using Dental_clinic.Data.DTO;
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
        private readonly OpenCageService _openCageService;

        public OrdinationController(DentalClinicContext context, IOrdinationRepository ordinationRepository, ILogger<OrdinationController> logger, IConfiguration configuration, OpenCageService openCageService)
        {
            _context = context;
            _ordinationRepository = ordinationRepository;
            _logger = logger;
            _configuration = configuration;
            _openCageService = openCageService;
        }

        [HttpPost]
        public async Task<IActionResult> AddOrdination(OrdinationDto ordinationDto)
        {
            try
            {
                var owner = await _context.Users.FirstOrDefaultAsync(u => u.Email == ordinationDto.OwnerEmail);
                if (owner == null)
                {
                    return NotFound(new
                    {
                        StatusCode = 404,
                        message = "Owner not found"
                    });
                }

                var (latitude, longitude) = await _openCageService.GetCoordinatesAsync(ordinationDto.Address);
                if (latitude == null || longitude == null)
                {
                    return NotFound(new { StatusCode = 404, message = "Unable to find location coordinates" });
                }

                var location = await _context.Locations.FirstOrDefaultAsync(l => l.Latitude == latitude && l.Longitude == longitude);
                if (location == null)
                {
                    location = new Location
                    {
                        Address = ordinationDto.Address,
                        Latitude = latitude,
                        Longitude = longitude,
                    };
                    _context.Locations.Add(location);
                    await _context.SaveChangesAsync();
                }


                var newOrdination = new Ordination
                {
                    Name = ordinationDto.Name,
                    PhoneNumber = ordinationDto.PhoneNumber,
                    Owner = owner.UserId, 
                    LocationId = location.LocationId,  
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

                var owner = await _context.Users.FirstOrDefaultAsync(u => u.Email == ordinationDto.OwnerEmail);
                if (owner == null)
                {
                    return NotFound(new
                    {
                        StatusCode = 404,
                        message = "Owner not found"
                    });
                }

                var location = await _context.Locations.FirstOrDefaultAsync(l => l.Address == ordinationDto.Address);
                if (location == null)
                {
                    return NotFound(new
                    {
                        StatusCode = 404,
                        message = "Location not found"
                    });
                }

                existingOrdination.Name = ordinationDto.Name;
                existingOrdination.PhoneNumber = ordinationDto.PhoneNumber;
                existingOrdination.Owner = owner.UserId;  
                existingOrdination.LocationId = location.LocationId;  
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

        [HttpGet("owner/{ownerId}")]
        public IActionResult GetOrdinationByOwner(int ownerId)
        {
            var ordination = _context.Ordinations.FirstOrDefault(o => o.Owner == ownerId);

            if (ordination == null)
            {
                return NotFound(new { message = "Doktor nije vlasnik nijedne ordinacije." });
            }

            return Ok(ordination);
        }


        [HttpGet("search")]
        public async Task<IActionResult> SearchOrdinationsByLocation(decimal latitude, decimal longitude, double radiusKm)
        {
            try
            {
                var ordinations = await _context.Ordinations
                    .Include(o => o.Location)
                    .Include(o => o.OwnerNavigation)
                    .ToListAsync();

                var nearbyOrdinations = ordinations.Where(o =>
            CalculateDistance(latitude, longitude, o.Location.Latitude.Value, o.Location.Longitude.Value) <= radiusKm)
           .ToList();
                return Ok(nearbyOrdinations);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, new { StatusCode = 500, message = ex.Message });
            }
        }

        private double CalculateDistance(decimal lat1, decimal lon1, decimal lat2, decimal lon2)
        {
            double R = 6371e3; 
            double φ1 = (double)lat1 * Math.PI / 180;
            double φ2 = (double)lat2 * Math.PI / 180;
            double Δφ = (double)(lat2 - lat1) * Math.PI / 180;
            double Δλ = (double)(lon2 - lon1) * Math.PI / 180;

            double a = Math.Sin(Δφ / 2) * Math.Sin(Δφ / 2) +
                       Math.Cos(φ1) * Math.Cos(φ2) *
                       Math.Sin(Δλ / 2) * Math.Sin(Δλ / 2);
            double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

            double distance = R * c; 
            return distance / 1000;
        }
    }
}
