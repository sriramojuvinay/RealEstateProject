using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RealEstateAPI.Data;
using RealEstateAPI.DTOs;
using RealEstateAPI.Models;
using RealEstateAPI.Services;
using System.Security.Claims;

namespace RealEstateAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PropertyController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly CloudinaryService _cloudinaryService;

        public PropertyController(AppDbContext context, CloudinaryService cloudinaryService)
        {
            _context = context;
            _cloudinaryService = cloudinaryService;
        }

        // ✅ GET ALL (WITH OWNER INFO)
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var properties = await _context.Properties
                .Include(p => p.User) // 🔥 IMPORTANT
                .Where(p => !_context.RentalAgreements
                    .Any(r => r.PropertyId == p.Id && r.IsActive))
                .Select(p => new PropertyDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Location = p.Location,
                    Price = p.Price,
                    Type = p.Type,
                    Description = p.Description,
                    ImageUrls = p.ImageUrls,
                    ListingType = p.ListingType,
                    UserId = p.UserId,

                    // 🔥 NEW
                    OwnerName = p.User.UserName,
                    OwnerEmail = p.User.Email
                })
                .ToListAsync();

            return Ok(properties);
        }

        // ✅ GET BY ID
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var property = await _context.Properties
                .Include(p => p.User)
                .Where(p => p.Id == id)
                .Select(p => new PropertyDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Location = p.Location,
                    Price = p.Price,
                    Type = p.Type,
                    Description = p.Description,
                    ImageUrls = p.ImageUrls,
                    ListingType = p.ListingType,
                    UserId = p.UserId,

                    OwnerName = p.User.UserName,
                    OwnerEmail = p.User.Email
                })
                .FirstOrDefaultAsync();

            if (property == null)
                return NotFound();

            return Ok(property);
        }

        // ✅ ADD PROPERTY
        [Authorize(Roles = "Admin")]
        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> AddProperty([FromForm] CreatePropertyDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var imageUrls = new List<string>();

            if (dto.Files != null && dto.Files.Count > 0)
            {
                foreach (var file in dto.Files)
                {
                    var url = await _cloudinaryService.UploadImageAsync(file);
                    imageUrls.Add(url);
                }
            }

            var property = new Property
            {
                Title = dto.Title,
                Location = dto.Location,
                Price = dto.Price,
                Type = dto.Type,
                Description = dto.Description,
                ListingType = dto.ListingType,
                UserId = userId,
                ImageUrls = imageUrls
            };

            _context.Properties.Add(property);
            await _context.SaveChangesAsync();

            return Ok(property);
        }

        // ✅ UPDATE PROPERTY
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UpdateProperty(int id, [FromForm] CreatePropertyDto dto)
        {
            var property = await _context.Properties.FindAsync(id);

            if (property == null)
                return NotFound();

            // ✅ Update basic fields
            property.Title = dto.Title;
            property.Location = dto.Location;
            property.Price = dto.Price;
            property.Type = dto.Type; 
            property.Description = dto.Description;
            property.ListingType = dto.ListingType;

            // 🔥 FIXED IMAGE LOGIC
            var updatedImages = new List<string>();

            Console.WriteLine("Existing Images Count: " + (dto.ExistingImages?.Count ?? 0));

            if (dto.ExistingImages != null && dto.ExistingImages.Any())
            {
                updatedImages.AddRange(dto.ExistingImages);
            }

            // ✅ Add new uploaded images
            if (dto.Files != null && dto.Files.Count > 0)
            {
                foreach (var file in dto.Files)
                {
                    var url = await _cloudinaryService.UploadImageAsync(file);
                    updatedImages.Add(url);
                }
            }

            // ✅ Assign final list (handles delete + add)
            property.ImageUrls = updatedImages;

            await _context.SaveChangesAsync();

            return Ok(property);
        }

        // ✅ DELETE PROPERTY
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProperty(int id)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var property = await _context.Properties.FindAsync(id);

                if (property == null)
                    return NotFound();

                var bookings = await _context.Bookings
                    .Where(b => b.PropertyId == id)
                    .ToListAsync();

                _context.Bookings.RemoveRange(bookings);

                var rentals = await _context.RentalAgreements
                    .Where(r => r.PropertyId == id)
                    .ToListAsync();

                _context.RentalAgreements.RemoveRange(rentals);

                _context.Properties.Remove(property);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok("Deleted successfully");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine(ex.Message);
                return StatusCode(500, "Delete failed");
            }
        }

        // ✅ MY PROPERTIES
        [Authorize(Roles = "Admin")]
        [HttpGet("my-properties")]
        public async Task<IActionResult> GetMyProperties()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var properties = await _context.Properties
                .Include(p => p.User)
                .Where(p => p.UserId == userId)
                .Select(p => new PropertyDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Location = p.Location,
                    Price = p.Price,
                    Type = p.Type,
                    Description = p.Description,
                    ImageUrls = p.ImageUrls,
                    ListingType = p.ListingType,
                    UserId = p.UserId,

                    OwnerName = p.User.UserName,
                    OwnerEmail = p.User.Email
                })
                .ToListAsync();

            return Ok(properties);
        }

        // ✅ SEARCH
        [AllowAnonymous]
        [HttpGet("search")]
        public async Task<IActionResult> Search(string? location, int? minPrice, int? maxPrice, string? type)
        {
            var query = _context.Properties
                .Include(p => p.User)
                .Where(p => !_context.RentalAgreements
                    .Any(r => r.PropertyId == p.Id && r.IsActive))
                .AsQueryable();

            if (!string.IsNullOrEmpty(location))
                query = query.Where(p => p.Location.Contains(location));

            if (minPrice.HasValue)
                query = query.Where(p => p.Price >= minPrice);

            if (maxPrice.HasValue)
                query = query.Where(p => p.Price <= maxPrice);

            if (!string.IsNullOrEmpty(type))
                query = query.Where(p => p.Type == type);

            var result = await query
                .Select(p => new PropertyDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Location = p.Location,
                    Price = p.Price,
                    Type = p.Type,
                    Description = p.Description,
                    ImageUrls = p.ImageUrls,
                    ListingType = p.ListingType,
                    UserId = p.UserId,

                    OwnerName = p.User.UserName,
                    OwnerEmail = p.User.Email
                })
                .ToListAsync();

            return Ok(result);
        }
    }
}