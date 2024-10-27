using Dental_clinic.Data.DBContext;
using Dental_clinic.Data.DTO;
using Dental_clinic.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Dental_clinic.Data.Repositories
{
    public class DentalRecordRepository : IDentalRecordRepository
    {
        private readonly DentalClinicContext _context;

        public DentalRecordRepository(DentalClinicContext context)
        {
            _context = context;
        }

        public async Task<Dentalrecord> CreateDentalRecordAsync(DentalRecordDto dto)
        {
            var patient = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.PatientEmail);

            if (patient == null)
                throw new Exception("Patient not found.");

            var ordination = await _context.Ordinations
               .FirstOrDefaultAsync(o => o.OrdinationId == dto.OrdinationId);

            if (ordination == null)
                throw new Exception("Ordination not found.");

            var dentalRecord = new Dentalrecord
            {
                Number = GenerateUniqueNumber(),
                PatientId = patient.UserId,
                OrdinationId = dto.OrdinationId,
                VisitDate = dto.VisitDate,
                Examination = dto.Examination,
                Recipe = dto.Recipe,
                Addition = dto.Addition
            };

            _context.DentalRecords.Add(dentalRecord);
            await _context.SaveChangesAsync();
            return dentalRecord;
        }

        public async Task<Dentalrecord> GetDentalRecordByIdAsync(int id)
        {
            return await _context.DentalRecords.FindAsync(id);
        }

        public async Task<IEnumerable<Dentalrecord>> GetAllDentalRecordsAsync()
        {
            return await _context.DentalRecords.ToListAsync();
        }

        public async Task UpdateDentalRecordAsync(Dentalrecord dentalRecord)
        {
            _context.DentalRecords.Update(dentalRecord);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteDentalRecordAsync(int id)
        {
            var dentalRecord = await _context.DentalRecords.FindAsync(id);
            if (dentalRecord != null)
            {
                _context.DentalRecords.Remove(dentalRecord);
                await _context.SaveChangesAsync();
            }
        }


        public async Task<int?> GetPatientIdByEmailAsync(string email)
        {
            var patient = await _context.Users.FirstOrDefaultAsync(p => p.Email == email);
            return patient?.UserId;
        }

        private string GenerateUniqueNumber()
        {
            var random = new Random();
            return random.Next(100, 99999).ToString();
        }

        public async Task AddVisitToDentalRecordAsync(int dentalRecordId, VisitDto visitDto)
        {
            var dentalRecord = await _context.DentalRecords
                .FirstOrDefaultAsync(dr => dr.DentalRecordId == dentalRecordId);

            if (dentalRecord == null)
            {
                throw new Exception("Dental record not found.");
            }

            var visit = new Visit
            {
                VisitDate = visitDto.VisitDate,
                Examination = visitDto.Examination,
                Recipe = visitDto.Recipe,
                Addition = visitDto.Addition,
                DentalRecordId = dentalRecordId
            };


            _context.Visits.Add(visit);
            await _context.SaveChangesAsync();
        }


        public async Task<IEnumerable<Visit>> GetVisitsByDentalRecordIdAsync(int dentalRecordId)
        {
            return await _context.Visits
                .Where(v => v.DentalRecordId == dentalRecordId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Dentalrecord>> GetDentalRecordsByUserIdAsync(int userId)
        {
            return await _context.DentalRecords
                .Where(dr => dr.PatientId == userId)
                .Include(dr => dr.Visits) 
                .ToListAsync();
        }


        public async Task<string> GetPatientEmailByIdAsync(int? patientId)
        {
            var patient = await _context.Users.FindAsync(patientId);
            return patient?.Email;
        }

        public async Task<string> GetPatientFirstNameByIdAsync(int? patientId)
        {
            var patient = await _context.Users.FindAsync(patientId);
            return patient?.FirstName;
        }

        public async Task<string> GetPatientLastNameByIdAsync(int? patientId)
        {
            var patient = await _context.Users.FindAsync(patientId);
            return patient?.LastName;
        }

        public async Task<User> GetPatientByIdAsync(int patientId)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.UserId == patientId);
        }

        public async Task DeleteVisitAsync(int visitId)
        {
            var visit = await _context.Visits.FindAsync(visitId);

            if (visit != null)
            {
                _context.Visits.Remove(visit);

                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Dentalrecord>> GetDentalRecordsByOrdinationIdAsync(int ordinationId)
        {
            return await _context.DentalRecords
                .Where(dr => dr.OrdinationId == ordinationId) 
                .Include(dr => dr.Visits) 
                .ToListAsync();
        }

    }
}

