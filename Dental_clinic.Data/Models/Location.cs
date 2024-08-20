using System;
using System.Collections.Generic;

namespace Dental_clinic.Data.Models;

public partial class Location
{
    public int LocationId { get; set; }

    public decimal? Latitude { get; set; }

    public decimal? Longitude { get; set; }

    public string? Address { get; set; }

    public string? LocationName { get; set; }

    //public virtual ICollection<Ordination> Ordinations { get; set; } = new List<Ordination>();
}
