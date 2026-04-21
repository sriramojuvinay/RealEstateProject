
namespace RealEstateAPI.Models
{
    public class RentalAgreement
    {
        public int Id { get; set; }

        public int PropertyId { get; set; }
        public Property? Property { get; set; }
        public string? UserId { get; set; }   
        public ApplicationUser? User { get; set; }
        public string TenantName { get; set; } = string.Empty;
        public string TenantEmail { get; set; } = string.Empty;

        public decimal MonthlyRent { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        public bool IsActive { get; set; } = true;
        public ICollection<RentPayment> Payments { get; set; } = new List<RentPayment>();


    }
}
