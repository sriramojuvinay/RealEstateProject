namespace RealEstateAPI.Models
{
    public class Message
    {
        public int Id { get; set; }
        public int ConversationId { get; set; }

        public string? SenderId { get; set; }
        public string? Text { get; set; }
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
    }
}
