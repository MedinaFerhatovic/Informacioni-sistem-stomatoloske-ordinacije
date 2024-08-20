using CommunityToolkit.Mvvm.ComponentModel;
using MauiApp1.Repositories;
using MauiApp1.Models;
using CommunityToolkit.Mvvm.Input;
using System.Text.RegularExpressions;

namespace MauiApp1.ViewModels
{
    public partial class RegisterViewModel : ObservableObject
    {
        private readonly UserRepository _userRepository;
        public RegisterViewModel(UserRepository userRepository)
        {
            _userRepository = userRepository;
        }
        [ObservableProperty]
        private string _firstName;
        [ObservableProperty]
        private string _lastName;
        [ObservableProperty]
        private string _email;
        [ObservableProperty]
        private string _password;

        [ObservableProperty]
        private string _emailErrorMessage;
        [ObservableProperty]
        private string _passwordErrorMessage;

        [ObservableProperty]
        private string _resultMessage;


        public event Action NavigateToLoginPage;


        [RelayCommand]
        private async Task Register()
        {
            try
            {
                EmailErrorMessage = string.Empty;
                PasswordErrorMessage = string.Empty;

                if (string.IsNullOrEmpty(_firstName) || string.IsNullOrEmpty(_lastName) || string.IsNullOrEmpty(_email) || string.IsNullOrEmpty(_password))
                {
                    await Application.Current.MainPage.DisplayAlert("Upozorenje", "Sva polja moraju biti popunjena.", "OK");
                    return;
                }

                if (!IsValidEmail(_email))
                {
                    EmailErrorMessage = "Neispravan email format.";
                    return;
                }

                if (_password.Length < 8)
                {
                    PasswordErrorMessage = "Lozinka mora imati najmanje 8 znakova.";
                    return;
                }

                var newUser = new User
                {
                    FirstName = _firstName,
                    LastName = _lastName,
                    Email = _email,
                    Password = _password,
                };
                string data = await _userRepository.Register(newUser);
                NavigateToLoginPage?.Invoke();
            }
            catch (HttpRequestException ex)
            {
                ResultMessage = $"HTTP Request Exception: {ex.Message}";
            }
            catch (Exception ex)
            {
                ResultMessage = $"Exception: {ex.Message}";
            }
        }

        private bool IsValidEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return false;

            try
            {
                // Regular expression to validate email address
                string pattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
                return Regex.IsMatch(email, pattern);
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
