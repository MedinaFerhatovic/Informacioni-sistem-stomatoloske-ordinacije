using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dental_clinic.Data.DTO
{
    public class AddAppointmentsDto
    {
        public int OrdinationId { get; set; }
        public List<DateWithSlotsDto> DatesWithSlots { get; set; }
    }
}
