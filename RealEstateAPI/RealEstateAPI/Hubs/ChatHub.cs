using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using RealEstateAPI.Data;
using RealEstateAPI.Models;

namespace RealEstateAPI.Hubs
{
    public class ChatHub : Hub
    {
        private readonly AppDbContext _context;

        // ✅ FIX: Inject DbContext
        public ChatHub(AppDbContext context)
        {
            _context = context;
        }

        // ✅ JOIN GROUP
        public async Task JoinConversation(int conversationId)
        {
            Console.WriteLine("JOIN → " + conversationId);

            await Groups.AddToGroupAsync(
                Context.ConnectionId,
                $"conversation-{conversationId}"
            );
        }

        // ✅ SEND MESSAGE
        public async Task SendMessage(int conversationId, string userId, string message)
        {
            Console.WriteLine($"SEND → convo:{conversationId}, user:{userId}, msg:{message}");

            var convo = await _context.Conversations
                .FirstOrDefaultAsync(c => c.Id == conversationId);

            if (convo == null)
            {
                Console.WriteLine("❌ Conversation NOT FOUND");
                throw new Exception("Conversation not found");
            }

            var msg = new Message
            {
                ConversationId = conversationId,
                SenderId = userId,
                Text = message,
                SentAt = DateTime.UtcNow
            };

            _context.Messages.Add(msg);
            await _context.SaveChangesAsync();

            await Clients.Group($"conversation-{conversationId}")
                .SendAsync("ReceiveMessage", userId, message);
        }
    }
}