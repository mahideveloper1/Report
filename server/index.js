
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const multer = require('multer');
const upload = multer();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, 
  auth: {
    user: process.env.SMTP_USER || 'your-email@example.com',
    pass: process.env.SMTP_PASS || 'your-password'
  }
});

// API endpoint for sending report emails
app.post('/api/send-report', async (req, res) => {
  try {
    const { email, reportName, csvContent, summary } = req.body;
    
    if (!email || !reportName || !csvContent) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: email, reportName, or csvContent'
      });
    }
    
    // Create CSV attachment
    const filename = `${reportName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.csv`;
    
    // Create HTML content for the email
    const htmlContent = `
      <h1>Custom Report: ${reportName}</h1>
      <p>Please find attached your custom report.</p>
      <h2>Report Summary</h2>
      <ul>
        <li><strong>Report Name:</strong> ${summary.reportName}</li>
        <li><strong>Records:</strong> ${summary.recordCount}</li>
        <li><strong>Metrics:</strong> ${summary.metricCount}</li>
        <li><strong>Generated:</strong> ${new Date(summary.generatedAt).toLocaleString()}</li>
      </ul>
      <p>The metrics included in this report are:</p>
      <ul>
        ${summary.metrics.map(metric => `<li>${metric}</li>`).join('')}
      </ul>
      <p>Thank you for using our Custom Reports Builder!</p>
    `;
    
    // Send email with CSV attachment
    const info = await transporter.sendMail({
      from: '"Custom Reports" <reports@example.com>',
      to: email,
      subject: `Custom Report: ${reportName}`,
      html: htmlContent,
      attachments: [
        {
          filename,
          content: csvContent,
          contentType: 'text/csv'
        }
      ]
    });
    
    console.log('Email sent:', info.messageId);
    
    res.json({
      success: true,
      message: 'Report sent successfully',
      messageId: info.messageId
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error.message
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;