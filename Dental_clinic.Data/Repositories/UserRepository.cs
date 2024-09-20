
using Dental_clinic.Data.Models;
using Dental_clinic.Data.Utilities;
using Microsoft.EntityFrameworkCore;

namespace Dental_clinic.Data.Repositories;
public class UserRepository : IUserRepository
{
    private readonly DBContext.DentalClinicContext _ctx;
    public UserRepository(DBContext.DentalClinicContext ctx)
    {
        _ctx = ctx;
    }

    public async Task<IEnumerable<User>> GetUsersAsync()
    {
        var users = await _ctx.Users.ToListAsync();
        return users;
    }

    public async Task<User> GetUsersByIdAsync(int id)
    {
        return await _ctx.Users.FindAsync(id);
    }

    public async Task<User> GetUsersByEmailAsync(string email)
    {
        return await _ctx.Users.FirstOrDefaultAsync(u => u.Email == email);
    }


    /* public async Task<User> CreateUserAsync(User user)
     {

         _ctx.Users.Add(user);
         await _ctx.SaveChangesAsync();
         return user;
     }*/

    public async Task UpdateUserAsync(User user)
    {
        _ctx.Users.Update(user);
        await _ctx.SaveChangesAsync();
    }

    public async Task DeleteUserAsync(User user)
    {
        _ctx.Users.Remove(user);
        await _ctx.SaveChangesAsync();
    }

    public async Task<User> LoginUser(string email, string password)
    {
        var user = await _ctx.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user != null && PasswordHasher.VerifyPassword(user.Password, password))
        {
            return user;
        }
        return null;
    }

    public async Task<User> RegisteerUser(User user)
    {
        user.Password = PasswordHasher.HashPassword(user.Password);
        if (string.IsNullOrEmpty(user.Role))
        {
            user.Role = "pacijent";
        }

        var entity = new User()
        {
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            Password = user.Password,
            Role = user.Role
        };

        _ctx.Users.Add(entity);
        await _ctx.SaveChangesAsync();

        return entity;
    }

    public async Task<bool> ResetPasswordAsync(string email, string newPassword)
    {
        var user = _ctx.Users.FirstOrDefault(u => u.Email == email);
        if (user == null)
        {
            return false;
        }
        user.Password = PasswordHasher.HashPassword(newPassword);
        _ctx.Users.Update(user);
        await _ctx.SaveChangesAsync();
        return true;
    }

    public async Task<User> GetCurrentUserAsync(string email)
    {
        return await _ctx.Users.Where(u => u.Email == email).Select(u => new User
        {
            FirstName = u.FirstName,
            LastName = u.LastName,
            Email = u.Email,
            Password = u.Password,
        })
        .FirstOrDefaultAsync();
    }


    public async Task<User> GetUserByEmailAsync(string email)
    {
        return await _ctx.Users
            .FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<IEnumerable<User>> GetUsersByIds(IEnumerable<int> userIds)
    {
        return await _ctx.Users.Where(u => userIds.Contains(u.UserId)).ToListAsync();
    }

}


