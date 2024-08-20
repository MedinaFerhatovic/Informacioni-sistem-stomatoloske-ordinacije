using CommunityToolkit.Mvvm.Input;
using CommunityToolkit.Mvvm.ComponentModel;
using MauiApp1.View;
using MauiApp1.Repositories;
using System.Threading.Tasks;

namespace MauiApp1.ViewModels
{
    public partial class HomeViewModel : ObservableObject
    {
        private readonly UserRepository _userRepository;

        public HomeViewModel(UserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [RelayCommand]
        private async Task OpenFlyout()
        {
            var flyoutPage = new FlyoutPage1(_userRepository);
            Application.Current.MainPage = flyoutPage;
            await Task.CompletedTask; // Dodavanje async behavior-a
        }
    }
}
