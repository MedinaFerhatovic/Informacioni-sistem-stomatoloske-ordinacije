using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using MauiApp1.Repositories;
using MauiApp1.View;

namespace MauiApp1.ViewModels
{
    public partial class MenuViewModel : ObservableObject
    {
        private readonly UserRepository _userRepository;

        public MenuViewModel(UserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [RelayCommand]
        private async Task NavigateToProfile()
        {
            // Navigate to ProfilePage
            Application.Current.MainPage = new ProfilePage(new ProfileViewModel(_userRepository));
            await Task.CompletedTask;
        }

        [RelayCommand]
        private async Task NavigateToDenatalRecord()
        {
            // Navigate to HealthCardPage
            Application.Current.MainPage = new DentalRecordPage();
            await Task.CompletedTask;
        }

        [RelayCommand]
        private async Task NavigateToHomePage()
        { 
            // Navigate to HomePage
            Application.Current.MainPage = new HomePage(new HomeViewModel(_userRepository));
            await Task.CompletedTask;
        }


        [RelayCommand]
        private async Task Logout()
        {
            Application.Current.MainPage = new MainPage(new MainViewModel(_userRepository));
            await Task.CompletedTask;
        }
    }
}
