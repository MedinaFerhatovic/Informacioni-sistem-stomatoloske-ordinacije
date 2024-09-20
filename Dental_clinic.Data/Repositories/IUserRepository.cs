using Azure;
using Dental_clinic.Data.Models;
using System.Net;

namespace Dental_clinic.Data.Repositories
{
    public interface IUserRepository
    {
        //Task<User> CreateUserAsync(User user);
        Task DeleteUserAsync(User user);
        Task<IEnumerable<User>> GetUsersAsync();
        Task<User> GetUsersByIdAsync(int id);
        Task UpdateUserAsync(User user);
        Task<User> LoginUser(string email, string password);
        Task<User> RegisteerUser(User user);

        Task<bool> ResetPasswordAsync(string email, string newPassword);

        Task<User> GetCurrentUserAsync(string email);
        Task<User> GetUserByEmailAsync(string email);

        Task<IEnumerable<User>> GetUsersByIds(IEnumerable<int> userIds);

    }
}