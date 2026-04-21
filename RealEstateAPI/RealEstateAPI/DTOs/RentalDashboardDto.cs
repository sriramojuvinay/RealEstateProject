namespace RealEstateAPI.DTOs
{
    public class RentalDashboardDto
    {
        public int AgreementId { get; set; }

        public string? PropertyTitle { get; set; }
        public string? Location { get; set; }

        public string? TenantName { get; set; }

        public decimal MonthlyRent { get; set; }

        public bool CurrentMonthPaid { get; set; }

        public decimal TotalDue { get; set; }

        public DateTime? LastPaymentDate { get; set; }
        public string? ImageUrl { get; set; }
        public int? PaymentId { get; set; }
    }
}
