namespace RealEstateAPI.DTOs
{
    public class RentRequest
    {
        public int PropertyId { get; set; }
        public string? TenantName { get; set; }
        public string? TenantEmail { get; set; }
        public decimal MonthlyRent { get; set; }
    }
}
