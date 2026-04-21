using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace RealEstateAPI.DTOs
{
    public class PropertyUpdateDto
    {
        public string? Title { get; set; }
        public string? Location { get; set; }
        public decimal Price { get; set; }
        public string? Type { get; set; }
        public string? ListingType { get; set; }
        public string? Description { get; set; }

        public string? ImageUrls { get; set; }

        public List<IFormFile>? Files { get; set; }
    }
}
