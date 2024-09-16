using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dental_clinic.Data.DTO
{
    public class OrdinationDto
    {
        public int OrdinationId { get; set; }
        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public string OwnerEmail { get; set; }  // Email umesto ID-a
        public string Address { get; set; }  // Adresa za pretragu lokacije
    }

}
