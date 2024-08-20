using Dental_clinic.Data.Models;

namespace Dental_clinic.Data.Repositories
{
   public interface IOrdinationRepository
   {
        Task<Ordination> CreateOrdinationAsync(Ordination ordination);
        Task DeleteOrdinationAsync(Ordination ordination);
        Task<IEnumerable<Ordination>> GetOrdinationAsync();
        Task<Ordination> GetOrdinationByIdAsync(int id);
        Task UpdateOrdinationAsync(Ordination ordination);
    }
}
