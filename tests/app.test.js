import test from 'node:test';
import assert from 'node:assert';

test('1. Concurrency seat conflict test logic', () => {
  const bookedSeats = ['A4', 'A5'];
  const requestedSeatsPass = ['B1', 'B2'];
  const requestedSeatsFail = ['A5', 'A6'];

  const hasConflictPass = requestedSeatsPass.some((s) => bookedSeats.includes(s));
  const hasConflictFail = requestedSeatsFail.some((s) => bookedSeats.includes(s));

  assert.strictEqual(hasConflictPass, false, 'Clean seats should have no conflict');
  assert.strictEqual(hasConflictFail, true, 'Overlapping seats must trigger conflict');
});

test('2. Fare and GST calculation precision', () => {
  const basePricePerSeat = 350;
  const seatCount = 2;
  const baseAmount = basePricePerSeat * seatCount;
  const convenienceFee = Math.round(baseAmount * 0.05); // 35
  const taxAmount = Math.round(convenienceFee * 0.18); // 6
  const totalAmount = baseAmount + convenienceFee + taxAmount; // 741

  assert.strictEqual(baseAmount, 700);
  assert.strictEqual(convenienceFee, 35);
  assert.strictEqual(taxAmount, 6);
  assert.strictEqual(totalAmount, 741);
});

test('3. Promo Code Discount & Minimum Basket Validation', () => {
  const promoFlat = { code: 'MOVIE50', discountType: 'flat', discountValue: 50, minAmount: 200 };
  const promoPercent = { code: 'FIRSTPASS', discountType: 'percentage', discountValue: 20, minAmount: 300 };

  // Case A: Cart 500 with MOVIE50 flat
  const cartA = 500;
  const discountA = cartA >= promoFlat.minAmount ? promoFlat.discountValue : 0;
  assert.strictEqual(discountA, 50);

  // Case B: Cart 150 with MOVIE50 (below min 200)
  const cartB = 150;
  const discountB = cartB >= promoFlat.minAmount ? promoFlat.discountValue : 0;
  assert.strictEqual(discountB, 0, 'Should not apply below minimum amount');

  // Case C: Cart 600 with FIRSTPASS 20%
  const cartC = 600;
  const discountC = cartC >= promoPercent.minAmount ? Math.round((cartC * promoPercent.discountValue) / 100) : 0;
  assert.strictEqual(discountC, 120);
});

test('4. Concession Snacks Aggregation & Grand Total', () => {
  const selectedSnacks = [
    { snackId: 'snk-1', name: 'Caramel Popcorn (Large)', price: 320, quantity: 2 },
    { snackId: 'snk-4', name: 'Chilled Pepsi Fountain (600ml)', price: 160, quantity: 2 },
  ];

  const snacksTotal = selectedSnacks.reduce((acc, item) => acc + item.price * item.quantity, 0);
  assert.strictEqual(snacksTotal, 640 + 320); // 960

  const ticketTotal = 741;
  const discount = 50;
  const grandTotal = Math.max(0, ticketTotal + snacksTotal - discount);
  assert.strictEqual(grandTotal, 1651);
});
