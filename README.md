# Money Manager – Frontend

A responsive Money Manager web application frontend that allows users to manage income and expenses, categorize transactions, and view financial data over time.  
This frontend consumes a REST API built with Node.js and MongoDB Atlas.

---
#backend repo : https://github.com/arshhad45/money-manager-backend
##  Live Application

**Frontend (Vercel):**  
https://money-manager-frontend-eight.vercel.app/

**Backend API:**  
https://money-manager-backend-1-51q8.onrender.com/


> Note: The backend is hosted on a free tier. The first request may take a few seconds due to cold start.

---

##  Money Manager – Project Description
## What Was Built
Money Manager is a full-stack web application for managing personal and business finances. It helps users record transactions, track spending, manage accounts, and view financial summaries.

## Problem It Solves
-Managing income and expenses manually is time-consuming and error-prone. Users need a single place to:
Record income and expenses with clear categorization
Separate personal and office spending
See financial summaries across different time periods
Correct recent mistakes in a controlled way
Move money between accounts and track balances
Filter and analyze spending by category and date
## How It Solves the Problem
Transaction Management
Users can add income and expenses through a modal with two tabs (Income and Expense). Each transaction includes date and time, a short description, category (e.g., fuel, food, medical, loan), and division (Personal or Office). This keeps records structured and easy to analyze.
## Financial Tracking
A dashboard shows income and expenses for monthly, weekly, and yearly periods, with net amounts. Users can quickly see their financial position over different time ranges.
## Filtering and Search
Filters let users narrow down transactions by division (Personal/Office), category, and date range (from–to), so they can analyze specific subsets of their finances without manual sorting.
## Controlled Editing
Transactions can be edited only within 12 hours of creation. This allows quick corrections while preventing long-term changes that could affect financial reporting.
## Category Summary
A summary panel shows totals per category (income and expense), helping users see where money is spent or earned.
## Account Management and Transfers
Users can create accounts (e.g., Cash, Bank, Card) and:
Link income/expense to specific accounts
Transfer money between accounts
See balances update automatically
## Result
The app centralizes personal and business financial data, supports quick corrections, and provides a clear view of spending and income through filters, summaries, and account tracking, making financial management simpler and more accurate.
