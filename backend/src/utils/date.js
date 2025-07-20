exports.formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-GB'); // DD/MM/YYYY
};

exports.parseDate = (dateString) => {
  return new Date(dateString);
};

exports.ageFromDOB = (dob) => {
  const birthDate = new Date(dob);
  const ageDiff = Date.now() - birthDate.getTime();
  return Math.abs(new Date(ageDiff).getUTCFullYear() - 1970);
};
