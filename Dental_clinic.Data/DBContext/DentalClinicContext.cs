using Dental_clinic.Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Dental_clinic.Data.DBContext;
public class DentalClinicContext : DbContext
{
    private readonly IConfiguration _configuration;

    public DentalClinicContext(IConfiguration configuration)
    {
        _configuration = configuration;
    }
    public DbSet<User> Users { get; set; }
    public DbSet<Ordination> Ordinations { get; set; }
    public DbSet<Location> Locations { get; set; }
    public DbSet<Appointment> Appointments { get; set; }

    public DbSet<Dentalrecord> DentalRecords { get; set; }
    public DbSet<Visit> Visits { get; set; }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseMySQL("server=localhost;port=3306;user=root;password=root;database=dental_clinic");
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Konfiguracija tablice User
        modelBuilder.Entity<User>().ToTable("User");
        modelBuilder.Entity<Ordination>().ToTable("Ordination");
        modelBuilder.Entity<Location>().ToTable("Location");
        modelBuilder.Entity<Appointment>().ToTable("Appointment");
        modelBuilder.Entity<Dentalrecord>().ToTable("Dentalrecord");
        modelBuilder.Entity<Visit>().ToTable("Visit");
        modelBuilder.Entity<Visit>()
     .HasOne(v => v.DentalRecord)
     .WithMany(d => d.Visits)
     .HasForeignKey(v => v.DentalRecordId)
     .OnDelete(DeleteBehavior.Cascade)
     .HasConstraintName("FK_Visit_DentalRecord");


        modelBuilder.Entity<Ordination>(entity =>
        {
            entity.HasOne(d => d.OwnerNavigation)
                .WithMany(p => p.Ordinations)
                .HasForeignKey(d => d.Owner)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Ordination_User");
        });
    }

}

