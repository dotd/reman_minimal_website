const sgMail = require('@sendgrid/mail');

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    const { name, role, email, phone, inquiry } = data;

    // Validate the required fields
    if (!name || !email || !inquiry) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing required fields' })
      };
    }

    // Set SendGrid API key from environment variable
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // Prepare email content
    const msg = {
      to: 'renabler.ai@gmail.com', // Your receiving email
      from: process.env.SENDGRID_VERIFIED_SENDER, // Your verified sender email  
      subject: `New Inquiry from ${name}`,
      text: `
Name: ${name}
Role: ${role}
Email: ${email}
Phone: ${phone}

Inquiry:
${inquiry}
      `,
      html: `
<h2>New Inquiry</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Role:</strong> ${role}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Phone:</strong> ${phone}</p>
<h3>Inquiry:</h3>
<p>${inquiry}</p>
      `
    };

    // Send email
    await sgMail.send(msg);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Form submitted successfully' })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error submitting form' })
    };
  }
}; 