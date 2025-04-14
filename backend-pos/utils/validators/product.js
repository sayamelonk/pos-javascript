// import express validator
const { body, check } = require("express-validator");

// import prisma client
const prisma = require("../prisma/client");

// define validation for create and update product
const validateProduct = [
  body("barcode")
    .notEmpty()
    .withMessage("Barcode is required")
    .custom(async (value, { req }) => {
      // use findFirst instead of findUnique
      const existingProduct = await prisma.product.findFirst({
        where: {
          barcode: barcode,
        },
      });
      if (
        existingProduct &&
        (!req.params.id || existingProduct.id !== Number(req.params.id))
      ) {
        throw new Error("Barcode must be unique");
      }
      return true;
    }),
  body("category_id").notEmpty().withMessage("Category is required"),
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  check("image").custom((value, { req }) => {
    // allow image to be optional if it's an update
    if (req.method === "POST" && !req.file) {
      throw new Error("Image is required");
    }
    return true;
  }),
  body("buy_price").isNumeric().withMessage("Buy Price is required"),
  body("sell_price").isNumeric().withMessage("Sell Price is required"),
  body("stock").isNumeric().withMessage("Stock is required"),
];

module.exports = {
  validateProduct,
};