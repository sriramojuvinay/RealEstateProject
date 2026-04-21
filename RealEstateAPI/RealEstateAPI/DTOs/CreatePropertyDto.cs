using Microsoft.AspNetCore.Http;

namespace RealEstateAPI.DTOs
{
    public class CreatePropertyDto
    {
        public string? Title { get; set; }
        public string? Location { get; set; }
        public decimal Price { get; set; }
        public string? Type { get; set; }
        public string? Description { get; set; }
        public string? ListingType { get; set; }

        public List<IFormFile>? Files { get; set; }
        public List<string>? ExistingImages { get; set; }
    }
}
