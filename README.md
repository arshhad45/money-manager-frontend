# Money Manager – Frontend

A responsive Money Manager web application frontend that allows users to manage income and expenses, categorize transactions, and view financial data over time.  
This frontend consumes a REST API built with Node.js and MongoDB Atlas.

---

##  Live Application

**Frontend (Vercel):**  
https://money-manager-frontend.vercel.app](https://money-manager-frontend-eight.vercel.app/



**Backend API:**  
https://money-manager-backend.onrender.com](https://money-manager-backend-1-51q8.onrender.com/


> Note: The backend is hosted on a free tier. The first request may take a few seconds due to cold start.

---

##  Project Overview

The Money Manager application helps users:

- Add income and expense transactions  
- Categorize transactions (food, fuel, medical, etc.)  
- Separate transactions into Personal and Office divisions  
- Track transactions with date and time  
- View transaction history  
- Enforce a 12-hour edit restriction (handled by backend)  
- Prepare data for weekly, monthly, and yearly summaries  

This repository contains only the frontend of the application.

---

##  Tech Stack

- React.js  
- Vite  
- Tailwind CSS  
- Axios  
- Vercel  

---

##  Project Structure

src/
├── components/
├── services/
│ ├── api.js
│ └── transactions.js
├── App.jsx
└── main.jsx


---

##  Environment Variables

The frontend uses environment variables for backend configuration.

### Local Development

Create a `.env` file in the project root:

```env
VITE_API_URL=https://money-manager-backend.onrender.com
.env is ignored and not committed to GitHub.

 Running Locally
Clone the repository:

git clone https://github.com/<your-username>/money-manager-frontend.git
cd money-manager-frontend
Install dependencies:

npm install
Start the development server:

npm run dev
The app will be available at:

http://localhost:5173
