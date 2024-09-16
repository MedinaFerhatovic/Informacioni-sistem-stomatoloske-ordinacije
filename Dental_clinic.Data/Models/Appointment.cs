using System;
using System.Collections.Generic;

namespace Dental_clinic.Data.Models;

public partial class Appointment
{
    public int AppointmentId { get; set; }

    public int OrdinationId { get; set; }

    public DateTime Date { get; set; }
    
    public TimeSpan StartTime { get; set; }

    public TimeSpan EndTime { get; set; }
    public bool Available { get; set; } = true;

    public Ordination Ordination { get; set; }

    //public virtual Ordination? Ordination { get; set; }

    //public virtual ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
}