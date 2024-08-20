
using MauiApp1.ViewModels;

namespace MauiApp1.View
{
    public partial class PasswordResetPage : ContentPage
    {
        public PasswordResetPage(PasswordResetViewModel viewModel)
        {
            InitializeComponent();
            BindingContext = viewModel;
        }
    }
}