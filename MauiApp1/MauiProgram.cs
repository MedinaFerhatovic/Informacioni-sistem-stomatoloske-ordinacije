using MauiApp1.Repositories;
using MauiApp1.View;
using MauiApp1.ViewModels;
using Microsoft.Extensions.Logging;


namespace MauiApp1
{
    public static class MauiProgram
    {
        public static MauiApp CreateMauiApp()
        {
            var builder = MauiApp.CreateBuilder();
            builder
                .UseMauiApp<App>()
                .ConfigureFonts(fonts =>
                {
                    fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                    fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
                });
            builder.Services.AddSingleton<MainPage>();
            builder.Services.AddSingleton<MainViewModel>();
            
            builder.Services.AddSingleton<RegisterViewModel>();
            builder.Services.AddSingleton<RegisterPage>();

            builder.Services.AddSingleton<ForgotPasswordViewModel>();
            builder.Services.AddSingleton<ForgotPasswordPage>();

            builder.Services.AddSingleton<UserRepository>();

            builder.Services.AddSingleton<HomePage>();
            builder.Services.AddSingleton<HomeViewModel>();
            builder.Services.AddSingleton<MenuViewModel>();
            builder.Services.AddSingleton<MenuPage>();
            builder.Services.AddSingleton<FlyoutPage1>();

            builder.Services.AddSingleton<ProfileViewModel>();
            builder.Services.AddSingleton<ProfilePage>();

            builder.Services.AddSingleton<PasswordResetViewModel>();
            builder.Services.AddSingleton<PasswordResetPage>();


#if DEBUG
            builder.Logging.AddDebug();
#endif

            return builder.Build();

        }

    }
}
