const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./scratch');

exports.getItem = (key) => localStorage.getItem(key);
exports.setItem = (key, value) => localStorage.setItem(key, value);
exports.removeItem = (key) => localStorage.removeItem(key);
