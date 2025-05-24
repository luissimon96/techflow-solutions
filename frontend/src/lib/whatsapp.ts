const WHATSAPP_NUMBER = '5511999999999'; // Substitua pelo número real

export function getWhatsAppUrl(message = 'Olá! Gostaria de saber mais sobre os serviços da TechFlow.') {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
} 