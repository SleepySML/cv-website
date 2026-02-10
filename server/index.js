require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting for contact form
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { error: 'Too many requests. Please try again later.' },
});

// Simple visitor counter
const counterFile = path.join(__dirname, 'data', 'visitors.json');

function getVisitorCount() {
  try {
    if (fs.existsSync(counterFile)) {
      const data = JSON.parse(fs.readFileSync(counterFile, 'utf8'));
      return data.count || 0;
    }
  } catch {
    // ignore
  }
  return 0;
}

function incrementVisitorCount() {
  const count = getVisitorCount() + 1;
  fs.writeFileSync(counterFile, JSON.stringify({ count, lastVisit: new Date().toISOString() }));
  return count;
}

// Contact messages storage
const messagesFile = path.join(__dirname, 'data', 'messages.json');

function saveMessage(message) {
  let messages = [];
  try {
    if (fs.existsSync(messagesFile)) {
      messages = JSON.parse(fs.readFileSync(messagesFile, 'utf8'));
    }
  } catch {
    // ignore
  }
  messages.push({
    ...message,
    id: Date.now(),
    timestamp: new Date().toISOString(),
  });
  fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));
}

// ===== Email Setup =====
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

let transporter = null;
if (EMAIL_USER && EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  // Verify connection on startup
  transporter.verify().then(() => {
    console.log('📧 Email transporter ready');
  }).catch((err) => {
    console.error('📧 Email transporter error:', err.message);
    transporter = null;
  });
} else {
  console.log('📧 Email not configured (set EMAIL_USER and EMAIL_PASS env vars)');
}

async function sendNotificationEmail({ name, email, subject, message }) {
  if (!transporter) return;

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${EMAIL_USER}>`,
      to: EMAIL_USER,
      replyTo: email,
      subject: `[Portfolio] ${subject || 'New message'} — from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00d4ff; border-bottom: 2px solid #7c3aed; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #555; width: 100px;">From:</td>
              <td style="padding: 8px 12px;">${name}</td>
            </tr>
            <tr style="background: #f9f9f9;">
              <td style="padding: 8px 12px; font-weight: bold; color: #555;">Email:</td>
              <td style="padding: 8px 12px;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #555;">Subject:</td>
              <td style="padding: 8px 12px;">${subject || 'No subject'}</td>
            </tr>
          </table>
          <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px; color: #333;">Message:</h3>
            <p style="white-space: pre-wrap; color: #444; line-height: 1.6; margin: 0;">${message}</p>
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 20px;">
            Sent from your portfolio website contact form
          </p>
        </div>
      `,
    });
    console.log(`📧 Notification email sent for message from ${name}`);
  } catch (err) {
    console.error('📧 Failed to send email:', err.message);
  }
}

// ===== API Routes =====

// Get resume data
app.get('/api/resume', (req, res) => {
  try {
    const resume = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'data', 'resume.json'), 'utf8')
    );
    res.json(resume);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load resume data' });
  }
});

// Get visitor count
app.get('/api/visitors', (req, res) => {
  const count = incrementVisitorCount();
  res.json({ count });
});

// Submit contact form
app.post('/api/contact', contactLimiter, async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  if (message.length < 10) {
    return res.status(400).json({ error: 'Message must be at least 10 characters.' });
  }

  // Save message to file
  saveMessage({ name, email, subject, message });

  // Send email notification
  await sendNotificationEmail({ name, email, subject, message });

  console.log(`📩 New contact message from ${name} (${email})`);
  console.log(`   Subject: ${subject || 'No subject'}`);
  console.log(`   Message: ${message.substring(0, 100)}...`);

  res.json({
    success: true,
    message: 'Thank you! Your message has been received. I will get back to you soon.',
  });
});

// Terminal command endpoint (for fun interactive features)
app.get('/api/terminal/:command', (req, res) => {
  const resume = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'data', 'resume.json'), 'utf8')
  );

  const commands = {
    help: resume.terminal.commands.help,
    about: resume.terminal.commands.about,
    whoami: resume.terminal.commands.whoami,
    'sudo hire evgenii': resume.terminal.commands['sudo hire evgenii'],
    skills: Object.entries(resume.skills)
      .map(([cat, items]) => `${cat}:\n  ${items.join(', ')}`)
      .join('\n\n'),
    experience: resume.experience
      .slice(0, 4)
      .map((e) => `${e.role} @ ${e.company} (${e.period})`)
      .join('\n'),
    education: resume.education
      .map((e) => `${e.degree} in ${e.field}\n${e.institution} (${e.period})`)
      .join('\n'),
    contact: `LinkedIn: ${resume.contact.linkedin}\nLocation: ${resume.contact.location}\n\nOr use the contact form below!`,
  };

  const cmd = req.params.command.toLowerCase();
  const response = commands[cmd];

  if (response) {
    res.json({ command: cmd, output: response });
  } else {
    res.json({
      command: cmd,
      output: `Command not found: ${cmd}\nType 'help' to see available commands.`,
    });
  }
});

// Serve static files (production / deployed)
const distPath = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Resume API server running on http://0.0.0.0:${PORT}`);
  console.log(`📄 Resume data: /api/resume`);
  console.log(`💬 Contact endpoint: POST /api/contact`);
  console.log(`🖥️  Terminal: /api/terminal/help\n`);
});
