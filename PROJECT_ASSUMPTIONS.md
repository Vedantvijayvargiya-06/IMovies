# IMovies — Project Assumptions & Architectural Decisions

## 1. Concurrency Management
- Cinema seat booking requires strict collision prevention. The application implements atomic reservation verification: checking the live `bookedSeats` set before committal. If any seat is already booked, the reservation is rejected with an explanatory conflict message.

## 2. Dual-Engine Persistence
- In local development or standalone browser testing where a MongoDB daemon may not be active, the system automatically uses a zero-config, persistent storage engine so all CRUD actions (adding movies, scheduling shows, reserving seats, cancelling bookings) function flawlessly without crashing or external blockers.

## 3. Demo Payment Simulation
- Since real bank payment gateways require merchant credentials, an enterprise-grade sandbox payment gateway with UPI (GPay/PhonePe), Credit/Debit Card, NetBanking, and Cinema Wallet was implemented. It simulates real 256-bit SSL transaction clearance and generates verifiable transaction IDs.

## 4. Ticketing & PDF Deliverables
- E-Tickets are generated using `jsPDF` into cinema boarding pass slips containing booking reference, QR simulation, barcodes, theatre details, and attendee names.
- The user requested a detailed, step-by-step PDF manual explaining how to run and set up the project. Both a standalone Node generation script (`scripts/generateGuidePdf.js`) and in-app client-side downloads are implemented to provide `IMOVIES_SETUP_AND_EXECUTION_GUIDE.pdf`.
