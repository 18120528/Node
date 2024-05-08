'use strict';

const fs = require('fs');
const ejs = require('ejs');
const nodemailer = require('nodemailer');
const path=require('path');

const sendEmail = (email, subject, content) => 
{
    // Create a transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'taotenron284@gmail.com',
            pass: "zptm zynf ukpo qjuz" // Prefer environment variables for sensitive data
        }
    });
    // Load the template file
    fs.readFile(path.join(__dirname, '..','/views/emailFormat/resetPwd.ejs'), 'utf8', (err, template) => 
    {
        if (err) 
        {
            console.error('Error reading file:', err);
            return;
        }
        // Render the template with dynamic data
        const html = ejs.render(template, {content});

        // Define email options
        const mailOptions = {
            from: 'taotenron284@gmail.com',
            to: email,
            subject: subject,
            html: html,
            contentType: 'text/html' // Set content type to HTML
        };

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email: ', error);
            } else {
                console.log('Email sent: ', info.response);
            }
        });
    });
};

module.exports = sendEmail;
