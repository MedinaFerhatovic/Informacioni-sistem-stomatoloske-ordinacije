using System;
using System.Collections.Generic;

namespace Dental_clinic.Data.Models;

public partial class Service
{
    public int ServiceId { get; set; }

    public int? OrdinationId { get; set; }

    public string? ServiceName { get; set; }

    public string? Description { get; set; }

    public decimal? Price { get; set; }

    public virtual Ordination? Ordination { get; set; }

    public virtual ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
}
