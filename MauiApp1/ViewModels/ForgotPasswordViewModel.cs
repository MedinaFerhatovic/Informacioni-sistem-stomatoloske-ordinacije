using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using MauiApp1.Repositories;

namespace MauiApp1.ViewModels
{
    public partial class ForgotPasswordViewModel : ObservableObject
    {
        private readonly UserRepository _userRepository;
        private bool _isPasswordVisible;
        private bool _isConfirmPasswordVisible;

        public ForgotPasswordViewModel(UserRepository userRepository)
        {
            _userRepository = userRepository;
            _isPasswordVisible = false;
            _isConfirmPasswordVisible = false;
        }

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
                if(string.IsNullOrEmpty(_email) || string.IsNullOrEmpty(_newPassword) || string.IsNullOrEmpty(_confirmPassword))
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
                if(isReset)
                {
                    await Application.Current.MainPage.DisplayAlert("Obavijest", "Uspješno ste resetovali lozinku.", "OK");
                    await Shell.Current.GoToAsync("//MainPage");
                }
                else
                {
                    ErrorMessage = "Greška prilikom resetovanja lozinke. Molim pokušajte ponovo.";
                }
            }catch(Exception ex)
            {
                ErrorMessage = $"Error: {ex.Message}";
            }
        }

        [RelayCommand]
        private async Task Cancel()
        {
            // Navigacija nazad na LoginPage
            await Shell.Current.GoToAsync("//MainPage");
        }
        [RelayCommand]
        private void TogglePasswordVisibility()
        {
            _isPasswordVisible = !_isPasswordVisible;
            _isConfirmPasswordVisible = !_isConfirmPasswordVisible;
        }
        public bool IsPasswordVisible
        {
            get => _isPasswordVisible;
            set => SetProperty(ref _isPasswordVisible, value);
        }

        public bool IsConfirmPasswordVisible
        {
            get => _isConfirmPasswordVisible;
            set => SetProperty(ref _isConfirmPasswordVisible, value);
        }
    }

}
