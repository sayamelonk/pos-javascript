// import express
const express = require("express");

// import prisma client
const prisma = require("../prisma/client");

// import bcrypt
const bcrypt = require("bcryptjs");

// fungsi findUsers
const findUsers = async (req, res) => {
  try {
    // mendapatkan halaman dan batas dari parameter query, dengan nilai default
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // ambil kata kunci pencarian dari parameter query
    const search = req.query.search || "";

    // mengambil semua pengguna dari database
    const users = await prisma.user.findMany({
      where: {
        name: {
          contains: search,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        id: "desc",
      },
      skip: skip,
      take: limit,
    });

    // menghitung total pengguna untuk pagination
    const totalUsers = await prisma.user.count({
      where: {
        name: {
          contains: search,
        },
      },
    });

    // menghitung total halaman
    const totalPages = Math.ceil(totalUsers / limit);

    // mengirim respons
    res.status(200).send({
      // meta untuk response json
      meta: {
        success: true,
        message: "berhasil mengambil semua pengguna",
      },
      // data
      data: users,
      // pagination
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        total: totalUsers,
      },
    });
  } catch (error) {
    res.status(500).send({
      // meta untuk response json
      meta: {
        success: false,
        message: "Terjadi kesalahan di server",
      },
      // data errors
      errors: error,
    });
  }
};

// fungsi createUser
const createUser = async (req, res) => {
  // hash password
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  try {
    // menyisipkan data pengguna baru
    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      },
    });

    // mengirimkan respons
    res.status(201).send({
      // meta untuk response json
      meta: {
        success: true,
        message: "berhasil membuat pengguna",
      },
      // data
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      // meta untuk response json
      meta: {
        success: false,
        message: "Terjadi kesalahan di server",
      },
      // data errors
      errors: error,
    });
  }
};

// fungsi findUserById
const findUserById = async (req, res) => {
  // mendapatkan ID dari parameter
  const { id } = req.params;

  try {
    // mengambil pengguna berdasarkan ID
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user)
      return res.status(404).send({
        // meta untuk response json
        meta: {
          success: false,
          message: `Pengguna dengan ID: ${id} tidak ditemukan`,
        },
      });

    // mengirimkan respons
    res.status(200).send({
      // meta untuk response json
      meta: {
        success: true,
        message: `Berhasil mengambil pengguna dengan ID: ${id}`,
      },
      // data
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      // meta untuk response json
      meta: {
        success: false,
        message: "Terjadi kesalahan di server",
      },
      // data errors
      errors: error,
    });
  }
};

// fungsi updateUser
const updateUser = async (req, res) => {
  // mendapatkan ID dari parameter
  const { id } = req.params;

  // membuat objek data yang akan diupdate
  let userData = {
    name: req.body.name,
    email: req.body.email,
    updated_at: new Date(),
  };

  try {
    // only hash and update the password if it's provided
    if (req.body.password !== "") {
      // hash password
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      // tambahkan password ke objek data
      userData.password = hashedPassword;
    }

    // mengupdate pengguna
    const user = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: userData,
    });

    res.status(200).send({
      meta: {
        success: true,
        message: "pengguna berhasil diperbarui",
      },
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      meta: {
        success: false,
        message: "terjadi kesalahan di server",
      },
      errors: error,
    });
  }
};

// fungsi deleteUser
const deleteUser = async (req, res) => {
  // mendapatkan ID dari parameter
  const { id } = req.params;

  try {
    // menghapus pengguna
    await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });

    // mengirimkan respons
    res.status(200).send({
      // meta untuk response json
      meta: {
        success: true,
        message: "pengguna berhasil dihapus",
      },
    });
  } catch (error) {
    res.status(500).send({
      // meta untuk response json
      meta: {
        success: false,
        message: "Terjadi kesalahan di server",
      },
      // data errors
      errors: error,
    });
  }
};

module.exports = {
  findUsers,
  createUser,
  findUserById,
  updateUser,
  deleteUser,
};
