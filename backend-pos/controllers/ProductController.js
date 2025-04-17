// import express untuk membuat server web
const express = require("express");

// import prisma client untuk berinteraksi dengan database
const prisma = require("../prisma/client");

// fungsi findProducts untuk mengambil daftar produk dengan paginasi
const findProducts = async (req, res) => {
  try {
    // mengambil nilai halaman dan limit dari parameter query, dengan nilai default
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // ambil kata kunci pencarian dari parameter query
    const search = req.query.search || "";

    //  mengambil semua produk dari database
    const products = await prisma.product.findMany({
      where: {
        title: {
          contains: search, // mencari judul produk yang mengandung kata kunci
        },
      },
      select: {
        id: true,
        barcode: true,
        title: true,
        image: true,
        description: true,
        buy_price: true,
        sell_price: true,
        stock: true,
        created_at: true,
        updated_at: true,
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
      skip: skip,
      take: limit,
    });

    // mengambil jumlah total produk untuk paginasi
    const totalProducts = await prisma.product.count({
      where: {
        title: {
          contains: search, // menghitung jumlah total produk yang mengandung kata kunci pencarian
        },
      },
    });

    // menghitung total halaman
    const totalPages = Math.ceil(totalProducts / limit);

    // mengirim respons
    res.status(200).send({
      // meta untuk respons dalam format JSON
      meta: {
        success: true,
        message: "Berhasil mendapatkan semua produk",
      },
      // data produk
      data: products,
      // paginasi
      pagination: {
        currentPage: page,
        perPage: limit,
        total: totalProducts,
        totalPages: totalPages,
      },
    });
  } catch (error) {
    // mengirim respons jika terjadi kesalahan
    res.status(500).send({
      // meta untuk respons JSON
      meta: {
        success: false,
        message: "Terjadi kesalahan di server",
      },
      // data errors
      errors: error,
    });
  }
};

// fungsi createProduct untuk membuat produk baru
const createProduct = async (req, res) => {
  try {
    // menyiapkan data product baru
    const product = await prisma.product.create({
      data: {
        barcode: req.body.barcode,
        title: req.body.title,
        description: req.body.description,
        buy_price: parseInt(req.body.buy_price),
        sell_price: parseInt(req.body.sell_price),
        stock: parseInt(req.body.stock),
        image: req.file.path,
        category_id: parseInt(req.body.category_id),
      },
      include: {
        category: true,
      },
    });

    // mengerim respons
    res.status(201).send({
      // meta untuk respons JSON
      meta: {
        success: true,
        message: "Produk berhasil dibuat",
      },
      // data produk
      data: product,
    });
  } catch (error) {
    // mengirim respons jika terjadi kesalahan
    res.status(500).send({
      // meta untuk respons JSON
      meta: {
        success: false,
        message: "Terjadi kesalahan di server",
      },
      // data errors
      errors: error,
    });
  }
};

// mengekspor fungsi-fungsi untuk digunakan di file lain
module.exports = {
  findProducts,
  createProduct,
};
