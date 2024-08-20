using MauiApp1.Models;
using MauiApp1.Repositories;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using MauiApp1.View;

namespace MauiApp1.ViewModels
{
    public partial class MainViewModel : ObservableObject
    {
        private readonly UserRepository _userRepository;
        public MainViewModel(UserRepository userRepository)
        {
            _userRepository = userRepository; 
            LoadRememberedCredentials();
        }
        [ObservableProperty]
        private string _loginEmail;
        [ObservableProperty]
        private string _loginPassword;
        [ObservableProperty]
        private string _resultMessage;
        [ObservableProperty]
        private bool _rememberMe;

        [ObservableProperty]
        private string _emailErrorMessage;
        [ObservableProperty]
        private string _passwordErrorMessage;

        [ObservableProperty]
        private string _errorMessage;



        public event Action NavigateToHomePage;


        [RelayCommand]
        private async Task Login()
        {
            try
            {
                if (string.IsNullOrEmpty(_loginEmail) || string.IsNullOrEmpty(_loginPassword))
                {
                    ErrorMessage = "Molim unesite email i lozinku.";
                    return;
                }

                var loginResponse = await _userRepository.Login(_loginEmail, _loginPassword);
                if (loginResponse != null)
                {
                    if (_rememberMe)
                    {
                        RememberCredentials();
                    }

                    // Save token for future API calls
                    Preferences.Set("JwtToken", loginResponse.Token);

                    NavigateToHomePage?.Invoke();
                    Application.Current.MainPage = new FlyoutPage1(_userRepository);
                }
                else
                {
                    Application.Current.MainPage.DisplayAlert("Greška", "Nevažeći email ili lozinka.", "OK");
                }
            }
            catch (Exception ex)
            {
                ResultMessage = $"Error: {ex.Message}";
            }
        }

        [RelayCommand]
        private async Task NavigateToRegister()
        {
            await Shell.Current.GoToAsync("//RegisterPage");
        }

        [RelayCommand]
        private async Task NavigateToForgotPassword()
        {
            await Shell.Current.GoToAsync("//ForgotPasswordPage");
        }

        private void RememberCredentials()
        {
            Preferences.Set("LoginEmail", _loginEmail);
            Preferences.Set("LoginPassword", _loginPassword);
            Preferences.Set("RememberMe", _rememberMe);
        }

        private void LoadRememberedCredentials()
        {
            LoginEmail = Preferences.Get("LoginEmail", string.Empty);
            LoginPassword = Preferences.Get("LoginPassword", string.Empty);
            RememberMe = Preferences.Get("RememberMe", false);
        }
    }
}
