using MauiApp1.Models;
using MauiApp1.Common;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Net.Http.Json;

namespace MauiApp1.Repositories
{
    public class UserRepository: IUserRepository 
    {

        private readonly HttpClient _client;
        private readonly ILogger<UserRepository> _logger;
        

        public UserRepository(ILogger<UserRepository> logger)
        { 
            _logger = logger;
            _client = new HttpClient();
            _client.BaseAddress = new Uri(Constants.ApiUrl);
        }

        public async Task<string> AddUserAsync(User user)
        {
            try
            {
                _logger.LogInformation("Sending AddUser request");
                HttpResponseMessage response = await _client.PostAsJsonAsync("api/users", user);
                response.EnsureSuccessStatusCode();
                _logger.LogInformation("AddUser request succeeded");
                return await response.Content.ReadAsStringAsync();
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError($"HTTP Request Exception: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError($"General Exception: {ex.Message}");
                throw;
            }
        }

        public async Task<string> Register(User user)
        {
            var response = await _client.PostAsJsonAsync("api/users/register", user);
            response.EnsureSuccessStatusCode();

            return await response.Content.ReadAsStringAsync();
        }

        public async Task<LoginResponse> Login(string email, string password)
        {
            try
            {
                _logger.LogInformation("Sending Login request");
                string url = $"api/users/login/{email}/{password}";
                HttpResponseMessage response = await _client.GetAsync(url);
                if (response.IsSuccessStatusCode)
                {
                    string content = await response.Content.ReadAsStringAsync();
                    var loginResponse = JsonConvert.DeserializeObject<LoginResponse>(content);
                   // Preferences.Set("AuthToken", loginResponse.Token);
                    Preferences.Set("LoginEmail", email);
                    _logger.LogInformation("Login request succeeded");
                    return loginResponse;
                }
                else
                {
                    _logger.LogWarning($"Login request failed with status code {response.StatusCode}");
                    return null;
                }
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError($"HTTP Request Exception: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError($"General Exception: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> ResetPassword(string email, string newPassword)
        {
            try
            {
                _logger.LogInformation("Sending ResetPassword request");

                var resetPasswordReqest = new { Email = email, NewPassword = newPassword };
                HttpResponseMessage response = await _client.PostAsJsonAsync("api/users/resetPassword", resetPasswordReqest);

                if (response.IsSuccessStatusCode)
                {
                    _logger.LogInformation("ResetPassword request succeeded");
                    return true;
                }
                else
                {
                    string content = await response.Content.ReadAsStringAsync();
                    _logger.LogWarning($"ResetPassword request failed with status code {response.StatusCode}. Response content: {content}");
                    return false;
                }
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError($"HTTP Request Exception: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError($"General Exception: {ex.Message}");
                throw;
            }
        }

        public async Task<User> GetCurrentUserProfile()
        {
            try
            {
                //var token = Preferences.Get("AuthToken", string.Empty);
                /*if (string.IsNullOrEmpty(token))
                {
                    _logger.LogWarning("Token is missing.");
                    return null;
                }*/
               // _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                //Debug.WriteLine($"Token: {token}");
                _logger.LogInformation($"Request URL: api/users/profile");
                //_logger.LogInformation($"Request Headers: {string.Join(", ", _client.DefaultRequestHeaders)}");
                var email = Preferences.Get("LoginEmail", string.Empty);
                if (string.IsNullOrEmpty(email))
                {
                    _logger.LogWarning("User email is not available.");
                    return null;
                }

                _logger.LogInformation("Sending GetCurrentUserProfile request");
                HttpResponseMessage response = await _client.GetAsync($"api/users/profile");

                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    _logger.LogInformation("GetCurrentUserProfile request succeeded");
                    return JsonConvert.DeserializeObject<User>(json);
                }
                else
                {
                    _logger.LogWarning($"GetCurrentUserProfile request failed with status code {response.StatusCode}");
                    return null;
                }
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError($"HTTP Request Exception: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError($"General Exception: {ex.Message}");
                throw;
            }
        }

    }
}

