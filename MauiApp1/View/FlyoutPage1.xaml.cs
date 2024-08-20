using MauiApp1.Repositories;
using MauiApp1.ViewModels;

namespace MauiApp1.View
{
    public partial class FlyoutPage1 : FlyoutPage
    {
        public FlyoutPage1(UserRepository userRepository)
        {
            InitializeComponent();
            BindingContext = new MenuViewModel(userRepository);
        }
    }
}
