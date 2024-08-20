using System;
using System.Collections.Generic;

namespace Dental_clinic.Data.Models;

public partial class Appointment
{
    public int AppointmentId { get; set; }

    public int? OrdinationId { get; set; }

    public DateTime? DateTime { get; set; }

    public bool? Available { get; set; }

    public virtual Ordination? Ordination { get; set; }

    public virtual ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
}
