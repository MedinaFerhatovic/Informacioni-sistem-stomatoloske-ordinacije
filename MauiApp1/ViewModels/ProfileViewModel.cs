using MauiApp1.Models;
using MauiApp1.Repositories;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System.Diagnostics;
using MauiApp1.View;
using Microsoft.Extensions.Logging;


namespace MauiApp1.ViewModels
{
    public partial class ProfileViewModel : ObservableObject
    {
        private readonly UserRepository _userRepository;
        private readonly ILogger<UserRepository> _logger;

        public ProfileViewModel(UserRepository userRepository)
        {
            _userRepository = userRepository;
            LoadUserProfile();  // Ensure this is called in the constructor
        }

        [ObservableProperty]
        private User _user;
        private async Task LoadUserProfile()
        {
            try
            {
                var userProfile = await _userRepository.GetCurrentUserProfile();
                if (userProfile != null)
                {
                    User = userProfile;
                }
            }
            catch (Exception ex)
            {
                await Application.Current.MainPage.DisplayAlert("Error", ex.Message, "OK");
            }
        }

        [RelayCommand]
        private async Task NavigateToPasswordReset()
        {
            try
            {
                Application.Current.MainPage = new PasswordResetPage(new PasswordResetViewModel(_userRepository));
                await Task.CompletedTask;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"NavigateToPasswordReset exception: {ex.Message}");
                Debug.WriteLine($"Stack trace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Debug.WriteLine($"Inner exception: {ex.InnerException.Message}");
                }
            }
        }

        [RelayCommand]
        private async Task NavigateToHome()
        {
            Application.Current.MainPage = new HomePage(new HomeViewModel(_userRepository));
            await Task.CompletedTask;
        }








    }
}
