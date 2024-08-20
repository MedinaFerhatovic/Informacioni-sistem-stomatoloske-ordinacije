using MauiApp1.ViewModels;

namespace MauiApp1.View
{
    public partial class ForgotPasswordPage : ContentPage
    {
        public ForgotPasswordPage(ForgotPasswordViewModel reset)
        {
            InitializeComponent();
            BindingContext = reset;
        }
    }
}