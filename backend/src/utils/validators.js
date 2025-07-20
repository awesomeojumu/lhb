exports.isEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

exports.isPhoneNumber = (phone) => {
  const re = /^\+?[1-9]\d{1,14}$/; // E.164 format
  return re.test(phone);
};

exports.passwordStrength = (password) => {
  // At least 1 uppercase, 1 lowercase, 1 number, 1 special char, min 8 chars
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return re.test(password);
};
