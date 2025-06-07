
interface ContactInfo {
  fullName: string;
  email: string;
  phone: string;
}

export const validateContactInfo = (contact: ContactInfo): string[] => {
  const errors: string[] = [];
  
  if (!contact.fullName?.trim()) {
    errors.push('Full name is required');
  } else if (contact.fullName.trim().length < 2) {
    errors.push('Full name must be at least 2 characters long');
  }
  
  if (!contact.email?.trim()) {
    errors.push('Email address is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())) {
    errors.push('Please enter a valid email address');
  }
  
  if (!contact.phone?.trim()) {
    errors.push('Phone number is required');
  } else if (!/^[\+]?[\d\s\-\(\)]{8,}$/.test(contact.phone.trim())) {
    errors.push('Please enter a valid phone number');
  }
  
  return errors;
};
