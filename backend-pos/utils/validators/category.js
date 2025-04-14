const { body, check } = require("express-validator");

// define validation for category with optional file
const validateCategory = [
  body("name").notEmpty().withMessage("Name is required"),

  check("image")
    .optional() // makes the image check optional
    .custom((value, { req }) => {
      // check if file is uploaded during creation or update
      if (req.method == "POST" && !req.file) {
        // if creating (POST) and no file is uploaded, throw an error
        throw new Error("Image is required");
      }

      // no need to check image on update if not provided
      return true;
    }),
  body("description").notEmpty().withMessage("Description is required"),
];

module.exports = {
  validateCategory,
};
