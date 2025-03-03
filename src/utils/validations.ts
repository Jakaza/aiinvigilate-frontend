
// Validation utility functions

// Define South African ID validation pattern
export const validateSouthAfricanID = (id: string) => {
  if (id.length !== 13) {
    return false;
  }
  
  if (!/^\d+$/.test(id)) {
    return false;
  }
  
  const year = parseInt(id.substring(0, 2));
  const month = parseInt(id.substring(2, 4));
  const day = parseInt(id.substring(4, 6));
  
  const currentYear = new Date().getFullYear() % 100;
  const fullYear = year > currentYear ? 1900 + year : 2000 + year;
  
  const birthDate = new Date(fullYear, month - 1, day);
  if (
    birthDate.getFullYear() !== fullYear ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day ||
    birthDate > new Date()
  ) {
    return false;
  }
  
  const genderDigit = parseInt(id.charAt(6));
  if (![0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(genderDigit)) {
    return false;
  }
  
  const citizenshipDigit = parseInt(id.charAt(10));
  if (![0, 1].includes(citizenshipDigit)) {
    return false;
  }
  
  return true;
};
