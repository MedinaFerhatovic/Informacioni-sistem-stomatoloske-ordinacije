using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Dental_clinic.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Dental_clinic.Data.Repositories;
    public class AppointmentRepository : IAppointmentRepository
    {
        private readonly DBContext.DentalClinicContext _ctx;

        public AppointmentRepository(DBContext.DentalClinicContext ctx)
        {
            _ctx = ctx;
        }

        // Dodavanje termina za određeni datum
        public async Task AddAppointmentsForDate(int ordinationId, DateTime date, List<(TimeSpan startTime, TimeSpan endTime)> timeSlots)
        {
            foreach (var slot in timeSlots)
            {
                var appointment = new Appointment
                {
                    OrdinationId = ordinationId,
                    Date = date.Date,
                    StartTime = slot.startTime,
                    EndTime = slot.endTime,
                    Available = true
                };

                _ctx.Appointments.Add(appointment);
            }

            await _ctx.SaveChangesAsync();
        }

    // Dohvati sve termine za određeni datum
    public async Task<List<Appointment>> GetAppointmentsByDate(int ordinationId, DateTime date)
    {
        return await _ctx.Appointments
                         .Where(a => a.OrdinationId == ordinationId && a.Date == date.Date && a.Available)
                         .ToListAsync(); // Dohvata samo termine koji su dostupni
    }

    public async Task<List<Appointment>> GetAllAppointments(int ordinationId)
    {
        return await _ctx.Appointments
            .Where(a => a.OrdinationId == ordinationId)
            .ToListAsync();
    }

    public async Task<Appointment> GetAppointmentById(int appointmentId)
    {
        return await _ctx.Appointments
            .FirstOrDefaultAsync(a => a.AppointmentId == appointmentId);
    }

    // Osvježi dostupnost termina
    public async Task UpdateAppointmentAvailability(int appointmentId)
    {
            var appointment = await _ctx.Appointments.FindAsync(appointmentId);
            if (appointment != null)
            {
                appointment.Available = !appointment.Available;
                await _ctx.SaveChangesAsync();
            }
     }
    public async Task DeleteAppointment(int appointmentId)
    {
        var appointment = await _ctx.Appointments.FindAsync(appointmentId);
        if (appointment != null)
        {
            _ctx.Appointments.Remove(appointment);
            await _ctx.SaveChangesAsync();
        }
    }

    public async Task UpdateAppointment(int appointmentId, DateTime newDate, TimeSpan newStartTime, TimeSpan newEndTime, bool isAvailable)
    {
        var appointment = await _ctx.Appointments.FindAsync(appointmentId);
        if (appointment != null)
        {
            appointment.Date = newDate;
            appointment.StartTime = newStartTime;
            appointment.EndTime = newEndTime;
            appointment.Available = isAvailable;
            await _ctx.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<Appointment>> GetAppointmentsByIds(IEnumerable<int> appointmentIds)
    {
        return await _ctx.Appointments.Where(a => appointmentIds.Contains(a.AppointmentId)).ToListAsync();
    }

}