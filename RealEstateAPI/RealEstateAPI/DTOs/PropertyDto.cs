namespace RealEstateAPI.DTOs
{
    public class PropertyDto
    {
        public int Id { get; set; }                

        public string? Title { get; set; }

        public string? Location { get; set; }

        public decimal Price { get; set; }         

        public string? Type { get; set; }

        public string? Description { get; set; }

        public List<string>? ImageUrls { get; set; } 

        public string? ListingType { get; set; }

        public string? UserId { get; set; }

        public string? OwnerName { get; set; }
        public string? OwnerEmail { get; set; }


    }
}