const nodemailer = require('nodemailer');

// FormSubmit compatible email sender
const sendEmail = async (to, subject, html, fromName = 'Texas Grill') => {
  try {
    // For FormSubmit, we'll use their API structure
    // This sends email to the configured email address
    
    const formSubmitEmail = process.env.FORMSUBMIT_EMAIL;
    
    if (!formSubmitEmail) {
      console.log('⚠️ FORMSUBMIT_EMAIL not configured');
      return { success: false, message: 'Email not configured' };
    }
    
    // Using fetch to FormSubmit API
    const response = await fetch('https://formsubmit.co/ajax/' + formSubmitEmail, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: to,
        subject: subject,
        message: html,
        _template: 'table',
        _captcha: 'false'
      })
    });
    
    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, message: error.message };
  }
};

const sendOrderEmail = async (orderData) => {
  const subject = `New Order #${orderData.orderNumber}`;
  const html = `
    <h2>New Order Received!</h2>
    <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
    <p><strong>Customer:</strong> ${orderData.customer.name}</p>
    <p><strong>Phone:</strong> ${orderData.customer.phone}</p>
    <p><strong>Address:</strong> ${orderData.customer.address || 'N/A'}</p>
    <p><strong>Order Type:</strong> ${orderData.orderType}</p>
    <p><strong>Total Amount:</strong> PKR ${orderData.total}</p>
    <p><strong>Payment Method:</strong> ${orderData.paymentMethod}</p>
    <h3>Items:</h3>
    <ul>
      ${orderData.items.map(item => `<li>${item.quantity}x ${item.name} - PKR ${item.price * item.quantity}</li>`).join('')}
    </ul>
    <p><strong>Special Instructions:</strong> ${orderData.specialInstructions || 'None'}</p>
  `;
  
  return await sendEmail(process.env.FORMSUBMIT_EMAIL, subject, html);
};

const sendContactEmail = async (contactData) => {
  const subject = `New Contact Message: ${contactData.subject || 'No Subject'}`;
  const html = `
    <h2>New Contact Message</h2>
    <p><strong>Name:</strong> ${contactData.name}</p>
    <p><strong>Email:</strong> ${contactData.email}</p>
    <p><strong>Phone:</strong> ${contactData.phone || 'N/A'}</p>
    <p><strong>Subject:</strong> ${contactData.subject || 'N/A'}</p>
    <p><strong>Message:</strong></p>
    <p>${contactData.message}</p>
  `;
  
  return await sendEmail(process.env.FORMSUBMIT_EMAIL, subject, html);
};

const sendReservationEmail = async (reservationData) => {
  const subject = `New Reservation Request`;
  const html = `
    <h2>New Table Reservation</h2>
    <p><strong>Customer:</strong> ${reservationData.customer.name}</p>
    <p><strong>Phone:</strong> ${reservationData.customer.phone}</p>
    <p><strong>Email:</strong> ${reservationData.customer.email || 'N/A'}</p>
    <p><strong>Date:</strong> ${new Date(reservationData.date).toLocaleDateString()}</p>
    <p><strong>Time:</strong> ${reservationData.time}</p>
    <p><strong>Guests:</strong> ${reservationData.customer.guests}</p>
    <p><strong>Table Type:</strong> ${reservationData.tableType}</p>
    <p><strong>Occasion:</strong> ${reservationData.occasion}</p>
    <p><strong>Special Requests:</strong> ${reservationData.specialRequests || 'None'}</p>
  `;
  
  return await sendEmail(process.env.FORMSUBMIT_EMAIL, subject, html);
};

module.exports = { sendEmail, sendOrderEmail, sendContactEmail, sendReservationEmail };