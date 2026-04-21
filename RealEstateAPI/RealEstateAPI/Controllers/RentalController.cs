using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RealEstateAPI.Data;
using RealEstateAPI.DTOs;
using RealEstateAPI.Models;
using System.Security.Claims;

namespace RealEstateAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RentalController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RentalController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("rent")]
        public async Task<IActionResult> RentProperty([FromBody] RentRequest model)
        {
            var property = await _context.Properties.FindAsync(model.PropertyId);

            if (property == null)
                return NotFound("Property not found");

            
            property.Status = "Rented";

            var agreement = new RentalAgreement
            {
                PropertyId = property.Id,
                TenantName = model.TenantName,
                TenantEmail = model.TenantEmail,
                MonthlyRent = model.MonthlyRent,
                StartDate = DateTime.Now,

                
                IsActive = true
            };

            _context.RentalAgreements.Add(agreement);
            await _context.SaveChangesAsync();

            return Ok("Property rented successfully");
        }


        [HttpPost("end/{id}")]
        public async Task<IActionResult> EndRental(int id)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var agreement = await _context.RentalAgreements
                    .Include(r => r.Property)
                    .FirstOrDefaultAsync(r => r.Id == id);

                if (agreement == null)
                    return NotFound("Rental agreement not found");

                // ✅ End rental
                agreement.IsActive = false;
                agreement.EndDate = DateTime.UtcNow;

                // ✅ Update property status
                if (agreement.Property != null)
                {
                    agreement.Property.Status = "Available";
                    _context.Properties.Update(agreement.Property);
                }

                // 🔥 IMPORTANT FIX: Clear old bookings
                var bookings = await _context.Bookings
                    .Where(b => b.PropertyId == agreement.PropertyId &&
                           (b.Status == "Pending" || b.Status == "Approved"))
                    .ToListAsync();

                foreach (var booking in bookings)
                {
                    booking.Status = "Expired"; // or "Completed"
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                Console.WriteLine($"✅ Rental {id} ended. Property unlocked + bookings cleared");

                return Ok(new
                {
                    message = "Rental ended successfully",
                    propertyId = agreement.PropertyId
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();

                Console.WriteLine("❌ Error ending rental: " + ex.Message);
                return StatusCode(500, "Something went wrong");
            }
        }


        [Authorize(Roles = "Admin")]
        [HttpGet("rentals")]
        public async Task<IActionResult> GetRentals()
        {
            var ownerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var rentals = await _context.RentalAgreements
                .Include(r => r.Property)

               
                .Where(r => r.Property.UserId == ownerId)

                
                .Where(r => r.Property.ListingType == "Rent")

                .ToListAsync();

            return Ok(rentals);
        }

        
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetRentalDashboard()
        {
            try
            {
                var now = DateTime.Now;

                var agreements = await _context.RentalAgreements
                    .Include(r => r.Property)
                    .Include(r => r.Payments)
                    .Where(r => r.IsActive)
                    .ToListAsync();

                foreach (var agreement in agreements)
                {
                    bool exists = agreement.Payments.Any(p =>
                        p.Month == now.Month && p.Year == now.Year);

                    if (!exists)
                    {
                        _context.RentPayments.Add(new RentPayment
                        {
                            RentalAgreementId = agreement.Id,
                            Month = now.Month,
                            Year = now.Year,
                            Amount = agreement.MonthlyRent,
                            IsPaid = false
                        });
                    }
                }

                await _context.SaveChangesAsync();

                agreements = await _context.RentalAgreements
                    .Include(r => r.Property)
                    .Include(r => r.Payments)
                    .Where(r => r.IsActive)
                    .ToListAsync();

                var result = agreements.Select(a =>
                {
                    var payments = a.Payments ?? new List<RentPayment>();

                    var currentPayment = payments
                        .FirstOrDefault(p => p.Month == now.Month && p.Year == now.Year);

                    var totalDue = payments
                        .Where(p => !p.IsPaid)
                        .Sum(p => p.Amount);

                    var lastPayment = payments
                        .Where(p => p.IsPaid)
                        .OrderByDescending(p => p.PaidDate)
                        .FirstOrDefault();

                    return new RentalDashboardDto
                    {
                        AgreementId = a.Id,
                        PropertyTitle = a.Property?.Title ?? "N/A",
                        Location = a.Property?.Location ?? "N/A",
                        TenantName = a.TenantName,
                        MonthlyRent = a.MonthlyRent,
                        CurrentMonthPaid = currentPayment != null && currentPayment.IsPaid,
                        TotalDue = totalDue,
                        LastPaymentDate = lastPayment?.PaidDate,
                        PaymentId = currentPayment?.Id,

                      
                        ImageUrl = a.Property != null &&
               a.Property.ImageUrls != null &&
               a.Property.ImageUrls.Any()
        ? a.Property.ImageUrls.First()
        : null
                    };
                });

                return Ok(result);
            }
            catch (Exception ex)
            {
                
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRental(int id)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var rental = await _context.RentalAgreements
                    .FirstOrDefaultAsync(r => r.Id == id);

                if (rental == null)
                    return NotFound();

                // ✅ Delete related payments
                var payments = await _context.RentPayments
                    .Where(p => p.RentalAgreementId == id)
                    .ToListAsync();

                _context.RentPayments.RemoveRange(payments);

                // ✅ Delete rental
                _context.RentalAgreements.Remove(rental);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok("Rental deleted successfully");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine(ex.Message);
                return StatusCode(500, "Delete failed");
            }
        }
    }
}
