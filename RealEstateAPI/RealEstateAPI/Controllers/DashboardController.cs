using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RealEstateAPI.Data;
using System.Security.Claims;

namespace RealEstateAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;   

       
        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

       
        [HttpGet("earnings")]
        public async Task<IActionResult> GetEarnings()
        {
            var ownerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var rentals = await _context.RentalAgreements
                .Include(r => r.Property)
                .Where(r => r.Property.UserId == ownerId)
                .ToListAsync();

            var totalEarnings = rentals.Sum(r => r.MonthlyRent);

            var activeRentals = rentals.Count(r => r.IsActive);

            var monthlyEarnings = rentals
                .GroupBy(r => r.StartDate.Month)
                .Select(g => new
                {
                    Month = g.Key,
                    Total = g.Sum(x => x.MonthlyRent)
                })
                .ToList();

            return Ok(new
            {
                totalEarnings,
                activeRentals,
                monthlyEarnings
            });
        }
    }
}