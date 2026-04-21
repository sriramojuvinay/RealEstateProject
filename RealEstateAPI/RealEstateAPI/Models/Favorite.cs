using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace RealEstateAPI.Models
{
    public class Favorite
    {
        public int Id { get; set; }

        public string? UserId { get; set; } 
        public int PropertyId { get; set; }

        
        public Property? Property { get; set; }
    }
}
