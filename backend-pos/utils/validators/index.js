// import validators
const { validateLogin } = require("./auth");
const { validateUser } = require("./user");
const { validateCategory } = require("./category");
const { validateProduct } = require("./product");
const { validateCustomer } = require("./customer");
const { validateTransaction } = require("./transaction");
const { validateSales } = require("./sale");
const { validateProfit } = require("./profit");

// export validators
module.exports = {
  validateLogin,
  validateUser,
  validateCategory,
  validateProduct,
  validateCustomer,
  validateTransaction,
  validateSales,
  validateProfit,
};
