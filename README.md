# Money Manager - Frontend

A modern, responsive web application for managing personal finances. Track your income, expenses, and financial transactions with an intuitive dashboard and powerful filtering capabilities.

##  Features

- **Dashboard Overview**: View monthly, weekly, and yearly income and expense summaries
- **Transaction Management**: Add income and expenses with detailed categorization
- **Advanced Filtering**: Filter transactions by division (Personal/Office), category, and date range
- **Category Summary**: See spending breakdown by category
- **Transaction History**: View all transactions in a sortable, filterable table
- **Responsive Design**: Beautiful UI built with TailwindCSS that works on all devices
- **Real-time Updates**: Instant reflection of changes across the application

##  Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **React SWC** - Fast React refresh

##  Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running (see backend repository)

##  Installation

1. Clone the repository:
-git clone <repository-url>
-cd frontend

3. Install dependencies:
-npm install

## Environment Configuration
For Local Development
Create a .env file in the frontend folder:
# Optional: Set to use local backendVITE_API_URL=http://localhost:4000
Note: If you don't create a .env file, the Vite proxy will automatically forward /api requests to http://localhost:4000 during development.
For Production
Create a .env.production file:
VITE_API_URL=https://your-backend-url.onrender.com
Or set the VITE_API_URL environment variable in your hosting platform's dashboard.

## Development
Start the development server:
npm run dev
The application will be available at http://localhost:5173
The dev server includes:
Hot Module Replacement (HMR)
Automatic API proxying to backend
Fast refresh for React components

## Building for Production
Build the production-ready application:
npm run build
The optimized build will be in the dist folder.
Preview the production build locally:
npm run buildnpm run preview

## Available Scripts
npm run dev - Start development server
npm run build - Build for production
npm run preview - Preview production build locally
