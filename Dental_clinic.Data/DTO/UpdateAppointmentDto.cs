using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dental_clinic.Data.DTO
{
    public class UpdateAppointmentDto
    {
        public string NewDate { get; set; } 
        public string NewStartTime { get; set; } 
        public string NewEndTime { get; set; } 
        public bool IsAvailable { get; set; }
    }


}
