namespace RealEstateAPI.DTOs
{
    public class BookingDto
    {
        public int Id { get; set; }
        public DateTime BookingDate { get; set; }

        public PropertyDto? Property { get; set; }
    }
}