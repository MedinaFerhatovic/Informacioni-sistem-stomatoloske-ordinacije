
using System.ComponentModel;

namespace Dental_clinic.Data.Models;

public partial class User 
{
    public int UserId { get; set; }

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public string? Email { get; set; }

    public string? Password { get; set; }

    [DefaultValue("pacijent")]
    public string? Role { get; set; }

    //public virtual ICollection<Dentalrecord> Dentalrecords { get; set; } = new List<Dentalrecord>();

    public virtual ICollection<Ordination> Ordinations { get; set; } = new List<Ordination>();

    //public virtual ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
}
