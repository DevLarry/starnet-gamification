// email-templates/booking-status-update.template.ts
export const getBookingStatusEmailTemplate = (
  booking: any,
  status: string,
  agentName: string,
  notes?: string,
) => {
  const statusMessages = {
    PENDING: 'is pending review',
    CONFIRMED: 'has been confirmed',
    CANCELLED: 'has been cancelled',
    COMPLETED: 'has been completed',
    NO_SHOW: 'has been marked as no-show',
  };

  return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; }
        .status { font-weight: bold; color: #4F46E5; }
        .footer { text-align: center; margin-top: 20px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Booking Status Update</h1>
        </div>
        <div class="content">
            <p>Hello ${booking.account.firstname},</p>
            
            <p>Your booking for <strong>${booking.home.name}</strong> ${statusMessages[status]}.</p>
            
            <div style="background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #4F46E5;">
                <p><strong>Property:</strong> ${booking.home.name}</p>
                <p><strong>Address:</strong> ${booking.home.address}</p>
                <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> ${booking.time_slot}</p>
                <p><strong>New Status:</strong> <span class="status">${status}</span></p>
                <p><strong>Updated by:</strong> ${agentName}</p>
                ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
            </div>

            ${
              status === 'CONFIRMED'
                ? `
            <p style="background: #d4edda; padding: 10px; border-radius: 5px;">
                <strong>✅ Your booking is confirmed!</strong><br>
                Please arrive on time for your property inspection.
            </p>
            `
                : ''
            }

            ${
              status === 'CANCELLED'
                ? `
            <p style="background: #f8d7da; padding: 10px; border-radius: 5px;">
                <strong>❌ Booking Cancelled</strong><br>
                Your booking has been cancelled. Please contact support if you have any questions.
            </p>
            `
                : ''
            }

            <p>If you have any questions, please contact our support team.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
  `;
};
