using Microsoft.Maui.Controls;
using MauiApp1.ViewModels;

namespace MauiApp1.View
{
	public partial class RegisterPage : ContentPage
	{
		public RegisterPage (RegisterViewModel register)
		{
            InitializeComponent();
            BindingContext = register;
			register.NavigateToLoginPage += OnNavigateToLoginPage;
        }
        private async void OnNavigateToLoginPage()
        {
            await Shell.Current.GoToAsync("//MainPage");
        }
    }
}