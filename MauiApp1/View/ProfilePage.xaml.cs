
using CommunityToolkit.Mvvm.Input;
using MauiApp1.Repositories;
using MauiApp1.ViewModels;

namespace MauiApp1.View
{
	public partial class ProfilePage : ContentPage
	{
        public ProfilePage(ProfileViewModel viewModel)
        {
            InitializeComponent();
            BindingContext = viewModel;
        }
        private async void OnMenuIconClicked(object sender, EventArgs e)
        {
            await Shell.Current.GoToAsync("//FlyoutPage1");
        }

    }
}