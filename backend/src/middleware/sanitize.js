const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const sanitize = (app) => {
  app.use(mongoSanitize());
  app.use(xss());
};

module.exports = sanitize;
