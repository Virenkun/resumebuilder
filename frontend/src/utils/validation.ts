// Form validation utilities

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Allow various phone formats
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateDateFormat = (date: string): boolean => {
  // YYYY-MM format
  const dateRegex = /^\d{4}-\d{2}$/;
  return dateRegex.test(date);
};

export const validatePersonalInfo = (data: any): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.name?.trim()) {
    errors.name = "Name is required";
  }

  if (!data.email?.trim()) {
    errors.email = "Email is required";
  } else if (!validateEmail(data.email)) {
    errors.email = "Invalid email format";
  }

  if (!data.phone?.trim()) {
    errors.phone = "Phone is required";
  } else if (!validatePhone(data.phone)) {
    errors.phone = "Invalid phone number";
  }

  if (!data.location?.trim()) {
    errors.location = "Location is required";
  }

  if (data.linkedin && data.linkedin.trim() && !validateUrl(data.linkedin)) {
    errors.linkedin = "Invalid LinkedIn URL";
  }

  if (data.github && data.github.trim() && !validateUrl(data.github)) {
    errors.github = "Invalid GitHub URL";
  }

  if (data.website && data.website.trim() && !validateUrl(data.website)) {
    errors.website = "Invalid website URL";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateExperience = (data: any): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.company?.trim()) {
    errors.company = "Company name is required";
  }

  if (!data.position?.trim()) {
    errors.position = "Position is required";
  }

  if (!data.location?.trim()) {
    errors.location = "Location is required";
  }

  if (!data.start_date?.trim()) {
    errors.start_date = "Start date is required";
  } else if (!validateDateFormat(data.start_date)) {
    errors.start_date = "Date must be in YYYY-MM format";
  }

  if (!data.end_date?.trim()) {
    errors.end_date =
      'End date is required (use "Present" for current position)';
  } else if (
    data.end_date !== "Present" &&
    !validateDateFormat(data.end_date)
  ) {
    errors.end_date = 'Date must be in YYYY-MM format or "Present"';
  }

  if (!data.bullets || data.bullets.length === 0) {
    errors.bullets = "At least one bullet point is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateEducation = (data: any): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.institution?.trim()) {
    errors.institution = "Institution name is required";
  }

  if (!data.degree?.trim()) {
    errors.degree = "Degree is required";
  }

  if (!data.field?.trim()) {
    errors.field = "Field of study is required";
  }

  if (!data.location?.trim()) {
    errors.location = "Location is required";
  }

  if (!data.graduation_date?.trim()) {
    errors.graduation_date = "Graduation date is required";
  } else if (!validateDateFormat(data.graduation_date)) {
    errors.graduation_date = "Date must be in YYYY-MM format";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateProject = (data: any): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.name?.trim()) {
    errors.name = "Project name is required";
  }

  if (!data.description?.trim()) {
    errors.description = "Description is required";
  }

  if (!data.technologies || data.technologies.length === 0) {
    errors.technologies = "At least one technology is required";
  }

  if (data.link && data.link.trim() && !validateUrl(data.link)) {
    errors.link = "Invalid project link URL";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
