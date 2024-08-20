using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Dental_clinic.Data.Models;

public partial class Ordination
{
    public int OrdinationId { get; set; }

    public string? Name { get; set; }

    public int? LocationId { get; set; }

    public string? PhoneNumber { get; set; }
    
    public int? Owner { get; set; }

    public string? Address { get; set; }

    //public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    //public virtual ICollection<Dentalrecord> Dentalrecords { get; set; } = new List<Dentalrecord>();
    [JsonIgnore]
    public virtual Location? Location { get; set; }
    [JsonIgnore]
    public virtual User? OwnerNavigation { get; set; }

   // public virtual ICollection<Service> Services { get; set; } = new List<Service>();

   // public virtual ICollection<Staff> Staff { get; set; } = new List<Staff>();
}
