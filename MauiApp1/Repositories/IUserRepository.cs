using MauiApp1.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MauiApp1.Repositories
{
    public interface IUserRepository
    {
        Task <LoginResponse> Login(string email, string password);
        Task <string> AddUserAsync(User user);
        Task<string> Register(User user);
        Task<User> GetCurrentUserProfile();

    }
}
