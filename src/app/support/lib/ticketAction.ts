'use server';

export async function sendTicketNotification(ticketData: {
  ticketId: string;
  category: string;
  subcategory: string;
  userEmail: string;
  subject: string;
  description: string;
  ccEmails: string[];
  toEmails: string[];
}) {
  
  const { sendTicketAcknowledgment } = await import('./email');
  return sendTicketAcknowledgment(ticketData);
}