const WHATSAPP_NUMBER = '5554997109051'; // Número atualizado

export function getWhatsAppUrl(message = 'Olá! Gostaria de saber mais sobre os serviços da TechFlow.') {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
} 