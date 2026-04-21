using Microsoft.AspNetCore.Mvc;
using RealEstateAPI.Services;

namespace RealEstateAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RentPaymentController : ControllerBase
    {
        private readonly RentPaymentService _service;

        public RentPaymentController(RentPaymentService service)
        {
            _service = service;
        }

        // ✅ GET HISTORY
        [HttpGet("history/{agreementId}")]
        public async Task<IActionResult> GetHistory(int agreementId)
        {
            var data = await _service.GetPayments(agreementId);
            return Ok(data);
        }

        // ✅ MARK AS PAID
        [HttpPost("pay/{id}")]
        public async Task<IActionResult> MarkAsPaid(int id)
        {
            try
            {
                var result = await _service.MarkAsPaid(id);

                if (!result)
                    return NotFound();

                return Ok("Payment marked as paid");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}