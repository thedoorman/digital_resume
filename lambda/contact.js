const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const sesClient = new SESClient({ region: 'us-east-1' });

// Common headers for CORS
const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, Origin',
    'Access-Control-Max-Age': '86400'
};

// Response helper with logging
const response = (statusCode, body, event = null) => {
    const responseBody = {
        ...body,
        requestId: event?.requestContext?.requestId
    };
    
    console.log(`Response [${statusCode}]:`, JSON.stringify(responseBody, null, 2));
    
    return {
        statusCode,
        headers: corsHeaders,
        body: JSON.stringify(responseBody)
    };
};

// Email validation
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

exports.handler = async (event) => {
    console.log('Incoming request:', JSON.stringify(event, null, 2));

    if (event.httpMethod === 'OPTIONS') {
        return response(200, { message: 'Preflight call successful' }, event);
    }

    try {
        let body;
        try {
            body = event.body ? JSON.parse(event.body) : event;
        } catch (e) {
            return response(400, { 
                error: 'Invalid JSON in request body'
            }, event);
        }

        const requiredFields = ['name', 'email', 'message'];
        const missingFields = requiredFields.filter(field => !body[field]);
        
        if (missingFields.length > 0) {
            return response(400, {
                error: 'Missing required fields',
                fields: missingFields
            }, event);
        }

        if (!isValidEmail(body.email)) {
            return response(400, {
                error: 'Invalid email format'
            }, event);
        }

        if (!process.env.toAddress) {
            console.error('Missing environment variable: toAddress');
            return response(500, {
                error: 'Configuration error',
                message: 'Contact form is not properly configured'
            }, event);
        }

        const emailParams = {
            Destination: {
                ToAddresses: [process.env.toAddress]
            },
            Message: {
                Body: {
                    Text: {
                        Data: `
Contact Form Submission

From: ${body.name} <${body.email}>
Timestamp: ${new Date().toISOString()}

Message:
${body.message}
`
                    }
                },
                Subject: {
                    Data: `Portfolio Contact: ${body.name}`
                }
            },
            Source: process.env.toAddress // This email must be verified in SES
        };

        try {
            await sesClient.send(new SendEmailCommand(emailParams));
            return response(200, {
                message: 'Message sent successfully'
            }, event);
        } catch (sesError) {
            console.error('SES Error:', sesError);
            
            // Handle specific SES errors
            if (sesError.message?.includes('not verified')) {
                return response(500, {
                    error: 'Configuration error',
                    message: 'Email service is not properly configured. Please contact the administrator.'
                }, event);
            }

            return response(500, {
                error: 'Email service error',
                message: 'Unable to send email at this time'
            }, event);
        }

    } catch (error) {
        console.error('Unexpected error:', error);
        return response(500, {
            error: 'Internal server error',
            message: 'An unexpected error occurred'
        }, event);
    }
}; 