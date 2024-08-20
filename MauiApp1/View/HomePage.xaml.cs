using MauiApp1.ViewModels;

namespace MauiApp1.View
{
    public partial class HomePage : ContentPage
    {
        public HomePage()
        {
            InitializeComponent();
        }

        public HomePage(HomeViewModel viewModel)
        {
           InitializeComponent();
            BindingContext = viewModel; 
        }
       
    }
}