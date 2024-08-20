using Microsoft.Extensions.DependencyInjection;
using MauiApp1.View;
using MauiApp1.ViewModels;
using MauiApp1.Repositories;

namespace MauiApp1
{
    public partial class App : Application
    {
        public App()
        {
            InitializeComponent();

            // Postavite MainPage sa Dependency Injection
            MainPage = new AppShell();
        }
    }
}
