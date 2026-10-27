# 🎬 IMovies — Movie Discovery & Ticket Booking

IMovies is a movie-focused web application built with React, TypeScript, and Node.js. It features a modern user interface and a backend authentication system powered by Express.js and MongoDB.

🌐 **Live Demo:** [IMovies](https://imovieticket.netlify.app/)

📂 **GitHub Repository:** [Vedantvijayvargiya-06/IMovies](https://github.com/Vedantvijayvargiya-06/IMovies)

## ✨ Features

- 🎥 Modern movie-focused user interface
- 🔐 User registration and login
- 🔑 Password hashing with bcrypt
- 🪪 JWT-based authentication
- 🗄️ MongoDB Atlas database integration
- ⚡ Fast frontend development and production builds with Vite
- 📱 Responsive web interface
- ☁️ Live deployment with Netlify and Render

## 🛠️ Tech Stack

**Frontend**
- React
- TypeScript
- Vite
- HTML and CSS

**Backend**
- Node.js
- Express.js
- MongoDB and Mongoose
- bcrypt for password hashing
- JSON Web Tokens (JWT)

**Deployment**
- Netlify — Frontend
- Render — Backend
- MongoDB Atlas — Database

## 🚀 Getting Started

Follow these steps to run IMovies locally.

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

Create a `.env` file inside the `server` directory.

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
```

Replace the placeholder values with your own MongoDB connection string and a strong, private JWT secret.

**Important:** Never commit your `.env` file or publish your database credentials or JWT secret.

### 5. Start the backend

Open a terminal in the project root and run:

```bash
npm run server
```

The backend should start on port `5000`, provided that the server uses this port locally.

### 6. Start the frontend

Open another terminal in the project root and run:

```bash
npm run dev
```

Open the local URL printed by Vite in your terminal.

### 7. Build for production

```bash
npm run build
```

The production frontend files will be generated in the `dist` directory.

## 🌍 Live Deployment

| Component | Platform |
|---|---|
| Frontend | [Netlify](https://imovieticket.netlify.app/) |
| Backend | [Render](https://imovies-backend-euan.onrender.com/) |
| Database | MongoDB Atlas |

## 🔐 Authentication

The application includes user registration and login endpoints handled by the Express backend.

- Passwords are hashed using bcrypt before storage.
- JWT tokens are issued for successful authentication.
- User information is stored in MongoDB.
- The frontend communicates with the backend through HTTP API requests.

For production use, ensure protected routes verify JWTs on the server and configure appropriate CORS and database network access restrictions.

## 📁 Project Structure

```text
IMovies/
├── src/
│   ├── api/
│   │   └── authApi.ts
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   └── ...
├── server/
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── auth.js
│   ├── server.js
│   └── .env
├── public/
├── index.html
├── package.json
├── vite.config.ts
└── README.md
```

## 🔒 Security Notes

- Keep all secrets in environment variables.
- Do not expose MongoDB credentials in frontend code.
- Use HTTPS for production API requests.
- Restrict MongoDB Atlas network access whenever possible.
- Validate authentication and authorization on the backend.

## 👨‍💻 Author

**Vedant Vijay Vargiya**

GitHub: [@Vedantvijayvargiya-06](https://github.com/Vedantvijayvargiya-06)

## 📄 License

This project is available for learning and personal portfolio purposes. Add a license file if you intend to distribute it under a specific open-source license.
