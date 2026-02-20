# 💳 Online Banking Transaction System (Backend)

A secure and scalable online transaction backend built using Node.js, Express.js, and MongoDB.  
This system handles account management, money transfers, transaction logging, and idempotency protection.

---

## 🚀 Features

- 🔐 Secure Account Management
- 💸 Online Money Transfer (Debit/Credit Logic)
- 🔄 Idempotency Key Support (Prevents duplicate transactions)
- 🏦 Ledger-based Balance Calculation
- 🧾 Transaction History
- ❌ Validation & Error Handling
- 🛡 MongoDB Transactions (Session-based atomic operations)

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (Authentication)
- Bcrypt (Password Hashing)

---

## 📂 Project Structure
src/
│
├── controllers/
├── models/
├── routes/
├── middlewares/
├── utils/
└── server.js

foxicon/
├── public/                 # Static assets
│   └── logo.svg           # Logo files
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Navbar.jsx     # Navigation with mobile drawer
│   │   └── Layout.jsx     # Page layout wrapper
│   ├── pages/             # Main pages
│   │   ├── Home.jsx       # Landing page with animations
│   │   ├── About.jsx      # About us page
│   │   ├── Courses.jsx    # Courses listing
│   │   ├── Projects.jsx   # Projects showcase
│   │   ├── Bootcamps.jsx  # Bootcamps page
│   │   └── Login.jsx      # Login page
│   ├── App.jsx            # Main app with routing
│   ├── main.jsx           # App entry point
│   └── index.css          # Global styles
├── package.json           # Dependencies & scripts
└── README.md             # You are here! 📍

🛡 Security Features

Password hashing using Bcrypt

JWT-based authentication

MongoDB session-based transactions

Idempotency key implementation

Input validation
