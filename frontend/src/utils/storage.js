// ✅ Save token to localStorage
export const saveToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token"); // clear if empty
  }
};

// ✅ Get token from localStorage
export const getToken = () => {
  return localStorage.getItem("token");
};

// ✅ Remove token explicitly (optional)
export const removeToken = () => {
  localStorage.removeItem("token");
};
