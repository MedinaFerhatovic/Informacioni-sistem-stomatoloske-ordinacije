using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dental_clinic.Data.DTO
{
    public class ReservationCreateDTO
    {
        public int OrdinationID { get; set; }  // Odabrana ordinacija
        public int AppointmentID { get; set; } // Odabrani termin (datum i vrijeme)
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }  // Pretraga na osnovu email-a
        public int Age { get; set; }
        public string PhoneNumber { get; set; }
        public string Description { get; set; }  // Razlog rezervacije
        public DateTime reservationDate { get; set; }
    }
}
