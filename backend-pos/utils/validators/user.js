// import express validator
const { body } = require("express-validator");

// import prisma
const prisma = require("../../prisma/client");

// define validation for create and update user
const validateUser = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email")
    .isEmail()
    .withMessage("Email is required")
    .custom(async (value, { req }) => {
      if (!value) {
        throw new Error("Email is required");
      }

      // for update operation, exclude the current user ID from the email uniqueness check
      const user = await prisma.user.findFirst({
        where: {
          email: value,
          NOT: {
            id: Number(req.params.id) || undefined,
          },
        },
      });
      if (user) {
        throw new Error("Email already exists");
      }
      return true;
    }),

  // conditional validation for password
  body("password")
    .if((value, { req }) => req.method === "POST")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("password")
    .if((value, { req }) => req.method === "PUT")
    .optional(),
];

module.exports = { validateUser };
