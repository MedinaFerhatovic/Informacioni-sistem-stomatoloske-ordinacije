using MauiApp1.View;
using MauiApp1.ViewModels;

namespace MauiApp1
{
    public partial class MainPage : ContentPage
    {
        public MainPage(MainViewModel viewModel)
        {
            InitializeComponent();
            BindingContext = viewModel;
            viewModel.NavigateToHomePage += OnNavigateToHomePage;
        }
        private async void OnNavigateToHomePage()
        {
            await Navigation.PushAsync(new HomePage());
        }
    }
}

