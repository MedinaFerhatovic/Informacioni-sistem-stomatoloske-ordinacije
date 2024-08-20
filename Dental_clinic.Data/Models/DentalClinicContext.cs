/*using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Dental_clinic.Data.Models;

public partial class DentalClinicContext : DbContext
{
    public DentalClinicContext()
    {
    }

    public DentalClinicContext(DbContextOptions<DentalClinicContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Appointment> Appointments { get; set; }

    public virtual DbSet<Dentalrecord> Dentalrecords { get; set; }

    public virtual DbSet<Efmigrationshistory> Efmigrationshistories { get; set; }

    public virtual DbSet<Location> Locations { get; set; }

    public virtual DbSet<Ordination> Ordinations { get; set; }

    public virtual DbSet<Reservation> Reservations { get; set; }

    public virtual DbSet<Service> Services { get; set; }

    public virtual DbSet<Staff> Staff { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySQL("server=localhost;port=3306;user=root;password=root;database=dental_clinic");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Appointment>(entity =>
        {
            entity.HasKey(e => e.AppointmentId).HasName("PRIMARY");

            entity.ToTable("appointment");

            entity.HasIndex(e => e.OrdinationId, "ordinationID");

            entity.Property(e => e.AppointmentId).HasColumnName("appointmentID");
            entity.Property(e => e.Available).HasColumnName("available");
            entity.Property(e => e.DateTime)
                .HasColumnType("datetime")
                .HasColumnName("dateTime");
            entity.Property(e => e.OrdinationId).HasColumnName("ordinationID");

            entity.HasOne(d => d.Ordination).WithMany(p => p.Appointments)
                .HasForeignKey(d => d.OrdinationId)
                .HasConstraintName("appointment_ibfk_1");
        });

        modelBuilder.Entity<Dentalrecord>(entity =>
        {
            entity.HasKey(e => e.DentalRecordId).HasName("PRIMARY");

            entity.ToTable("dentalrecord");

            entity.HasIndex(e => e.Number, "number").IsUnique();

            entity.HasIndex(e => e.OrdinationId, "ordinationID");

            entity.HasIndex(e => e.PatientId, "patientID");

            entity.Property(e => e.DentalRecordId).HasColumnName("dentalRecordID");
            entity.Property(e => e.Addition)
                .HasColumnType("text")
                .HasColumnName("addition");
            entity.Property(e => e.Examination)
                .HasColumnType("text")
                .HasColumnName("examination");
            entity.Property(e => e.Number)
                .HasMaxLength(50)
                .HasColumnName("number");
            entity.Property(e => e.OrdinationId).HasColumnName("ordinationID");
            entity.Property(e => e.PatientId).HasColumnName("patientID");
            entity.Property(e => e.Recipe)
                .HasColumnType("text")
                .HasColumnName("recipe");
            entity.Property(e => e.VisitDate)
                .HasColumnType("date")
                .HasColumnName("visitDate");

            entity.HasOne(d => d.Ordination).WithMany(p => p.Dentalrecords)
                .HasForeignKey(d => d.OrdinationId)
                .HasConstraintName("dentalrecord_ibfk_2");

           /* entity.HasOne(d => d.Patient).WithMany(p => p.Dentalrecords)
                .HasForeignKey(d => d.PatientId)
                .HasConstraintName("dentalrecord_ibfk_1");*/
       /* });

        modelBuilder.Entity<Efmigrationshistory>(entity =>
        {
            entity.HasKey(e => e.MigrationId).HasName("PRIMARY");

            entity.ToTable("__efmigrationshistory");

            entity.Property(e => e.MigrationId).HasMaxLength(150);
            entity.Property(e => e.ProductVersion).HasMaxLength(32);
        });

        modelBuilder.Entity<Location>(entity =>
        {
            entity.HasKey(e => e.LocationId).HasName("PRIMARY");

            entity.ToTable("location");

            entity.Property(e => e.LocationId).HasColumnName("locationID");
            entity.Property(e => e.Address)
                .HasMaxLength(255)
                .HasColumnName("address");
            entity.Property(e => e.Latitude)
                .HasPrecision(10, 8)
                .HasColumnName("latitude");
            entity.Property(e => e.LocationName)
                .HasMaxLength(100)
                .HasColumnName("locationName");
            entity.Property(e => e.Longitude)
                .HasPrecision(11, 8)
                .HasColumnName("longitude");
        });

        modelBuilder.Entity<Ordination>(entity =>
        {
            entity.HasKey(e => e.OrdinationId).HasName("PRIMARY");

            entity.ToTable("ordination");

            entity.HasIndex(e => e.LocationId, "locationID");

            entity.HasIndex(e => e.Owner, "owner");

            entity.Property(e => e.OrdinationId).HasColumnName("ordinationID");
            entity.Property(e => e.Address)
                .HasMaxLength(255)
                .HasColumnName("address");
            entity.Property(e => e.LocationId).HasColumnName("locationID");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.Owner).HasColumnName("owner");
            entity.Property(e => e.PhoneNumber)
                .HasMaxLength(20)
                .HasColumnName("phoneNumber");

            entity.HasOne(d => d.Location).WithMany(p => p.Ordinations)
                .HasForeignKey(d => d.LocationId)
                .HasConstraintName("ordination_ibfk_1");

            /*entity.HasOne(d => d.OwnerNavigation).WithMany(p => p.Ordinations)
                .HasForeignKey(d => d.Owner)
                .HasConstraintName("ordination_ibfk_2");*/
        /*});

        modelBuilder.Entity<Reservation>(entity =>
        {
            entity.HasKey(e => e.ReservationId).HasName("PRIMARY");

            entity.ToTable("reservation");

            entity.HasIndex(e => e.AppointmentId, "appointmentID");

            entity.HasIndex(e => e.ServiceId, "serviceID");

            entity.HasIndex(e => e.UserId, "userID");

            entity.Property(e => e.ReservationId).HasColumnName("reservationID");
            entity.Property(e => e.Age).HasColumnName("age");
            entity.Property(e => e.AppointmentId).HasColumnName("appointmentID");
            entity.Property(e => e.Description)
                .HasColumnType("text")
                .HasColumnName("description");
            entity.Property(e => e.PhoneNumber)
                .HasMaxLength(20)
                .HasColumnName("phoneNumber");
            entity.Property(e => e.ReservationDate)
                .HasColumnType("datetime")
                .HasColumnName("reservationDate");
            entity.Property(e => e.ServiceId).HasColumnName("serviceID");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasColumnName("status");
            entity.Property(e => e.UserId).HasColumnName("userID");

            entity.HasOne(d => d.Appointment).WithMany(p => p.Reservations)
                .HasForeignKey(d => d.AppointmentId)
                .HasConstraintName("reservation_ibfk_2");

            entity.HasOne(d => d.Service).WithMany(p => p.Reservations)
                .HasForeignKey(d => d.ServiceId)
                .HasConstraintName("reservation_ibfk_3");

            /*entity.HasOne(d => d.User).WithMany(p => p.Reservations)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("reservation_ibfk_1");*/
/*        });

        modelBuilder.Entity<Service>(entity =>
        {
            entity.HasKey(e => e.ServiceId).HasName("PRIMARY");

            entity.ToTable("service");

            entity.HasIndex(e => e.OrdinationId, "ordinationID");

            entity.Property(e => e.ServiceId).HasColumnName("serviceID");
            entity.Property(e => e.Description)
                .HasColumnType("text")
                .HasColumnName("description");
            entity.Property(e => e.OrdinationId).HasColumnName("ordinationID");
            entity.Property(e => e.Price)
                .HasPrecision(10)
                .HasColumnName("price");
            entity.Property(e => e.ServiceName)
                .HasMaxLength(255)
                .HasColumnName("serviceName");

            entity.HasOne(d => d.Ordination).WithMany(p => p.Services)
                .HasForeignKey(d => d.OrdinationId)
                .HasConstraintName("service_ibfk_1");
        });

        modelBuilder.Entity<Staff>(entity =>
        {
            entity.HasKey(e => e.StaffId).HasName("PRIMARY");

            entity.ToTable("staff");

            entity.HasIndex(e => e.OrdinationId, "ordinationID");

            entity.Property(e => e.StaffId).HasColumnName("staffID");
            entity.Property(e => e.FirstName)
                .HasMaxLength(50)
                .HasColumnName("firstName");
            entity.Property(e => e.LastName)
                .HasMaxLength(50)
                .HasColumnName("lastName");
            entity.Property(e => e.OrdinationId).HasColumnName("ordinationID");
            entity.Property(e => e.Position)
                .HasMaxLength(50)
                .HasColumnName("position");

            entity.HasOne(d => d.Ordination).WithMany(p => p.Staff)
                .HasForeignKey(d => d.OrdinationId)
                .HasConstraintName("staff_ibfk_1");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PRIMARY");

            entity.ToTable("user");

            entity.Property(e => e.UserId).HasColumnName("userID");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .HasColumnName("email");
            entity.Property(e => e.FirstName)
                .HasMaxLength(50)
                .HasColumnName("firstName");
            entity.Property(e => e.LastName)
                .HasMaxLength(50)
                .HasColumnName("lastName");
            entity.Property(e => e.Password)
                .HasMaxLength(50)
                .HasColumnName("password");
            entity.Property(e => e.Role)
                .HasColumnType("enum('pacijent','doktor','admin')")
                .HasColumnName("role");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}*/
