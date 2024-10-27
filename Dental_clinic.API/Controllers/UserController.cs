using Dental_clinic.Data.DBContext;
using Dental_clinic.Data.Models;
using Dental_clinic.Data.Repositories;
using Dental_clinic.Data.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Dental_clinic.API.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly ILogger<UserController> _logger;
        private readonly DentalClinicContext _context;
        private readonly IConfiguration _configuration;
        private readonly IReservationRepository _reservationRepository;
        private readonly DentalRecordRepository _dentalRecordRepository;

        public UserController(DentalClinicContext context, IUserRepository userRepository, ILogger<UserController> logger, IConfiguration configuration)
        {
            _context = context;
            _userRepository = userRepository;
            _logger = logger;
            _configuration = configuration;

        }

        [HttpPost]
        public async Task<User> AddUser(User user)
        {
            user.Password = PasswordHasher.HashPassword(user.Password);

            var entity = new User()
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Password = user.Password,
                Role = user.Role
            };

            _context.Users.Add(entity);
            await _context.SaveChangesAsync();

            return entity;
        }

        [HttpPut]
        public async Task<IActionResult> UpdateUser(User userToUpdate)
        {
            try
            {
                var existingUser = await _userRepository.GetUsersByIdAsync(userToUpdate.UserId);

                if (existingUser == null)
                {
                    return NotFound(new
                    {
                        StatusCode = 404,
                        message = "Record not found"
                    });
                }
                existingUser.FirstName = userToUpdate.FirstName;
                existingUser.LastName = userToUpdate.LastName;
                existingUser.Email = userToUpdate.Email;
                existingUser.Role = userToUpdate.Role;
                if (!string.IsNullOrEmpty(userToUpdate.Password))
                {
                    existingUser.Password = PasswordHasher.HashPassword(userToUpdate.Password);
                }
                await _userRepository.UpdateUserAsync(existingUser);
                return NoContent();

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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                var existingUser = await _userRepository.GetUsersByIdAsync(id);
                if (existingUser == null)
                {
                    return NotFound(new
                    {
                        StatusCode = 404,
                        message = "Record not found"
                    });
                }

                await _userRepository.DeleteUserAsync(existingUser);
                return NoContent();


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

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                var users = await _userRepository.GetUsersAsync();
                return Ok(users);

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

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUsersById(int id)
        {
            try
            {
                User User = await _context.Users.Select(
                    s => new User
                    {
                        UserId = s.UserId,
                        FirstName = s.FirstName,
                        LastName = s.LastName,
                        Email = s.Email,
                        Password = s.Password,
                        Role = s.Role
                    })
                 .FirstOrDefaultAsync(s => s.UserId == id);

                if (User == null)
                {
                    return NotFound();
                }
                else
                {
                    return User;
                }

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
        [HttpPost("login/{email}/{password}")]
        public async Task<IActionResult> Login(string email, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                return NotFound(); 
            }
            if (!PasswordHasher.VerifyPassword(user.Password, password))
            {
                return Unauthorized(); 
            }

            HttpContext.Session.SetString("LoginEmail", user.Email);

            /*
            // Generate JWT token
            var tokenHandler = new JwtSecurityTokenHandler();
            var secretKey = _configuration["JwtSettings:SecretKey"];
            var key = Encoding.ASCII.GetBytes(secretKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                   new Claim(ClaimTypes.Name, user.UserId.ToString())
                    // Add more claims if needed
                }),
                Expires = DateTime.UtcNow.AddDays(7), // Token expiration time
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            // Return token along with user details*/
            return Ok(new
            {
              //  Token = tokenString,
                User = user
            });
        }

        [HttpGet("login/{email}/{password}")]
        public async Task<IActionResult> TestLogin(string email, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                return NotFound(); 
            }
            if (!PasswordHasher.VerifyPassword(user.Password, password))
            {
                return Unauthorized(); 
            }

            HttpContext.Session.SetString("LoginEmail", user.Email);


           /* // Generate JWT token
            var tokenHandler = new JwtSecurityTokenHandler();
            var secretKey = _configuration["JwtSettings:SecretKey"];
            var key = Encoding.ASCII.GetBytes(secretKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.UserId.ToString())
                    // Add more claims if needed
                }),
                Expires = DateTime.UtcNow.AddDays(7), // Token expiration time
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            // Return token along with user details
           */
            return Ok(new
            {
                //Token = tokenString,
                User = user
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser(User user)
        {
            try
            {
                if (string.IsNullOrEmpty(user.Role))
                {
                    user.Role = "pacijent";
                }
                var newUser = await _userRepository.RegisteerUser(user);
                return CreatedAtAction(nameof(GetUsers), new { id = newUser.UserId }, newUser);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error registering user");
                return StatusCode(StatusCodes.Status500InternalServerError, new { StatusCode = 500, message = ex.Message });
            }
        }

        [HttpPost("resetPassword")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            try
            {
                if (request == null || string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.NewPassword))
                {
                    return BadRequest(new { StatusCode = 400, message = "Molim unesite email i novu lozinku." });
                }

                bool isReset = await _userRepository.ResetPasswordAsync(request.Email, request.NewPassword);
                if (!isReset)
                {
                    return NotFound(new { StatusCode = 404, message = "Korisnik nije pronađen" });
                }
                return Ok(new { StatusCode = 200, message = "Lozinka uspješno resetovana" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Greška prilikom resetovanja lozinke.");
                return StatusCode(StatusCodes.Status500InternalServerError, new { StatusCode = 500, message = ex.Message });
            }
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetCurrentUserProfile()
        {
            var email = HttpContext.Session.GetString("LoginEmail");

            if (string.IsNullOrEmpty(email))
            {
                return Unauthorized(); 
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                return NotFound(); 
            }

            return Ok(new
            {
                user.FirstName,
                user.LastName,
                user.Email,
                user.Password,
            });
        }

        [HttpGet("email/{email}")]
        public async Task<ActionResult<User>> GetUserByEmail(string email)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
                if (user == null)
                {
                    return NotFound(new { message = "Korisnik nije pronađen." });
                }
                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
            }
        }

    }
}
