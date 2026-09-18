# Zerodha Clone

A full-stack stock trading platform inspired by Zerodha, built using the MERN stack.

Link of this repo project:
https://zerodha-clone-1-zjom.onrender.com

## 🚀 Features

- User Authentication (Login/Signup)
- Dashboard for users
- Portfolio Management
- Holdings & Positions
- Buy/Sell Stocks Interface
- Responsive UI
- REST API Integration
- MongoDB Database

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router
- Axios
- Material UI / CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

## 📂 Project Structure

```
project_2/
│
├── frontend/
│   ├── src/
│   └── public/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── index.js
│
└── dashboard/
```

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/999Akash999/zerodha-clone.git
```

### Install Dependencies

```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```



### Run Backend

```bash
cd backend
npm start
```

### Run Frontend

```bash
cd frontend
npm start
```

## Deploy to Render

This repository includes [render.yaml](./render.yaml), which creates three Render services: the API, landing site, and dashboard. Create a **Blueprint** in Render and select this repository.

Before the first deploy, set these environment variables in Render:

- `MONGO_URL` on `zerodha-clone-api` — your MongoDB connection string.
- `REACT_APP_API_URL` on both static sites — the API URL, for example `https://zerodha-clone-api.onrender.com`.
- `REACT_APP_DASHBOARD_URL` on the frontend static site — the deployed dashboard URL.
- `REACT_APP_FRONTEND_URL` on the dashboard static site — the deployed frontend URL.

`JWT_SECRET` is generated automatically by the Blueprint. React environment variables are embedded at build time, so redeploy each static site after setting or changing them.

For a backend-only Render deployment, use `backend` as the Root Directory, `npm ci` as the Build Command, and `npm start` as the Start Command. The backend does not require an `npm run build` command.



## 📈 Future Improvements

- Real-time stock prices
- Trading charts
- Watchlist feature
- Payment integration
- Dark mode

## 👨‍💻 Author

**Akash**

GitHub: https://github.com/999Akash999

## 📄 License

This project is for educational purposes only and is not affiliated with Zerodha.
