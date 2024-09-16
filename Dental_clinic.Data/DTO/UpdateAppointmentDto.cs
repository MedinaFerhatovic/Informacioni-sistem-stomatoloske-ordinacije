using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dental_clinic.Data.DTO
{
    public class UpdateAppointmentDto
    {
        public string NewDate { get; set; } // Format: dd.MM.yyyy
        public string NewStartTime { get; set; } // Format: HH:mm:ss
        public string NewEndTime { get; set; } // Format: HH:mm:ss
        public bool IsAvailable { get; set; }
    }


}
