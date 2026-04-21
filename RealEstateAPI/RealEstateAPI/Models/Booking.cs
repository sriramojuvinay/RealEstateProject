using System;
using System.ComponentModel.DataAnnotations;

namespace RealEstateAPI.Models
{
    public class Booking
    {
        [Key]
        public int Id { get; set; }

        public string? UserId { get; set; }
        public ApplicationUser? User { get; set; }

        public int PropertyId { get; set; }
        public Property? Property { get; set; }

        public DateTime BookingDate { get; set; }

        public string Status { get; set; } = "Pending";

        
        public int? ConversationId { get; set; }
    }
}