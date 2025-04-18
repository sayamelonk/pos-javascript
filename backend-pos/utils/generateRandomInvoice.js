function generateRandomInvoice(prefix = "INV") {
  // get the current timestamp
  const timestamp = Date.now();

  // generate a random number between 1000 and 9999
  const randomNum = Math.floor(1000 + Math.random() * 9000);

  // combine the prefix, timestamp, and random number to create the invoice number
  const invoiceNumber = `${prefix}-${timestamp}-${randomNum}`;

  return invoiceNumber;
}

module.exports = { generateRandomInvoice };
