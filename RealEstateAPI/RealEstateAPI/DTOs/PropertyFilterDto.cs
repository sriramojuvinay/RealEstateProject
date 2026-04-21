namespace RealEstateAPI.DTOs
{
    public class PropertyFilterDto
    {
        public string? Search { get; set; }
        public string? Type { get; set; }
        public string? ListingType { get; set; } 
        public int? MinPrice { get; set; }
        public int? MaxPrice { get; set; }
        public int? Bedrooms { get; set; }

        public string? SortBy { get; set; } 

        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
