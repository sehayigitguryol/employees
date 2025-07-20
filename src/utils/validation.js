import {
  isValid,
  parseISO,
  differenceInYears,
  isAfter,
  startOfDay,
} from 'date-fns';

export function validateEmployeeForm(formData) {
  const errors = {};
  const data = formData || {};

  if (!data.firstName || data.firstName.trim() === '') {
    errors.firstName = {
      key: 'validation.required',
      params: {field: 'employee.details.firstName'},
    };
  }

  if (!data.lastName || data.lastName.trim() === '') {
    errors.lastName = {
      key: 'validation.required',
      params: {field: 'employee.details.lastName'},
    };
  }

  if (!data.email || data.email.trim() === '') {
    errors.email = {
      key: 'validation.required',
      params: {field: 'employee.details.email'},
    };
  } else if (!isValidEmail(data.email)) {
    errors.email = {
      key: 'validation.email',
    };
  }

  if (!data.phone || data.phone.trim() === '') {
    errors.phone = {
      key: 'validation.required',
      params: {field: 'employee.details.phone'},
    };
  } else if (!isValidPhone(data.phone)) {
    errors.phone = {
      key: 'validation.phone',
    };
  }

  if (!data.dateOfBirth) {
    errors.dateOfBirth = {
      key: 'validation.required',
      params: {field: 'employee.details.dateOfBirth'},
    };
  } else if (!isValidDate(data.dateOfBirth)) {
    errors.dateOfBirth = {
      key: 'validation.date',
    };
  }

  if (!data.dateOfEmployment) {
    errors.dateOfEmployment = {
      key: 'validation.required',
      params: {field: 'employee.details.dateOfEmployment'},
    };
  } else if (!isValidDate(data.dateOfEmployment)) {
    errors.dateOfEmployment = {
      key: 'validation.date',
    };
  }

  if (!data.department || data.department === '') {
    errors.department = {
      key: 'validation.required',
      params: {field: 'employee.details.department'},
    };
  }

  if (!data.position || data.position === '') {
    errors.position = {
      key: 'validation.required',
      params: {field: 'employee.details.position'},
    };
  }

  if (data.dateOfBirth && isValidDate(data.dateOfBirth)) {
    const birthDate = parseISO(data.dateOfBirth);
    const today = new Date();
    const age = differenceInYears(today, birthDate);

    if (age < 18) {
      errors.dateOfBirth = {
        key: 'validation.minAge',
        params: {age: 18},
      };
    }
  }

  if (data.dateOfEmployment && isValidDate(data.dateOfEmployment)) {
    const employmentDate = parseISO(data.dateOfEmployment);
    const today = startOfDay(new Date());

    if (isAfter(employmentDate, today)) {
      errors.dateOfEmployment = {
        key: 'validation.pastDate',
      };
    }
  }

  return errors;
}

export function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone) {
  // Turkish phone numbers can be:
  // Fixed line: (0xxx) xxx xx xx or 0xxx xxx xx xx
  // Mobile: +90 xxx xxx xx xx or 05xx xxx xx xx
  const cleanPhone = phone.replace(/[\s\-()]/g, '');

  // Check for fixed line format (starting with 0 but not 05)
  const fixedLineRegex = /^0(?!5)\d{9}$/;
  // Check for mobile format
  const mobileRegex = /^(\+90|0)5\d{9}$/;

  return fixedLineRegex.test(cleanPhone) || mobileRegex.test(cleanPhone);
}

export function isValidDate(dateString) {
  const date = parseISO(dateString);
  return isValid(date);
}
