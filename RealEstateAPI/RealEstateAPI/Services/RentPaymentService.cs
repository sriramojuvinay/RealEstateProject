using Microsoft.EntityFrameworkCore;
using RealEstateAPI.Data;
using RealEstateAPI.Models;

namespace RealEstateAPI.Services
{
    public class RentPaymentService
    {
        private readonly AppDbContext _context;

        public RentPaymentService(AppDbContext context)
        {
            _context = context;
        }

        // ✅ GET HISTORY
        public async Task<List<RentPayment>> GetPayments(int agreementId)
        {
            return await _context.RentPayments
                .Where(p => p.RentalAgreementId == agreementId)
                .AsNoTracking()
                .OrderBy(p => p.Month)
                .ToListAsync();
        }

        // ✅ MARK AS PAID (NO IActionResult HERE)
        public async Task<bool> MarkAsPaid(int id)
        {
            var payment = await _context.RentPayments
                .Include(p => p.RentalAgreement)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (payment == null)
                return false;

            if (!payment.RentalAgreement.IsActive)
                throw new Exception("Rental ended");

            payment.IsPaid = true;

            await _context.SaveChangesAsync();

            return true;
        }

        // ✅ GENERATE RENT
        public async Task GenerateRent(int agreementId)
        {
            var agreement = await _context.RentalAgreements
                .FirstOrDefaultAsync(r => r.Id == agreementId);

            if (agreement == null) return;

            for (int i = 1; i <= 12; i++)
            {
                var exists = await _context.RentPayments.AnyAsync(p =>
                    p.RentalAgreementId == agreementId &&
                    p.Month == i);

                if (exists) continue;

                _context.RentPayments.Add(new RentPayment
                {
                    RentalAgreementId = agreementId,
                    Amount = agreement.MonthlyRent,
                    Month = i,
                    Year = DateTime.Now.Year,
                    IsPaid = false
                });
            }

            await _context.SaveChangesAsync();
        }
    }
}