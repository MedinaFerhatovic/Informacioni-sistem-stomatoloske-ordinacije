using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dental_clinic.Data.DTO
{
    public class DentalRecordDto
    {
        public string PatientEmail { get; set; }
        public string PatientFirstName { get; set; }
        public string PatientLastName { get; set; }
        public DateTime? VisitDate { get; set; }
        public string? Examination { get; set; }
        public string? Recipe { get; set; }
        public string? Addition { get; set; }
        public int? OrdinationId { get; set; }
    }
}
