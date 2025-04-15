// import express
const express = require("express");

// import prisma client
const prisma = require("../prisma/client");

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
    req.status(200).send({
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

module.exports = { findUsers };
