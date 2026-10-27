# IMovies — Online Movie Ticket Booking System

A production-grade, full-stack online movie ticket booking platform built with **React, Vite, TypeScript, Tailwind CSS, Node.js / Express, and atomic seat concurrency management**.

---

## 📑 Quick Links & Downloads

- 📥 **[Download Setup & Execution Guide (PDF)](./IMOVIES_SETUP_AND_EXECUTION_GUIDE.pdf)** (Also available in `/public/IMOVIES_SETUP_AND_EXECUTION_GUIDE.pdf` and directly inside the web app with 1 click).
- 🎬 **Pre-seeded Blockbusters**: *They Call Him OG*, *RRR*, *Avatar: Fire and Ash*, *Toxic*, *G2*, *Chhatrapati Shivaji Maharaj*, *Baahubali 2*, *Kalki 2898 AD*.
- 🏢 **Partner Theatres**: Srinivasa 4K Laser Dolby Atmos, Gokul 70mm, PVR Superplex IMAX & Luxe, INOX Megaplex.

---

## 🚀 Key Features

1. **Cinematic Responsive UI**:
   - Modern dark theme (`#020617` and crimson red `#e50914` accents).
   - Hero carousel with blockbuster trailers, ratings, and instant booking triggers.
   - Movie catalog with real-time search and multi-filtering (Genre, Language, Format, Now Showing vs. Upcoming).
   - Detailed movie modal with cast, director, synopsis, formats, and certification tags.

2. **Theatre & Showtimes Scheduler**:
   - Interactive date selector (Today, Tomorrow, Upcoming dates).
   - Showtimes grouped by partner multiplexes with screen numbers and audio formats (IMAX 3D, Dolby Atmos, 4K Laser).
   - Live seat inventory indicators ("Filling Fast", seat count remaining).

3. **Interactive 3-Tier Seat Matrix Engine**:
   - Curved silver cinema screen with ambient light projection ("Screen this way").
   - Categorized tiers:
     - **Balcony / VIP**: Plush recliners, prime elevation (Rows A, B, C).
     - **Middle / Executive**: Center eye-level sweet spot (Rows D, E, F, G, H).
     - **Lower / Standard**: Front stalls (Rows J, K, L).
   - Clear visual statuses: Available, Selected (crimson glow with checkmark), and Already Booked (dark crossed out).
   - Dynamic cart summary sidebar with instant fare calculation, convenience fees, and GST breakdown.

4. **Concurrency & Double-Booking Protection**:
   - Atomic seat reservation cycle prevents two users from booking the same seat for the same show.
   - Immediate conflict detection with descriptive seat collision messages.

5. **Demo Payment Gateway & E-Ticket Generation**:
   - Realistic multi-mode checkout (UPI / QR, Credit/Debit Card, Net Banking, IMovies Cinema Wallet).
   - Simulated bank processing with celebratory confetti on success.
   - **Direct PDF E-Ticket Download**: Generates high-resolution cinema boarding pass with barcode and booking reference (`IMV-XXXXXX`).

6. **Customer Portal ("Your Bookings")**:
   - Active and past booking history with movie posters, venue, timing, and seat numbers.
   - 1-click "Download Ticket (PDF)".
   - Instant ticket cancellation with automatic seat liberation back to the show.

7. **Administrator Control Center**:
   - Real-time cinema analytics: Gross Revenue (₹), Total Bookings, Active Movies, Partner Theatres, Occupancy Rate (%).
   - **Movies Manager**: Publish new films, edit metadata, delete discontinued films.
   - **Theatres Manager**: Add new partner multiplexes, configure screen count and tier pricing.
   - **Showtimes Scheduler**: Schedule movie screenings across theatres, screens, dates, and times.
   - **Master Bookings Ledger**: Search bookings by reference or customer, view payment IDs, and process admin refunds.

---

## 👥 Default Demo Credentials

The application is pre-seeded with two accounts for frictionless evaluation:

| Role | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Customer (User)** | `user@imovies.com` | `user123` | Browse films, book seats, download PDF tickets, cancel reservations |
| **Administrator** | `admin@imovies.com` | `admin123` | Full cinema management, add movies/shows, view gross revenue & metrics |

*Note: You can switch between User and Admin roles instantly using the quick toggle in the navigation bar!*

---

## 🛠️ Step-by-Step Installation & Local Execution

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (`node -v`)
- **npm**: v9.0.0 or higher (`npm -v`)
- Modern web browser (Chrome, Edge, Firefox, Safari)

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy the sample environment file:
```bash
cp .env.example .env
```

### 4. Start the Application
Start the dev server on port 3000:
```bash
npm run dev
```

### 5. Access the Web Application
Open your browser and navigate to:
```
http://localhost:3000
```

---

## 📄 Automated PDF Documentation

To re-generate the official PDF guide from the terminal at any time:
```bash
node scripts/generateGuidePdf.js
```
This generates:
- `public/IMOVIES_SETUP_AND_EXECUTION_GUIDE.pdf`
- `IMOVIES_SETUP_AND_EXECUTION_GUIDE.pdf`

---

## 🌐 Core REST API Reference

| Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Authenticate user or administrator |
| `POST` | `/api/auth/register` | Public | Create new user or admin account |
| `GET` | `/api/movie/getmovies` | Public | Retrieve catalog of active movies |
| `POST` | `/api/movie/addmovie` | Admin Only | Add a new movie to catalog |
| `DELETE` | `/api/movie/deletemovie/:id` | Admin Only | Remove movie from cinema roster |
| `GET` | `/api/shows/getmovieshows/:name` | Public | Retrieve all scheduled shows for a film |
| `POST` | `/api/shows/addshow` | Admin Only | Schedule a new screening |
| `POST` | `/api/bookings/book` | User / JWT | Concurrency-safe atomic seat booking |
| `POST` | `/api/bookings/cancel` | User / JWT | Cancel ticket and release reserved seats |
| `GET` | `/api/bookings/allbookings` | Admin Only | Audit master ledger of all cinema bookings |

---

## 🛡️ Concurrency & Double-Booking Safety

When multiple customers attempt to purchase the exact same seat simultaneously:
1. The transaction intercepts the chosen seats array.
2. The show record is queried and existing `bookedSeats` are inspected.
3. If an overlap exists, an HTTP 409 Conflict error is returned with the exact conflicting seats.
4. If clear, the seats are appended atomically and a cryptographic booking reference (e.g. `IMV-839210`) is generated.

---

## 💻 Tech Stack Summary

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS 4, Lucide Icons, canvas-confetti, jsPDF
- **Backend**: Node.js, Express, REST APIs, JWT authentication, atomic concurrency engine
- **Persistence**: Dual-engine architecture (MongoDB/Mongoose adapter with instant zero-config in-memory fallback)
- **Export Engine**: Client-side & server-side PDF generator for tickets and deployment manuals
