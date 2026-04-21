using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RealEstateAPI.Data;
using RealEstateAPI.DTOs;
using RealEstateAPI.Models;
using System.Security.Claims;

namespace RealEstateAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/chat")]
    public class ChatController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ChatController(AppDbContext context)
        {
            _context = context;
        }

        
        private string GetUserId()
        {
            return User.FindFirst("sub")?.Value
                ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? "";
        }


        [HttpPost("start")]
        public async Task<IActionResult> StartConversation([FromBody] StartChatDto request)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                          ?? User.FindFirst("id")?.Value;

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized("User not found");

                if (request == null || request.PropertyId == 0 || string.IsNullOrEmpty(request.AdminId))
                    return BadRequest("Invalid request");

                Console.WriteLine($"START CHAT → user:{userId}, admin:{request.AdminId}");

                var convo = await _context.Conversations.FirstOrDefaultAsync(c =>
                    c.PropertyId == request.PropertyId &&
                    c.UserId == userId &&
                    c.AdminId == request.AdminId);

                if (convo == null)
                {
                    convo = new Conversation
                    {
                        PropertyId = request.PropertyId,
                        UserId = userId,
                        AdminId = request.AdminId
                    };

                    _context.Conversations.Add(convo);
                    await _context.SaveChangesAsync();

                    Console.WriteLine("✅ Conversation created: " + convo.Id);
                }
                else
                {
                    Console.WriteLine("⚡ Existing conversation: " + convo.Id);
                }

                return Ok(convo);
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ ERROR: " + ex.Message);
                return BadRequest(ex.Message);
            }
        }


        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] MessageDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                            ?? User.FindFirst("sub")?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User not found");

            var convo = await _context.Conversations
                .FirstOrDefaultAsync(c => c.Id == dto.ConversationId);

            if (convo == null)
                return BadRequest("❌ Conversation not found");

            
            if (convo.UserId != userId && convo.AdminId != userId)
                return Unauthorized("❌ Not part of this conversation");

            var message = new Message
            {
                ConversationId = dto.ConversationId,
                SenderId = userId,
                Text = dto.Text,
                SentAt = DateTime.UtcNow
            };

            _context.Messages.Add(message);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }

            return Ok(message);
        }


        [HttpGet("{conversationId}")]
        public async Task<IActionResult> GetMessages(int conversationId)
        {
            var conversation = await _context.Conversations
                .FirstOrDefaultAsync(c => c.Id == conversationId);

            if (conversation == null)
                return NotFound();

            var property = await _context.Properties
                .FirstOrDefaultAsync(p => p.Id == conversation.PropertyId);

            var messages = await _context.Messages
                .Where(m => m.ConversationId == conversationId)
                .OrderBy(m => m.SentAt)
                .Select(m => new
                {
                    m.SenderId,
                    m.Text,
                    m.SentAt,
                    SenderName = _context.Users
                        .Where(u => u.Id == m.SenderId)
                        .Select(u => u.FullName )
                        .FirstOrDefault()
                })
                .ToListAsync();

            return Ok(new
            {
                propertyName = property.Title,
                propertyLocation = property.Location,
                messages = messages
            });
        }


        [Authorize(Roles = "Admin")]
        [HttpGet("admin")]
        public async Task<IActionResult> GetAdminChats()
        {
            var adminId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var chats = await _context.Conversations
                .Where(c => c.AdminId == adminId)
                .ToListAsync();

            return Ok(chats);
        }

    }
}