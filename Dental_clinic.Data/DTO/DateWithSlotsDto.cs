using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dental_clinic.Data.DTO
{
    public class DateWithSlotsDto
    {
        public string Date { get; set; } // Datum u formatu dd.MM.yyyy
        public List<TimeSlotDto> TimeSlots { get; set; }
    }
}
