using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RealEstateAPI.Data;
using RealEstateAPI.Models;

namespace RealEstateAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FavoriteController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FavoriteController(AppDbContext context)
        {
            _context = context;
        }

       
        [HttpPost]
        public async Task<IActionResult> AddFavorite(Favorite fav)
        {
            if (string.IsNullOrEmpty(fav.UserId))
                return BadRequest("UserId required");

            var exists = await _context.Favorites
                .AnyAsync(f => f.UserId == fav.UserId && f.PropertyId == fav.PropertyId);

            if (exists)
                return BadRequest("Already added");

            _context.Favorites.Add(fav);
            await _context.SaveChangesAsync();

            return Ok(fav);
        }

        
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetFavorites(string userId)
        {
            var favorites = await _context.Favorites
                .Where(f => f.UserId == userId)
                .Include(f => f.Property) 
                .Select(f => new
                {
                    f.Id,
                    f.PropertyId,
                    Property = f.Property
                })
                .ToListAsync();

            return Ok(favorites);
        }

        
        [HttpDelete("{propertyId}")]
        public async Task<IActionResult> RemoveFavorite(
            [FromQuery] string userId, 
            int propertyId
        )
        {
            if (string.IsNullOrEmpty(userId))
                return BadRequest("UserId required");

            var fav = await _context.Favorites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.PropertyId == propertyId);

            if (fav == null)
                return NotFound();

            _context.Favorites.Remove(fav);
            await _context.SaveChangesAsync();

            return Ok("Removed");
        }
    }
}