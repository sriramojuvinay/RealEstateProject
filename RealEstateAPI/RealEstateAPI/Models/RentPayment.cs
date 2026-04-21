namespace RealEstateAPI.Models
{
    public class RentPayment
    {
        public int Id { get; set; }

        public int RentalAgreementId { get; set; }

        public decimal Amount { get; set; }

        public int Month { get; set; }  

        public int Year { get; set; }

        public bool IsPaid { get; set; }

        public DateTime? PaidDate { get; set; }

        public RentalAgreement? RentalAgreement { get; set; }
    }
}
