using System;
using System.Collections.Generic;

namespace Dental_clinic.Data.Models;

public partial class Staff
{
    public int StaffId { get; set; }

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public string? Position { get; set; }

    public int? OrdinationId { get; set; }

    public virtual Ordination? Ordination { get; set; }
}
