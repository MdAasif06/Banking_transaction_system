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

🛡 Security Features

Password hashing using Bcrypt

JWT-based authentication

MongoDB session-based transactions

Idempotency key implementation

Input validation
