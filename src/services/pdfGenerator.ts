import { jsPDF } from 'jspdf';

export const generateSetupGuidePdf = (): void => {
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

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 18) {
      doc.addPage();
      y = margin;
      drawPageHeaderFooter();
    }
  };

  const drawPageHeaderFooter = () => {
    const currentPage = doc.getNumberOfPages();
    // Header
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageWidth, 12, 'F');
    doc.setTextColor(229, 9, 20); // Crimson red
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('iMovies', margin, 8);
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.text('Complete Setup & Execution Guide • Production Manual', margin + 18, 8);

    // Footer
    doc.setFillColor(15, 23, 42);
    doc.rect(0, pageHeight - 10, pageWidth, 10, 'F');
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(8);
    doc.text('Confidential & Developer Reference — IMovies Engineering System', margin, pageHeight - 3.5);
    doc.text(`Page ${currentPage}`, pageWidth - margin, pageHeight - 3.5, { align: 'right' });
  };

  // --- COVER / TITLE BANNER ---
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 55, 'F');

  // Red accent line
  doc.setFillColor(229, 9, 20);
  doc.rect(0, 52, pageWidth, 3, 'F');

  doc.setTextColor(229, 9, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.text('iMovies', margin, 24);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text('Online Movie Ticket Booking System', margin, 34);

  doc.setTextColor(203, 213, 225);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Full-Stack Setup, Configuration, Execution & Deployment Manual', margin, 44);

  y = 66;

  // --- SECTION: OVERVIEW ---
  doc.setTextColor(229, 9, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('1. Project Overview & Architecture', margin, y);
  y += 7;

  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  const overviewText = 
    'IMovies is a full-featured, high-performance cinema ticketing platform engineered with React, Vite, Tailwind CSS, Node.js Express REST APIs, and concurrency-safe seat booking engines. It supports real-time multi-tier seat maps, show scheduling, digital ticket QR generation, demo payment workflows, user dashboards, and comprehensive cinema administration.';
  const splitOverview = doc.splitTextToSize(overviewText, contentWidth);
  doc.text(splitOverview, margin, y);
  y += splitOverview.length * 5 + 4;

  // Architecture Callout Box
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('CORE STACK SPECIFICATION', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('• Frontend: React 19 + TypeScript + Vite 8 + Tailwind CSS 4 + Lucide Icons', margin + 4, y + 11);
  doc.text('• Backend API: Node.js + Express + REST Endpoints + JWT Auth + Atomic Locks', margin + 4, y + 16);
  doc.text('• Database: Dual-engine support (MongoDB / Mongoose + Zero-Config In-Memory Fallback)', margin + 4, y + 21);
  y += 28;

  // --- SECTION: PREREQUISITES ---
  checkPageBreak(30);
  doc.setTextColor(229, 9, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('2. System Prerequisites', margin, y);
  y += 7;

  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text('Before running the project locally, verify the following are installed on your machine:', margin, y);
  y += 6;

  const prereqs = [
    ['Node.js', 'Version 18.0.0 or higher (v20+ or v22+ recommended)'],
    ['npm / pnpm / yarn', 'Node Package Manager (npm v9.0+ included with Node)'],
    ['Modern Browser', 'Google Chrome, Microsoft Edge, Safari, or Mozilla Firefox'],
    ['MongoDB (Optional)', 'MongoDB v6.0+ local daemon or MongoDB Atlas URI (Auto-fallback included)'],
  ];

  for (const [title, desc] of prereqs) {
    doc.setFont('helvetica', 'bold');
    doc.text(`• ${title}:`, margin + 2, y);
    doc.setFont('helvetica', 'normal');
    doc.text(desc, margin + 35, y);
    y += 5.5;
  }
  y += 4;

  // --- SECTION: STEP-BY-STEP SETUP ---
  checkPageBreak(50);
  doc.setTextColor(229, 9, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('3. Step-by-Step Installation & Setup', margin, y);
  y += 7;

  const steps = [
    {
      step: 'Step 1: Clone or Open the Repository',
      desc: 'Open your terminal in the root folder containing package.json and vite.config.ts:',
      cmd: 'cd imovies',
    },
    {
      step: 'Step 2: Install Project Dependencies',
      desc: 'Install all frontend and backend packages using npm clean install:',
      cmd: 'npm install',
    },
    {
      step: 'Step 3: Configure Environment Variables',
      desc: 'Copy the sample environment file to create your local .env configuration:',
      cmd: 'cp .env.example .env',
    },
    {
      step: 'Step 4: Launch the Development Server',
      desc: 'Start the live development server on port 3000:',
      cmd: 'npm run dev',
    },
    {
      step: 'Step 5: Access the Web Application',
      desc: 'Open your browser and navigate to the local host address:',
      cmd: 'http://localhost:3000',
    },
  ];

  for (const s of steps) {
    checkPageBreak(22);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(s.step, margin, y);
    y += 4.5;

    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(s.desc, margin, y);
    y += 4.5;

    // Command box
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(margin, y, contentWidth, 7, 1.5, 1.5, 'F');
    doc.setTextColor(52, 211, 153); // Emerald code
    doc.setFont('courier', 'bold');
    doc.setFontSize(8.5);
    doc.text(`$ ${s.cmd}`, margin + 4, y + 4.8);
    y += 10;
  }

  // --- SECTION: DEFAULT CREDENTIALS ---
  checkPageBreak(40);
  doc.setTextColor(229, 9, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('4. Pre-configured Demo Accounts', margin, y);
  y += 7;

  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('For rapid testing and grading, the system is pre-seeded with two active accounts:', margin, y);
  y += 6;

  // Credential Table
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, y, contentWidth, 24, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Role', margin + 4, y + 5);
  doc.text('Email Address', margin + 35, y + 5);
  doc.text('Password', margin + 95, y + 5);
  doc.text('Access Scope', margin + 130, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  // User Row
  doc.text('User (Customer)', margin + 4, y + 12);
  doc.text('user@imovies.com', margin + 35, y + 12);
  doc.text('user123', margin + 95, y + 12);
  doc.text('Booking, Tickets, Profile', margin + 130, y + 12);

  // Admin Row
  doc.text('Administrator', margin + 4, y + 19);
  doc.text('admin@imovies.com', margin + 35, y + 19);
  doc.text('admin123', margin + 95, y + 19);
  doc.text('Full Cinema Administration', margin + 130, y + 19);
  y += 30;

  // --- SECTION: CONCURRENCY & SEAT LOCKING ---
  checkPageBreak(45);
  doc.setTextColor(229, 9, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('5. Concurrency & Double-Booking Protection', margin, y);
  y += 7;

  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const concurrencyText = 
    'A critical cinema ticketing requirement is preventing two users from purchasing the exact same seat. IMovies implements an atomic verification cycle:\n' +
    '1. Show & Seat Re-validation: When a user clicks "Confirm & Pay", the system locks the show record.\n' +
    '2. Collision Detection: An intersection between requested seats and already booked seats is evaluated.\n' +
    '3. Atomic Committal: If any collision is found, the transaction is rejected with an HTTP 409 Conflict. If clean, seats are appended atomically and a cryptographic booking reference (e.g., IMV-839210) is issued.';
  const splitConcurrency = doc.splitTextToSize(concurrencyText, contentWidth);
  doc.text(splitConcurrency, margin, y);
  y += splitConcurrency.length * 4.5 + 6;

  // --- SECTION: TROUBLESHOOTING ---
  checkPageBreak(45);
  doc.setTextColor(229, 9, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('6. Common Troubleshooting & FAQs', margin, y);
  y += 7;

  const faqs = [
    ['Port 3000 Already In Use:', 'Run `npx kill-port 3000` or specify a different port: `npm run dev -- --port 3001`.'],
    ['MongoDB Connection Warning:', 'If local MongoDB is not running, the system automatically uses its in-memory zero-config datastore.'],
    ['Resetting Demo Data:', 'Click "Reset Demo Data" inside the application footer to instantly restore factory seed records.'],
    ['Downloading Tickets:', 'Go to "Your Bookings" and click "Download Ticket (PDF)" to get your offline cinema pass.'],
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
    y += 5.5;
  }

  // Draw header/footers on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    // Draw on top
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 12, 'F');
    doc.setTextColor(229, 9, 20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('iMovies', margin, 8);
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.text('Complete Setup & Execution Guide • Production Manual', margin + 18, 8);

    doc.setFillColor(15, 23, 42);
    doc.rect(0, pageHeight - 10, pageWidth, 10, 'F');
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(8);
    doc.text('Confidential & Developer Reference — IMovies Engineering System', margin, pageHeight - 3.5);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 3.5, { align: 'right' });
  }

  doc.save('IMOVIES_SETUP_AND_EXECUTION_GUIDE.pdf');
};
