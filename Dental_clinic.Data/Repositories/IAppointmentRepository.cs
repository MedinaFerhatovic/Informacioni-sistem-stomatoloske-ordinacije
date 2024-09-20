using Dental_clinic.Data.Models;

public interface IAppointmentRepository
{
    Task AddAppointmentsForDate(int ordinationId, DateTime date, List<(TimeSpan startTime, TimeSpan endTime)> timeSlots);

    Task<List<Appointment>> GetAppointmentsByDate(int ordinationId, DateTime date);

    Task<List<Appointment>> GetAllAppointments(int ordinationId);

    Task<Appointment> GetAppointmentById(int appointmentId);

    Task UpdateAppointmentAvailability(int appointmentId);

    Task DeleteAppointment(int appointmentId);

    Task UpdateAppointment(int appointmentId, DateTime newDate, TimeSpan newStartTime, TimeSpan newEndTime, bool isAvailable);

    Task<IEnumerable<Appointment>> GetAppointmentsByIds(IEnumerable<int> appointmentIds);

}
