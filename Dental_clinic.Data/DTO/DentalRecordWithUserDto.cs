public class DentalRecordWithUserDto
{
    public int DentalRecordId { get; set; }
    public string PatientEmail { get; set; }
    public string PatientFirstName { get; set; }
    public string PatientLastName { get; set; }
    public string Number {  get; set; }
    public DateTime? VisitDate { get; set; }
    public string Examination { get; set; }
    public string Recipe { get; set; }
    public string Addition { get; set; }
    public int? OrdinationId { get; set; }
    public List<VisitDto> Visits { get; set; }
}
