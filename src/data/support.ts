// Mock data types and constants for the Support module

export interface SupportAgent {
  id: string;
  name: string;
  nameTr?: string;
  title: string;
  titleTr?: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
}

export interface WorkingHours {
  weekdays: { start: string; end: string };
  saturday: { start: string; end: string };
  sunday: 'closed';
}

export interface QuickAction {
  id: string;
  labelKey: string;
  label: string;
  labelEn: string;
  message: string;
  messageEn: string;
  icon: string;
  triggerText: string;
  triggerTextEn: string;
  responseText: string;
  responseTextEn: string;
}

export interface SupportMessage {
  id: string;
  text: string;
  textEn: string;
  isMe: boolean;
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
}

// --- Constants --- //

export const WORKING_HOURS: WorkingHours = {
  weekdays: { start: '09:00', end: '18:00' },
  saturday: { start: '09:00', end: '14:00' },
  sunday: 'closed',
};

export const TYPING_DELAY_MIN = 1000;
export const TYPING_DELAY_MAX = 2500;

export const OFFLINE_MESSAGE_TR =
  'Şu anda mesai saatleri dışındayız. Mesai saatlerimiz: Hafta içi 09:00-18:00, Cumartesi 09:00-14:00. En kısa sürede size dönüş yapacağız.';
export const OFFLINE_MESSAGE_EN =
  'We are currently outside of working hours. Our working hours: Weekdays 09:00-18:00, Saturday 09:00-14:00. We will get back to you as soon as possible.';

export const WELCOME_MESSAGE_TR =
  'Merhaba! 👋 Size nasıl yardımcı olabilirim? Bugünkü seyahat planınız hakkında bilgi alabilir miyim?';
export const WELCOME_MESSAGE_EN =
  'Hello! 👋 How can I help you today? Can I get some information about your travel plans?';

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'ticket',
    labelKey: 'support.quickActions.bilet',
    label: 'Bilet Sorgula',
    labelEn: 'Check Ticket',
    message: 'Biletimi sorgulamak istiyorum.',
    messageEn: 'I want to check my ticket.',
    icon: 'Ticket',
    triggerText: 'Biletimi sorgulamak istiyorum.',
    triggerTextEn: 'I want to check my ticket.',
    responseText:
      'Bilet sorgulama işleminiz için rezervasyon numaranızı veya e-posta adresinizi paylaşır mısınız?',
    responseTextEn:
      'For ticket inquiry, could you share your reservation number or email address?',
  },
  {
    id: 'cancel',
    labelKey: 'support.quickActions.iptal',
    label: 'İptal ve İade',
    labelEn: 'Cancellation & Refund',
    message: 'İptal ve iade koşullarını öğrenmek istiyorum.',
    messageEn: 'I want to learn about cancellation policies.',
    icon: 'FileX',
    triggerText: 'İptal koşullarını öğrenmek istiyorum.',
    triggerTextEn: 'I want to learn about cancellation policies.',
    responseText:
      'İptal ve iade koşullarımız: 7 gün öncesine kadar ücretsiz iptal, 3-7 gün arası %50 ücret.',
    responseTextEn:
      'Our cancellation policy: Free cancellation up to 7 days before, 50% fee between 3-7 days.',
  },
  {
    id: 'reservation',
    labelKey: 'support.quickActions.rezervasyon',
    label: 'Rezervasyon Sorgula',
    labelEn: 'Check Reservation',
    message: 'Rezervasyonumu kontrol etmek istiyorum.',
    messageEn: 'I want to check my reservation.',
    icon: 'Search',
    triggerText: 'Rezervasyonumu kontrol etmek istiyorum.',
    triggerTextEn: 'I want to check my reservation.',
    responseText:
      'Rezervasyonunuzu sorgulamak için rezervasyon kodunuzu paylaşabilir misiniz?',
    responseTextEn:
      'To check your reservation, could you provide your reservation code?',
  },
  {
    id: 'visa',
    labelKey: 'support.quickActions.vize',
    label: 'Vize İşlemleri',
    labelEn: 'Visa Procedures',
    message: 'Vize işlemleri hakkında bilgi almak istiyorum.',
    messageEn: 'I want information about visa procedures.',
    icon: 'FileText',
    triggerText: 'Vize işşemleri hakkında bilgi almak istiyorum.',
    triggerTextEn: 'I want information about visa procedures.',
    responseText:
      'Vize işlemlerimiz için lütfen seyahat edeceğiniz ülkeyi paylaşın. Ekibimiz size özel check-list hazırlayacaktır.',
    responseTextEn:
      'For visa procedures, please share your destination country. Our team will prepare a personalized checklist.',
  },
];

export const supportAgent: SupportAgent = {
  id: 'agent-001',
  name: 'Zeynep',
  nameTr: 'Zeynep',
  title: 'Müşteri Temsilcisi',
  titleTr: 'Müşteri Temsilcisi',
  avatar: '👩‍💼',
  status: 'online',
};

// --- Helpers --- //

export function isWithinWorkingHours(hours?: WorkingHours): boolean {
  const h = hours || WORKING_HOURS;
  const now = new Date();
  const day = now.getDay();
  const time = now.getHours() * 60 + now.getMinutes();

  if (day === 0) return false;
  if (day === 6) {
    const [sh, sm] = h.saturday.start.split(':').map(Number);
    const [eh, em] = h.saturday.end.split(':').map(Number);
    return time >= sh * 60 + sm && time < eh * 60 + em;
  }
  const [sh, sm] = h.weekdays.start.split(':').map(Number);
  const [eh, em] = h.weekdays.end.split(':').map(Number);
  return time >= sh * 60 + sm && time < eh * 60 + em;
}

// Legacy shortcut
export const isWithinWorkingHoursShort = isWithinWorkingHours;

// Aliases for named imports
export const SUPPORT_AGENT = supportAgent;

// Welcome messages
export const WELCOME_TR = WELCOME_MESSAGE_TR;
export const WELCOME_EN = WELCOME_MESSAGE_EN;
