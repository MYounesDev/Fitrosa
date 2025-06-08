import nodemailer from 'nodemailer';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const generatePasswordSetupToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const replaceTemplateVariables = (template, variables) => {
  return Object.entries(variables).reduce((result, [key, value]) => {
    return result.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }, template);
};

export const sendPasswordSetupEmail = async (email, token, userName) => {
  const resetUrl = `${process.env.FRONTEND_URL}/set-password/${token}`;
  
  try {
    const templatePath = path.join(process.cwd(),  'templates', 'passwordSetup.html');
    const template = await fs.readFile(templatePath, 'utf-8');
    
    const htmlContent = replaceTemplateVariables(template, {
      resetUrl,
      userName: userName || 'User',
      appName: 'Fitrosa'
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Welcome to Fitrosa - Set Your Password',
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}; 