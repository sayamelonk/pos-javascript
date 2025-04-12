// import express
const express = require("express");

// import jwt untuk verifikasi token JWT
const jwt = require("jsonwebtoken");

// middlerware untuk verifikasi token JWT
const verifyToken = async (req, res, next) => {
  // mengambil token dari header Authorization
  const token = req.headers["authorization"];

  // jika token tidak ada, kirimkan respon 401 Unauthorized
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  // verifikasi token JWT
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    // jika token tidak valid, kirimkan respon 401 Unauthorized
    if (err) return res.status(401).json({ message: "Unauthorized" });

    // jika token valid, simpan ID pengguna dari token request
    req.userId = decoded.id;

    // lanjutkan ke middleware berikutnya
    next();
  });
};

// mengekspor middleware verifyToken agar dapat digunakan di tempat lain
module.exports = verifyToken;
