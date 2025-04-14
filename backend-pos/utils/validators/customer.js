// import express validator
const { body } = require("express-validator");

// definisikan validasi untuk create customer
const validateCustomer = [
  body("name").notEmpty().withMessage("Name is required"),
  body("no_telp").notEmpty().withMessage("No. Telp is required"),
  body("address").notEmpty().withMessage("Address is required"),
];

module.exports = {
  validateCustomer,
}
