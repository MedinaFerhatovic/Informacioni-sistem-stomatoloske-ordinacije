using System;
using System.Collections.Generic;

namespace Dental_clinic.Data.Models;

public partial class Dentalrecord
{
    public int DentalRecordId { get; set; }

    public string? Number { get; set; }

    public int? PatientId { get; set; }

    public int? OrdinationId { get; set; }

    public DateTime? VisitDate { get; set; }

    public string? Examination { get; set; }

    public string? Recipe { get; set; }

    public string? Addition { get; set; }

    public virtual Ordination? Ordination { get; set; }

    public virtual User? Patient { get; set; }
}
