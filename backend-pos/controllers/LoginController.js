// import express
const express = require("express");

// import bcrypt untuk eksekusi password
const bcrypt = require("bcryptjs");

// import jsonwebtoken untuk pembuatan token JWT
const jwt = require("jsonwebtoken");

// import prisma client untuk berinteraksi dengan database
const prisma = require("../prisma/client");

// fungsi login
const login = async (req, res) => {
  try {
    // mencari pengguna berdasarkan email
    const user = await prisma.user.findFirst({
      where: {
        email: req.body.email, // menggunakan email yang diberikan dari request body
      },
      select: {
        id: true, // mengambil id pengguna
        name: true, // mengambil name pengguna
        email: true, // mengambil email pengguna
        password: true, // mengambil password pengguna
      },
    });

    // jika pengguna tidak ditemukan
    if (!user)
      return res.status(400).json({
        success: false,
        message: "pengguna tidak ditemukan", // pesan jika pengguna tidak ditemukan
      });

    // membandikkan password yang diberikan dengan password yang disimpan di database
    const validPassword = await bcrypt.compare(
      req.body.password, // password yang diberikan pengguna
      user.password // password yang disimpan di database
    );

    if (!validPassword)
      return res.status(400).json({
        success: false,
        message: "password salah", // pesan jika password salah
      });

    // membuat token JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // token berlaku selama 1 jam
    });

    // mendestructur password agar tidak dikembalikan dalam respons
    const { password, ...userWithoutPassword } = user;

    // mengembalikan respon jika login berhasil
    return res.status(200).json({
      meta: {
        success: true,
        message: "login berhasil", // pesan jika login berhasil
      },
      data: {
        user: userWithoutPassword, // mengembalikan data pengguna tanpa password
        token: token, // mengembalikan token yang telah dibuat
      },
    });
  } catch (error) {
    // jika terjadi kesalahan, kirim respons kesalahan 500 Internal Server Error
    return res.status(500).send({
      // meta untuk respons dalam format JSON
      meta: {
        success: false,
        message: "Terjadi kesalahan di server",
      },
      // data kesalahan
      errors: error,
    });
  }
};

// mengekspor fungsi login agar dapat digunakan di tempat lain
module.exports = login;
