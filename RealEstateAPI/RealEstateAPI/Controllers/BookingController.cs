using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RealEstateAPI.Data;
using RealEstateAPI.Models;
using System.Security.Claims;
using RealEstateAPI.Services;

namespace RealEstateAPI.Controllers
{
    [Route("api/bookings")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly RentPaymentService _rentPaymentService;

        public BookingController(AppDbContext context, RentPaymentService rentPaymentService)
        {
            _context = context;
            _rentPaymentService = rentPaymentService;
        }


        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateBooking(Booking booking)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // ✅ Check if property is already rented
                var isRented = await _context.RentalAgreements
                    .AnyAsync(r => r.PropertyId == booking.PropertyId && r.IsActive);

                // ✅ Check if ANY user has active booking (NOT just same user)
                var alreadyBooked = await _context.Bookings
                    .AnyAsync(b =>
                        b.PropertyId == booking.PropertyId &&
                        (b.Status == "Pending" || b.Status == "Approved")
                    );

                if (isRented || alreadyBooked)
                {
                    return BadRequest("Property already booked or rented");
                }

                // ✅ Create booking
                booking.Status = "Pending";
                booking.BookingDate = DateTime.UtcNow;

                _context.Bookings.Add(booking);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                return Ok(booking);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine("❌ Booking error: " + ex.Message);
                return StatusCode(500, "Something went wrong");
            }
        }


        [HttpGet("user/{userId}")]
        [Authorize]
        public async Task<IActionResult> GetUserBookings(string userId)
        {
            var bookings = await _context.Bookings
                .Include(b => b.Property)
                .Where(b => b.UserId == userId)
                .OrderByDescending(b => b.BookingDate)
                .ToListAsync();

            return Ok(bookings);
        }


        [HttpGet("check")]
        public async Task<IActionResult> CheckBooking(string userId, int propertyId)
        {
            try
            {
                // ✅ Check if property is unavailable (rented OR booked by anyone)
                var isUnavailable =
                    await _context.RentalAgreements
                        .AnyAsync(r => r.PropertyId == propertyId && r.IsActive)
                    ||
                    await _context.Bookings
                        .AnyAsync(b =>
                            b.PropertyId == propertyId &&
                            (b.Status == "Pending" || b.Status == "Approved")
                        );

                return Ok(isUnavailable);
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ CheckBooking error: " + ex.Message);
                return StatusCode(500, "Error checking booking");
            }
        }


        [HttpGet("admin")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAdminBookings()
        {
            var bookings = await _context.Bookings
                .Include(b => b.Property)
                .Include(b => b.User)
                .OrderByDescending(b => b.BookingDate)
                .ToListAsync();

            return Ok(bookings);
        }

        [HttpPut("approve/{id}")]
        public async Task<IActionResult> ApproveBooking(int id)
        {
            var booking = await _context.Bookings
                            .Include(b => b.Property)
                            .Include(b => b.User)   
                            .FirstOrDefaultAsync(b => b.Id == id);

            if (booking == null)
                return NotFound();

            booking.Status = "Approved";

           
            var rental = new RentalAgreement
            {
                PropertyId = booking.PropertyId,
                UserId = booking.UserId,
                TenantName = booking.User.Email,
                TenantEmail = booking.User.Email,
                MonthlyRent = booking.Property.Price,
                StartDate = DateTime.Now,
                IsActive = true
            };

            _context.RentalAgreements.Add(rental);
            await _context.SaveChangesAsync();

            
            await _rentPaymentService.GenerateRent(rental.Id);

            return Ok("Booking approved & rental created");
        }
        
        [HttpPut("reject/{id}")]
        public async Task<IActionResult> RejectBooking(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);

            if (booking == null)
                return NotFound();

            booking.Status = "Rejected";

            await _context.SaveChangesAsync();

            return Ok(booking);
        }

        
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null) return NotFound();

            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();

            return Ok("Deleted");
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

        [Authorize(Roles = "Admin")]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllBookings()
        {
            var ownerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var bookings = await _context.Bookings
                .Include(b => b.Property)
                .Where(b => b.Property.UserId == ownerId) 
                .ToListAsync();

            return Ok(bookings);
        }
    }
}