using Dental_clinic.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Dental_clinic.Data.Repositories
{
    public interface IReservationRepository
    {
        Task<IEnumerable<Reservation>> GetAllReservationsAsync();
        Task<Reservation> GetReservationByIdAsync(int reservationId);
        Task<Reservation> CreateReservationAsync(Reservation reservation);
        Task<bool> UpdateReservationAsync(Reservation reservation);
        Task<bool> DeleteReservationAsync(int reservationId);
        Task<bool> UpdateReservationStatusAsync(int reservationId, string newStatus);
        Task<IEnumerable<Reservation>> GetReservationsByUserIdAsync(int userId);
        Task<IEnumerable<Reservation>> GetReservationsByOrdinationIdAsync(int ordinationId);

    }
}
