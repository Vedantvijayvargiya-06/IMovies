# 🎬 IMovies — Movie Ticket Booking Demo

**IMovies** is a vibe-coded, full-stack movie ticket booking demo website created for learning, experimentation, and educational purposes.

🌐 **Live Demo:** [imovieticket.netlify.app](https://imovieticket.netlify.app/)

📂 **GitHub Repository:** [IMovies](https://github.com/Vedantvijayvargiya-06/IMovies)

> **⚠️ Disclaimer:** This is a demo project built for learning purposes. It is not a production-ready ticket booking platform. Features, data, and workflows may be incomplete, simulated, or subject to change. Please do not use real payment information or rely on this website for actual bookings.

## ✨ About the Project

IMovies was created as a hands-on learning project to explore full-stack web development, AI-assisted coding (vibe coding), frontend design, backend APIs, database integration, and deployment.

The goal is to experiment with building a movie-focused web application and understand how its different parts work together.

## 🛠️ Tech Stack

**Frontend**
- React
- TypeScript
- Vite
- HTML and CSS

**Backend**
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- bcrypt
- JSON Web Tokens (JWT)

**Deployment**
- Netlify — Frontend
- Render — Backend
- MongoDB Atlas — Database

## 🚀 Features

Depending on the current implementation, the project includes:

- 🎥 Movie-focused user interface
- 🔐 User registration and login
- 🗄️ MongoDB database integration
- 🔑 Password hashing and token-based authentication
- 📱 Responsive web design
- ⚡ React and Vite development workflow
- ☁️ Live demo deployment

Some features may be demonstrations or partially implemented. The application should not be considered a complete commercial ticket booking service.

## 💻 Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/Vedantvijayvargiya-06/IMovies.git
cd IMovies
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd server
npm install
cd ..
```

### 4. Configure environment variables

Create a `.env` file inside the `server` folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_private_jwt_secret
```

Replace the placeholder values with your own configuration. Never upload secrets or database credentials to GitHub.

### 5. Start the backend

From the project root:

```bash
npm run server
```

### 6. Start the frontend

Open a second terminal in the project root:

```bash
npm run dev
```

Open the local URL displayed by Vite.

### 7. Build the frontend

```bash
npm run build
```

## 📁 Project Structure

```text
IMovies/
├── src/
│   ├── api/
│   ├── pages/
│   └── ...
├── server/
│   ├── models/
│   ├── routes/
│   └── server.js
├── public/
├── package.json
├── vite.config.ts
└── README.md
```

## 🧠 What I Learned

This project is an opportunity to learn and experiment with:

- Building interfaces with React and TypeScript
- Connecting a frontend to a REST API
- Implementing basic authentication flows
- Working with MongoDB and Mongoose
- Using environment variables for configuration
- Deploying a frontend and backend separately
- Exploring AI-assisted development through vibe coding
- Debugging and improving a full-stack application

## ⚠️ Limitations

- This project is intended for learning and demonstration, not commercial use.
- Some functionality may be incomplete, simulated, or unverified.
- No real ticket purchase, payment, or refund should be assumed.
- Security and production readiness have not been independently audited.
- Availability of the live demo depends on the hosting services.

## 👨‍💻 Author

**Vedant Vijay**

GitHub: [@Vedantvijayvargiya-06](https://github.com/Vedantvijayvargiya-06)

## 📄 License

This repository is shared for learning and demonstration. Unless a license file specifies otherwise, no additional open-source license is granted by this README.

---

*Built with curiosity, experimentation, and vibe coding. 🍿*
