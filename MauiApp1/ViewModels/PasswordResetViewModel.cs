using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using MauiApp1.Models;
using MauiApp1.Repositories;
using MauiApp1.View;

namespace MauiApp1.ViewModels
{
    public partial class PasswordResetViewModel : ObservableObject
    {
        private readonly UserRepository _userRepository;
        public PasswordResetViewModel(UserRepository userRepository)
        {
            _userRepository = userRepository;
            User = new User();
        }

        [ObservableProperty]
        private User _user;
        [ObservableProperty]
        private string _email;
        [ObservableProperty]
        private string _newPassword;
        [ObservableProperty]
        private string _confirmPassword;
        [ObservableProperty]
        private string _errorMessage;


        [RelayCommand]
        private async Task ResetPassword()
        {
            try
            {
                if (string.IsNullOrEmpty(_email) || string.IsNullOrEmpty(_newPassword) || string.IsNullOrEmpty(_confirmPassword))
                {
                    ErrorMessage = "Molim unesite sve potrebne informacije.";
                    return;
                }
                if (_newPassword.Length < 8)
                {
                    ErrorMessage = "Lozinka mora imati najmanje 8 znakova.";
                    return;
                }


                if (_newPassword != _confirmPassword)
                {
                    ErrorMessage = "Lozinke se ne podudaraju.";
                    return;
                }

                bool isReset = await _userRepository.ResetPassword(_email, _newPassword);
                if (isReset)
                {
                    await Application.Current.MainPage.DisplayAlert("Obavijest", "Uspješno ste resetovali lozinku.", "OK");
                    await Shell.Current.GoToAsync("//ProfilePage");
                }
                else
                {
                    ErrorMessage = "Greška prilikom resetovanja lozinke. Molim pokušajte ponovo.";
                }
            }
            catch (Exception ex)
            {
                ErrorMessage = $"Error: {ex.Message}";
            }
        }

        [RelayCommand]
        private async Task Cancel()
        {
            Application.Current.MainPage = new ProfilePage(new ProfileViewModel(_userRepository));
            await Task.CompletedTask;
        }
    }

}
