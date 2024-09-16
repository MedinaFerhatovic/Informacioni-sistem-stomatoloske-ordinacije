using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dental_clinic.Data.DTO
{
    public class AppointmentDateDto
    {
        public string Date { get; set; } // Promjena na string kako bi omogućio specifičan format
        public List<TimeSlotDto> TimeSlots { get; set; }
    }
}
