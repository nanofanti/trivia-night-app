# 🧠 Trivia Night

A full-stack trivia quiz application built with **React, TypeScript, Node.js, Express, and MongoDB**.

The application is based on real weekly Trivia Night questions and allows users to play quizzes by event date, category, or through a randomized Lightning Round.

It also includes a protected admin area for managing the question database.

## 🌐 Live Demo

**Frontend:**  
https://trivianight-app.netlify.app/

**API:**  
https://trivia-night-app.onrender.com/

> The backend is hosted on Render's free tier, so the first request after a period of inactivity may take a few seconds.

---

## ✨ Features

### 🎮 Quiz

- Play questions from previous Trivia Nights
- Filter quizzes by event date
- Play by category
- ⚡ 10-question Lightning Round
- Multiple-point questions
- Correct / incorrect answer feedback
- Score tracking
- Quiz progress
- Final score and accuracy statistics
- Question and answer images
- Multiple images per question
- Random warm-up question on the homepage
- Dark mode

### 🔐 Admin Area

Protected administration interface with JWT authentication.

The admin can:

- Create new questions
- Edit existing questions
- Delete questions
- Add multiple question images
- Add multiple answer images
- Assign categories, dates and points
- View and manage the complete question database

Passwords are stored securely using **bcrypt hashing**, while protected API operations require a valid **JSON Web Token (JWT)**.

---

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Sonner

### Backend

- Node.js
- Express
- TypeScript
- Mongoose
- bcrypt
- JSON Web Tokens
- CORS

### Database

- MongoDB Atlas

### Deployment

- **Netlify** — frontend
- **Render** — backend API
- **MongoDB Atlas** — cloud database
- **GitHub** — source control and deployment integration

---

## 🏗️ Architecture

```text
React + TypeScript
        │
        │ HTTP / JSON
        ▼
Node.js + Express
        │
        │ Mongoose
        ▼
MongoDB Atlas
```

The frontend and backend are deployed independently.

The React application communicates with the Express REST API, which handles authentication, application logic and communication with MongoDB.

---

## 🔌 API

### Questions

```text
GET     /api/questions
POST    /api/questions
PUT     /api/questions/:id
DELETE  /api/questions/:id
```

`GET` is publicly accessible.

Creating, editing and deleting questions requires authentication.

### Authentication

```text
POST /api/auth/login
```

Successful authentication returns a JWT used by the frontend for protected API requests.

---

## 📂 Project Structure

```text
trivia-app/
│
├── backend/
│   ├── src/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   └── vite-project/
│       ├── src/
│       │   ├── components/
│       │   ├── constants/
│       │   ├── types/
│       │   └── utils/
│       ├── package.json
│       └── vite.config.ts
│
└── README.md
```

---

## 💻 Running the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/nanofanti/trivia-night-app.git
cd trivia-night-app
```

### 2. Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the development server:

```bash
npm run dev
```

The API runs locally on:

```text
http://localhost:8000
```

### 3. Frontend

Open another terminal:

```bash
cd frontend/vite-project
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8000
```

Start Vite:

```bash
npm run dev
```

The frontend runs locally on:

```text
http://localhost:5173
```

---

## 🔒 Security

Sensitive credentials are stored using environment variables and are excluded from Git through `.gitignore`.

The application uses:

- bcrypt password hashing
- JWT authentication
- Protected API routes
- Environment-based secrets
- CORS restrictions for the production frontend

No database credentials, passwords or JWT secrets are stored in the repository.

---

## 🚀 Deployment

The project uses a separated frontend/backend deployment architecture:

```text
Netlify
React / Vite
     │
     ▼
Render
Node.js / Express
     │
     ▼
MongoDB Atlas
```

Pushes to the `main` branch can trigger automatic production deployments through the connected GitHub repository.

---

## 👨‍💻 Author

**Marco Fanti**

Web Developer focused on modern frontend development, CMS solutions and full-stack web applications.

[Portfolio](https://marcofantiportfolio.freedev.app/) · [GitHub](https://github.com/nanofanti)
