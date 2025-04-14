/**
 * Sends a WhatsApp message to a specific phone number.
 */
export interface WhatsappMessage {
  phoneNumber: string;
  message: string;
}

export async function sendWhatsappMessage(whatsappMessage: WhatsappMessage): Promise<boolean> {
  // TODO: Implement this by calling an API.
  console.log(`Sending message: ${whatsappMessage.message} to ${whatsappMessage.phoneNumber}`)
  return true;
}
