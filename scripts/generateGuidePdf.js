import { jsPDF } from 'jspdf';
import fs from 'node:fs';
import path from 'node:path';

function generateGuide() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  let y = margin;

  const checkPageBreak = (neededHeight) => {
    if (y + neededHeight > pageHeight - 18) {
      doc.addPage();
      y = margin + 12;
    }
  };

  // Header Title
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 55, 'F');
  doc.setFillColor(229, 9, 20); // Crimson
  doc.rect(0, 52, pageWidth, 3, 'F');

  doc.setTextColor(229, 9, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.text('iMovies', margin, 24);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.text('Online Movie Ticket Booking System', margin, 34);

  doc.setTextColor(203, 213, 225);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Full-Stack Setup, Configuration, Execution & Deployment Manual', margin, 44);

  y = 66;

  // 1. Overview
  doc.setTextColor(229, 9, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('1. Project Overview & System Architecture', margin, y);
  y += 7;

  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const overviewText = 
    'IMovies is an enterprise-grade online movie ticketing web application built with a modern React SPA on Vite, Tailwind CSS, Express REST APIs, and atomic seat reservation algorithms. It features responsive cinema UI, multi-tier seat matrices, showtime scheduling, instant e-ticket generation, role-based access control, and complete cinema administration.';
  const split1 = doc.splitTextToSize(overviewText, contentWidth);
  doc.text(split1, margin, y);
  y += split1.length * 4.5 + 4;

  // Box
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('TECH STACK SPECIFICATION', margin + 4, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('• Frontend: React 19 + TypeScript + Vite 8 + Tailwind CSS 4 + Lucide Icons + jsPDF', margin + 4, y + 10);
  doc.text('• Backend API: Node.js Express REST APIs + JWT Auth Middleware + Concurrency Locks', margin + 4, y + 15);
  y += 26;

  // 2. Prerequisites
  checkPageBreak(30);
  doc.setTextColor(229, 9, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('2. System Prerequisites', margin, y);
  y += 7;

  const prereqs = [
    ['Node.js', 'Version 18.0.0 or higher (v20+ / v22+ recommended)'],
    ['npm / pnpm / yarn', 'Node Package Manager (npm v9.0+ included with Node)'],
    ['Modern Web Browser', 'Chrome, Edge, Safari, or Firefox with HTML5 & Canvas support'],
    ['MongoDB (Optional)', 'Local MongoDB daemon or MongoDB Atlas URI (Auto-fallback included)'],
  ];

  for (const [title, desc] of prereqs) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`• ${title}:`, margin + 2, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(desc, margin + 40, y);
    y += 5;
  }
  y += 4;

  // 3. Step by step
  checkPageBreak(50);
  doc.setTextColor(229, 9, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('3. Step-by-Step Installation & Local Execution', margin, y);
  y += 7;

  const steps = [
    {
      title: 'Step 1: Open the Project Directory',
      desc: 'Open your terminal in the root project folder containing package.json:',
      cmd: 'cd imovies',
    },
    {
      title: 'Step 2: Install Dependencies',
      desc: 'Install all required frontend and backend libraries clean:',
      cmd: 'npm install',
    },
    {
      title: 'Step 3: Create Environment Configuration',
      desc: 'Copy the sample environment file to configure ports and keys:',
      cmd: 'cp .env.example .env',
    },
    {
      title: 'Step 4: Launch the Live Application',
      desc: 'Start the Vite & Express development server:',
      cmd: 'npm run dev',
    },
    {
      title: 'Step 5: Access the Web Application',
      desc: 'Open your browser and navigate to the application address:',
      cmd: 'http://localhost:3000',
    },
  ];

  for (const s of steps) {
    checkPageBreak(20);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text(s.title, margin, y);
    y += 4;

    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(s.desc, margin, y);
    y += 4;

    doc.setFillColor(15, 23, 42);
    doc.roundedRect(margin, y, contentWidth, 6.5, 1.5, 1.5, 'F');
    doc.setTextColor(52, 211, 153);
    doc.setFont('courier', 'bold');
    doc.setFontSize(8);
    doc.text(`$ ${s.cmd}`, margin + 4, y + 4.5);
    y += 9.5;
  }

  // 4. Default accounts
  checkPageBreak(35);
  doc.setTextColor(229, 9, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('4. Pre-configured Demo Accounts', margin, y);
  y += 7;

  doc.setFillColor(248, 250, 252);
  doc.rect(margin, y, contentWidth, 20, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Role', margin + 4, y + 4.5);
  doc.text('Email', margin + 35, y + 4.5);
  doc.text('Password', margin + 90, y + 4.5);
  doc.text('Permissions', margin + 125, y + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Customer User', margin + 4, y + 10.5);
  doc.text('user@imovies.com', margin + 35, y + 10.5);
  doc.text('user123', margin + 90, y + 10.5);
  doc.text('Book tickets, Download PDF', margin + 125, y + 10.5);

  doc.text('Administrator', margin + 4, y + 16.5);
  doc.text('admin@imovies.com', margin + 35, y + 16.5);
  doc.text('admin123', margin + 90, y + 16.5);
  doc.text('Manage movies, shows, stats', margin + 125, y + 16.5);
  y += 26;

  // 5. Concurrency
  checkPageBreak(40);
  doc.setTextColor(229, 9, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('5. Concurrency & Double-Booking Prevention', margin, y);
  y += 7;

  const concText = 
    'A key feature of IMovies is atomic seat validation. Before a booking is confirmed:\n' +
    '1. The backend locks the show record and extracts the currently bookedSeats array.\n' +
    '2. If any chosen seat intersects with bookedSeats, the transaction immediately terminates with HTTP 409 Conflict.\n' +
    '3. Only when all seats are free does the reservation commit, ensuring zero double-booking occurrences.';
  const splitConc = doc.splitTextToSize(concText, contentWidth);
  doc.text(splitConc, margin, y);
  y += splitConc.length * 4.5 + 6;

  // 6. Troubleshooting
  checkPageBreak(35);
  doc.setTextColor(229, 9, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('6. Troubleshooting & Tips', margin, y);
  y += 7;

  const faqs = [
    ['Port Conflict (EADDRINUSE):', 'Run `npx kill-port 3000` or specify a new port: `npm run dev -- --port 3001`.'],
    ['Resetting Demo Data:', 'Click the "Reset Demo Data" button in the website footer anytime.'],
    ['Generating Tickets:', 'Bookings generate an instant PDF boarding pass available in "Your Bookings".'],
  ];

  for (const [q, a] of faqs) {
    checkPageBreak(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`• ${q}`, margin, y);
    y += 4;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(a, margin + 4, y);
    y += 5;
  }

  // Draw header/footers on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 10, 'F');
    doc.setTextColor(229, 9, 20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('iMovies', margin, 6.5);
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.text('Complete Setup & Execution Guide • Production Manual', margin + 16, 6.5);

    doc.setFillColor(15, 23, 42);
    doc.rect(0, pageHeight - 10, pageWidth, 10, 'F');
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(8);
    doc.text('Confidential & Developer Reference — IMovies Engineering System', margin, pageHeight - 3.5);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 3.5, { align: 'right' });
  }

  // Ensure directories exist
  if (!fs.existsSync('public')) {
    fs.mkdirSync('public', { recursive: true });
  }

  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  fs.writeFileSync('public/IMOVIES_SETUP_AND_EXECUTION_GUIDE.pdf', pdfBuffer);
  fs.writeFileSync('IMOVIES_SETUP_AND_EXECUTION_GUIDE.pdf', pdfBuffer);
  console.log('PDF Guide generated successfully at public/IMOVIES_SETUP_AND_EXECUTION_GUIDE.pdf and IMOVIES_SETUP_AND_EXECUTION_GUIDE.pdf');
}

generateGuide();
