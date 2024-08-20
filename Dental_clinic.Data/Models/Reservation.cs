using System;
using System.Collections.Generic;

namespace Dental_clinic.Data.Models;

public partial class Reservation
{
    public int ReservationId { get; set; }

    public int? UserId { get; set; }

    public int? AppointmentId { get; set; }

    public int? ServiceId { get; set; }

    public DateTime? ReservationDate { get; set; }

    public string? Status { get; set; }

    public string? Description { get; set; }

    public int? Age { get; set; }

    public string? PhoneNumber { get; set; }

    public virtual Appointment? Appointment { get; set; }

    public virtual Service? Service { get; set; }

    public virtual User? User { get; set; }
}
