import { jsPDF } from 'jspdf';
import { Booking } from '../types';

export const generateTicketPdf = (booking: Booking): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [120, 210], // Cinema ticket slip format
  });

  // Dark Theme Background
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 120, 210, 'F');

  // Red Header Banner
  doc.setFillColor(229, 9, 20); // Crimson red
  doc.rect(0, 0, 120, 28, 'F');

  // Brand Header
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('iMovies', 12, 18);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('CINEMA E-TICKET', 108, 14, { align: 'right' });
  doc.text('CONFIRMED ENTRY', 108, 20, { align: 'right' });

  // Cut-out notch decoration
  doc.setFillColor(15, 23, 42);
  doc.circle(0, 75, 4, 'F');
  doc.circle(120, 75, 4, 'F');

  // Dashed separator
  doc.setDrawColor(71, 85, 105);
  doc.setLineDashPattern([2, 2], 0);
  doc.line(8, 75, 112, 75);
  doc.setLineDashPattern([], 0);

  // Movie Details
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  // Split long title if needed
  const titleLines = doc.splitTextToSize(booking.movieTitle, 95);
  doc.text(titleLines, 12, 40);

  doc.setTextColor(203, 213, 225); // slate-300
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${booking.format} • ${booking.theatreName.split(' ')[0]} Screen ${booking.screenNumber}`, 12, 52);

  doc.setTextColor(148, 163, 184); // slate-400
  doc.setFontSize(8);
  doc.text(booking.theatreLocation, 12, 59);

  // Show Timing Box
  doc.setFillColor(30, 41, 59); // slate-800
  doc.roundedRect(12, 82, 96, 26, 3, 3, 'F');

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8);
  doc.text('DATE', 20, 90);
  doc.text('SHOWTIME', 68, 90);

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(booking.showDate, 20, 98);
  doc.text(booking.showTime, 68, 98);

  // Seat Details Box
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(12, 114, 96, 32, 3, 3, 'F');

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('SEATS', 20, 122);
  doc.text('CATEGORY', 60, 122);
  doc.text('TOTAL FARE', 88, 122);

  doc.setTextColor(229, 9, 20); // Crimson highlight
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(booking.seats.join(', '), 20, 134);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(booking.tier, 60, 133);
  doc.text(`₹${booking.totalAmount}`, 88, 133);

  // Snacks & Discounts if present
  let curY = 152;
  if (booking.snacks && booking.snacks.length > 0) {
    doc.setTextColor(203, 213, 225);
    doc.setFontSize(8);
    const snacksText = booking.snacks.map(s => `${s.quantity}x ${s.name}`).join(', ');
    doc.text(`Snacks: ${snacksText}`, 12, curY);
    curY += 6;
  }
  if (booking.discountAmount && booking.discountAmount > 0) {
    doc.setTextColor(34, 197, 94); // emerald-500
    doc.setFontSize(8);
    doc.text(`Promo Discount: -₹${booking.discountAmount} (${booking.promoCode || 'Applied'})`, 12, curY);
    curY += 6;
  }

  // Attendee Info
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Booking Ref: ${booking.id}`, 12, curY);
  doc.text(`Guest: ${booking.userName} (${booking.userPhone || booking.userEmail})`, 12, curY + 6);
  doc.text(`Payment ID: ${booking.paymentId} via ${booking.paymentMethod}`, 12, curY + 12);

  // Barcode / Simulated QR box
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(12, 175, 96, 20, 2, 2, 'F');

  // Draw simulated barcode lines
  doc.setFillColor(0, 0, 0);
  let x = 16;
  const barPattern = [2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 1, 4, 1, 3, 2];
  for (const width of barPattern) {
    doc.rect(x, 176, width * 0.7, 12, 'F');
    x += width * 0.7 + 1.2;
    if (x > 102) break;
  }

  doc.setTextColor(51, 65, 85);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(`* ${booking.id} * SCAN AT TURNSTILE GATE`, 60, 192, { align: 'center' });

  // Footer Note
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(6.5);
  doc.text('Please arrive 15 minutes before showtime. Outside food & drinks not permitted.', 60, 203, { align: 'center' });

  doc.save(`IMovies_Ticket_${booking.id}.pdf`);
};
