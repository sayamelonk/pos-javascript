// import express untuk membuat server web
const express = require("express");

// import prisma client untuk berinteraksi dengan database
const prisma = require("../prisma/client");

// import fs untuk operasi sistem file seperti menghapus file
const fs = require("fs");

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

// fungsi findProductById untuk mengambil produk berdasarkan ID
const findProductById = async (req, res) => {
  // mengambil ID dari parameter
  const { id } = req.params;

  try {
    // mengambil produk berdasarkan ID\
    const product = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        barcode: true,
        title: true,
        description: true,
        buy_price: true,
        sell_price: true,
        stock: true,
        image: true,
        category_id: true,
        created_at: true,
        updated_at: true,
        category: {
          select: {
            name: true,
            description: true,
            image: true,
            created_at: true,
            updated_at: true,
          },
        },
      },
    });
    if (!product) {
      res.status(404).send({
        // meta untuk response json
        meta: {
          success: false,
          message: `Produk dengan ID: ${id} tidak ditemukan`,
        },
      });
    }

    // mengirimkan respons
    res.status(200).send({
      // meta untuk response json
      meta: {
        success: true,
        message: `Berhasil mendapatkan produk dengan ID: ${id}`,
      },
      // data produk
      data: product,
    });
  } catch (error) {
    // mengirimkan respons jika terjadi kesalahan
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

// fungsi updateProduct untuk memperbarui produk
const updateProduct = async (req, res) => {
  // mengambil ID dari parameter
  const { id } = req.params;

  try {
    // mengupdate produk dengan atau tanpa gambar
    const dataProduct = {
      barcode: req.body.barcode,
      title: req.body.title,
      description: req.body.description,
      buy_price: parseInt(req.body.buy_price),
      sell_price: parseInt(req.body.sell_price),
      stock: parseInt(req.body.stock),
      category_id: parseInt(req.body.category_id),
      updated_at: new Date(),
    };

    // cek apakah ada gambar yang diupload
    if (req.file) {
      // mengassign gambar ke object data produk
      dataProduct.image = req.file.path;

      // get product by id
      const product = await prisma.product.findUnique({
        where: {
          id: Number(id),
        },
      });
      if (product.image) {
        // menghapus gambar lama
        fs.unlinkSync(product.image);
      }
    }
    // mengupdate produk
    const product = await prisma.product.update({
      where: {
        id: Number(id),
      },
      data: dataProduct,
      include: {
        category: true,
      },
    });

    // mengirim respons
    res.status(200).send({
      // meta untuk response json
      meta: {
        success: true,
        message: `Produk berhasil diperbarui`,
      },
      // data produk
      data: product,
    });
  } catch (error) {
    // mengirimkan respons jika terjadi kesalahan
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

// fungsi deleteProduct untuk menghapus produk berdasarkan ID
const deleteProduct = async (req, res) => {
  // mengambil ID dari parameter
  const { id } = req.params;

  try {
    // mengambil produk yang akan dihapus
    const product = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!product) {
      return res.status(404).send({
        // meta untuk response json
        meta: {
          success: false,
          message: `Produk dengan ID: ${id} tidak ditemukan`,
        },
      });
    }

    // menghapus produk
    await prisma.product.delete({
      where: {
        id: Number(id),
      },
    });
    // menghapus gambar dari folder uploads jika ada
    if (product.image) {
      const imagePath = product.image;
      const fileName = imagePath.substring(imagePath.lastIndexOf("/") + 1);
      const filePath = `uploads/${fileName}`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // mengirim respons
    res.status(200).send({
      // meta untuk response json
      meta: {
        success: true,
        message: `Produk berhasil dihapus`,
      },
    });
  } catch (error) {
    // mengirimkan respons jika terjadi kesalahan
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

// fungsi findProductsByCategory untuk mengambil daftar produk berdasarkan kategori
const findProductsByCategoryId = async (req, res) => {
  // mengambil ID kategori dari parameter
  const { id } = req.params;

  try {
    // mengambil nilai halaman dan limit dari parameter query, dengan nilai default
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // mengambil produk berdasarkan kategori ID

    const products = await prisma.product.findMany({
      where: {
        category_id: Number(id),
      },
      select: {
        id: true,
        barcode: true,
        title: true,
        description: true,
        buy_price: true,
        sell_price: true,
        stock: true,
        image: true,
        category_id: true,
        created_at: true,
        updated_at: true,
      },
      skip: skip,
      take: limit,
    });

    // mengambil jumlah total produk untuk paginasi
    const totalProducts = await prisma.product.count({
      where: {
        category_id: Number(id), // hitung produk berdasarkan kategori ID
      },
    });

    // menghitung total halaman
    const totalPages = Math.ceil(totalProducts / limit);

    // mengirimkan respons
    res.status(200).send({
      // meta untuk response json
      meta: {
        success: true,
        message: `Berhasil mendapatkan produk dengan kategori ID: ${id}`,
      },
      // data produk
      data: products,
      // informasi paginasi
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        total: totalProducts,
        limit: limit,
      },
    });
  } catch (error) {
    // mengirimkan respons jika terjadi kesalahan
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

// fungsi findProductByBarcode untuk mengambil produk berdasarkan barcode
const findProductByBarcode = async (req, res) => {
  try {
    // mengambil produk berdasarkan barcode
    const product = await prisma.product.findMany({
      where: {
        barcode: req.body.barcode,
      },
      select: {
        id: true,
        barcode: true,
        title: true,
        description: true,
        buy_price: true,
        sell_price: true,
        stock: true,
        image: true,
        category_id: true,
        created_at: true,
        updated_at: true,
        category: {
          select: {
            name: true,
            description: true,
            image: true,
            created_at: true,
            updated_at: true,
          },
        },
      },
    });

    if (!product) {
      return res.status(404).send({
        // meta untuk response json
        meta: {
          success: false,
          message: `Produk dengan barcode: ${req.body.barcode} tidak ditemukan`,
        },
      });
    }

    // mengirimkan respons
    res.status(200).send({
      // meta untuk response json
      meta: {
        success: true,
        message: `Berhasil mendapatkan produk dengan barcode: ${req.body.barcode}`,
      },
      // data produk
      data: product,
    });
  } catch (error) {
    // mengirimkan respons jika terjadi kesalahan
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
// mengekspor fungsi-fungsi untuk digunakan di file lain
module.exports = {
  findProducts,
  createProduct,
  findProductById,
  updateProduct,
  deleteProduct,
  findProductsByCategoryId,
  findProductByBarcode,
};
