
using System.ComponentModel.DataAnnotations.Schema;

namespace RealEstateAPI.Models
{
    public class Conversation
    {
        public int Id { get; set; }
        public string? UserId { get; set; }
        public string? AdminId { get; set; }
        public int? PropertyId { get; set; }

        public List<Message>? Messages { get; set; }

        [ForeignKey("PropertyId")]
        public Property Property { get; set; }
    }
}
