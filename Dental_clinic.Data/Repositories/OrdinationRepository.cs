using Dental_clinic.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Dental_clinic.Data.Repositories;
public class OrdinationRepository : IOrdinationRepository
{
    private readonly DBContext.DentalClinicContext _ctx;
    public OrdinationRepository(DBContext.DentalClinicContext ctx)
    {
        _ctx = ctx;
    }

    public async Task<IEnumerable<Ordination>> GetOrdinationAsync()
    {
        return await _ctx.Ordinations.Include(o => o.Location).ToListAsync(); // Include Location
    }

    public async Task<Ordination> GetOrdinationByIdAsync(int id)
    {
        return await _ctx.Ordinations.Include(o => o.Location)
                                      .FirstOrDefaultAsync(o => o.OrdinationId == id); // Include Location
    }

    public async Task<Ordination> CreateOrdinationAsync(Ordination ordination)
    {
        _ctx.Ordinations.Add(ordination);
        await _ctx.SaveChangesAsync();
        return ordination;
    }

    public async Task UpdateOrdinationAsync(Ordination ordination)
    {
        _ctx.Ordinations.Update(ordination);
        await _ctx.SaveChangesAsync();
    }

    public async Task DeleteOrdinationAsync(Ordination ordination)
    {
        _ctx.Ordinations.Remove(ordination);
        await _ctx.SaveChangesAsync();
    }
}
