using Dental_clinic.Data.Models;

public class Visit
{
    public int VisitId { get; set; }
    public DateTime VisitDate { get; set; }
    public string? Examination { get; set; }
    public string? Recipe { get; set; }
    public string? Addition { get; set; }
    public int DentalRecordId { get; set; }
    public virtual Dentalrecord DentalRecord { get; set; }
}
