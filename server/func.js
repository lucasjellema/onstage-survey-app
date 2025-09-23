const fdk = require('@fnproject/fdk');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

let allowedEmails = [];

// Load allowed emails once when the function starts
try {
    const allowedEmailsPath = path.join(__dirname, 'allowed_emails.json');
    const data = fs.readFileSync(allowedEmailsPath, 'utf8');
    allowedEmails = JSON.parse(data);
    console.log('Allowed emails loaded successfully.');
} catch (err) {
    console.error('Error loading allowed_emails.json:', err);
    // In a real scenario, you might want to exit or handle this more gracefully
    // For now, the function will proceed with an empty allowedEmails array
}

fdk.handle(async function (input) {
    const headers = input.headers;
    const authorizationHeader = headers ? headers['Authorization'] || headers['authorization'] : null;

    if (!authorizationHeader) {
        console.log('No Authorization header found.');
        return {
            active: false,
            context: {
                message: 'Unauthorized: No Authorization header'
            }
        };
    }

    const token = authorizationHeader.startsWith('Bearer ') ? authorizationHeader.substring(7) : authorizationHeader;

    try {
        // In a real scenario, you would verify the token with a public key
        // For this example, we'll just decode it to get the email
        const decoded = jwt.decode(token);

        if (!decoded || !decoded.email) {
            console.log('Token invalid or missing email:', decoded);
            return {
                active: false,
                context: {
                    message: 'Unauthorized: Invalid token or missing email'
                }
            };
        }

        const userEmail = decoded.email;
        console.log('Attempting to authorize email:', userEmail);

        if (allowedEmails.includes(userEmail)) {
            console.log('Authorization successful for:', userEmail);
            return {
                active: true,
                principal: userEmail,
                context: {
                    email: userEmail,
                    message: 'Authorized'
                }
            };
        } else {
            console.log('Authorization failed: Email not in allowed list:', userEmail);
            return {
                active: false,
                context: {
                    message: 'Unauthorized: Email not allowed'
                }
            };
        }
    } catch (err) {
        console.error('Error processing token:', err);
        return {
            active: false,
            context: {
                message: `Unauthorized: Token processing error - ${err.message}`
            }
        };
    }
});