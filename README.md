# 📊 Report App

A web app to generate custom reports with metrics, CSV download, email support, and Power BI integration.

---

## 🚀 Features

- Select metrics and generate custom reports  
- View reports on dashboard with graphs  
- Export data as CSV  
- Send reports via email (SMTP)  
- Power BI integration  

---

## 🛠 Tech Stack

- React + Vite  
- TailwindCSS  
- Recharts  
- Node.js + Express  
- Nodemailer  

---

## 🔧 Installation

### Prerequisites

- Node.js (v14+)  
- npm or yarn  

---

### Frontend Setup

- git clone https://github.com/mahideveloper1/Report.git
- cd frontend

## Create a .env file inside the frontend folder:

- VITE_API_URL=http://localhost:3001

## Install dependencies and run:

- npm install
- npm run dev

### Backend Setup

- cd server
- npm install

## Create a .env file inside the server folder:

- SMTP_HOST=smtp.gmail.com
- SMTP_PORT=587
- SMTP_USER=your-email@gmail.com
- SMTP_PASS=your-app-password
- PORT=3001

## Start the server:

- node index.js

