using Dental_clinic.Data.DTO;
using Dental_clinic.Data.Models;

namespace Dental_clinic.Data.Repositories
{
    public interface IDentalRecordRepository
    {
        Task<Dentalrecord> CreateDentalRecordAsync(DentalRecordDto dto);
        Task<Dentalrecord> GetDentalRecordByIdAsync(int id);
        Task<IEnumerable<Dentalrecord>> GetAllDentalRecordsAsync();
        Task UpdateDentalRecordAsync(Dentalrecord dentalRecord);
        Task DeleteDentalRecordAsync(int id);
        Task<int?> GetPatientIdByEmailAsync(string email);
        Task AddVisitToDentalRecordAsync(int dentalRecordId, VisitDto visitDto);
        Task<IEnumerable<Visit>> GetVisitsByDentalRecordIdAsync(int dentalRecordId);

    }
}
