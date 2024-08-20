using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Dental_clinic.Data.Utilities
{
    public static class PasswordHasher
    {
        public static string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }

        public static bool VerifyPassword(string hashedPassword, string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedPasswordBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                var hashedInputBytes = Convert.FromBase64String(hashedPassword);

                for (int i = 0; i < hashedInputBytes.Length; i++)
                {
                    if (hashedInputBytes[i] != hashedPasswordBytes[i])
                    {
                        return false;
                    }
                }
                return true;
            }
        }
    }
}
