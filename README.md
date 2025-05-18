📊 Report App
A web app to generate custom reports with metrics, CSV download, email support, and Power BI integration.

🚀 Features
Select metrics and generate custom reports
View reports on dashboard with graphs
Export data as CSV
Send reports via email (SMTP)
Power BI integration

🛠 Tech Stack

React + Vite
TailwindCSS
Recharts
Node.js + Express
Nodemailer

🔧 Installation
Prerequisites

Node.js (v14+)
npm or yarn

# Frontend Setup
Clone repository
git clone https://github.com/mahideveloper1/Report.git
cd frontend

# Create .env file
 VITE_API_URL=http://localhost:3001

# Install dependencies
npm install

# Start development server
cd server
npm install

# Create .env file for email functionality
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
PORT=3001

# Start server
npm run dev


📋 Usage

Select Metrics: Choose from 13 different metrics
Apply Filters: Configure filters for each selected metric
Generate Report: View visualizations based on selected metrics
Export/Share: Download as CSV or send via email
