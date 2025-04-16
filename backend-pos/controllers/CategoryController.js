// import express
const express = require("express");

// import prisma client
const prisma = require("../prisma/client");

// fungsi findCategories dengan paginasi dan fitur pencarian
const findCategories = async (req, res) => {
  try {
    // ambil halaman dan limit parameter query, dengan nilai default
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // ambil kata kunci pencarian dari paremter query
    const search = req.query.search || "";

    // ambil kategiry secara paginasi dari database dengan fitur pencarian
    const categories = await prisma.category.findMany({
      where: {
        name: {
          contains: search, // mencari nama categori yang mengandung kata kunci
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
        description: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: {
        id: "desc",
      },
      skip: skip,
      take: limit,
    });

    // dapatkan total jumlah kategori untuk paginasi
    const totalCategories = await prisma.category.count({
      where: {
        name: {
          contains: search, // menghitung jumlah total kategori yang sesuai dengan kata kunci pencarian
        },
      },
    });

    // hitung total halaman
    const totalPages = Math.ceil(totalCategories / limit);

    // kirim respons
    res.status(200).send({
      // meta untuk respons dalam format JSON
      meta: {
        success: true,
        message: "Berhasil mendapatkan semua kategori",
      },
      // data kategori
      data: categories,
      // paginasi
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        perPage: limit,
        total: totalCategories,
      },
    });
  } catch (error) {
    // jika terjadi kesalahan, kirim respons kesalahan internal server
    res.status(500).send({
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

// ekspor fungsi-fungsi agar dapat digunakan di temoat lain
module.exports = {
  findCategories,
};
