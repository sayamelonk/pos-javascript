// import express
const express = require("express");

// import prisma client
const prisma = require("../prisma/client");

// import fs
const fs = require("fs");

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

// fungsi createCategory
const createCategory = async (req, res) => {
  try {
    // masukan data kategori baru
    const category = await prisma.category.create({
      data: {
        name: req.body.name,
        description: req.body.description,
        image: req.file.path,
      },
    });

    // kirim respons
    res.status(201).send({
      // meta untuk respons dalam format JSON
      meta: {
        success: true,
        message: "Kategori berhasil dibuat",
      },
      // data kategori baru
      data: category,
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

// fungsi findCategoryById
const findCategoryById = async (req, res) => {
  // ambil ID dari parameter URL
  const { id } = req.params;

  try {
    // ambil kategori bedasarkan ID
    const category = await prisma.category.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        name: true,
        image: true,
        description: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!category) {
      // jika kategori tidal ditemukan, kirim repons 404
      return res.status(404).send({
        // meta untuk respons dalam format JSON
        meta: {
          success: false,
          message: `Kategori dengan ID: ${id} tidak ditemukan`,
        },
      });
    }

    // kirim respons
    res.status(200).send({
      // meta untuk respons dalam format JSON
      meta: {
        success: true,
        message: `Berhasil mendapatkan kategori dengan ID: ${id}`,
      },
      // data kategori
      data: category,
    });
  } catch (error) {
    // jika terjadi kesalaham, kirim respons kesalahan internal server
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

// fungsi updateCategory
const updateCategory = async (req, res) => {
  // ambil ID dari parameter URL
  const { id } = req.params;

  try {
    // update kategori dengan atau tanpa gambar
    const dataCategory = {
      name: req.body.name,
      description: req.body.description,
      updated_at: new Date(),
    };

    // cek apakah ada gambar yang diupload
    if (req.file) {
      // assign gambar ke data kategori
      dataCategory.image = req.file.path;

      // get category by id
      const category = await prisma.category.findUnique({
        where: {
          id: Number(id),
        },
      });

      // cek jika ada file gambar
      if (category.image) {
        // hapus gambar lama
        fs.unlinkSync(category.image);
      }
    }

    // lakukan update data kategori
    const category = await prisma.category.update({
      where: {
        id: Number(id),
      },
      data: dataCategory,
    });

    // kirim respons
    res.status(200).send({
      // meta untuk respons dalam format JSON
      meta: {
        success: true,
        message: "Kategori berhasil diperbarui",
      },
      // data kategori yang diperbarui
      data: category,
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

// Fungsi deleteCategory
const deleteCategory = async (req, res) => {
  // Ambil ID dari parameter URL
  const { id } = req.params;

  try {
    // Ambil kategori yang akan dihapus
    const category = await prisma.category.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!category) {
      // Jika kategori tidak ditemukan, kirim respons 404
      return res.status(404).send({
        // meta untuk respons dalam format JSON
        meta: {
          success: false,
          message: `Kategori dengan ID: ${id} tidak ditemukan`,
        },
      });
    }

    // Hapus kategori dari database
    await prisma.category.delete({
      where: {
        id: Number(id),
      },
    });

    // Hapus gambar dari folder uploads jika ada
    if (category.image) {
      const imagePath = category.image;
      const fileName = imagePath.substring(imagePath.lastIndexOf("/") + 1);
      const filePath = `uploads/${fileName}`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Kirim respons
    res.status(200).send({
      // meta untuk respons dalam format JSON
      meta: {
        success: true,
        message: "Kategori berhasil dihapus",
      },
    });
  } catch (error) {
    // Jika terjadi kesalahan, kirim respons kesalahan internal server
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
  createCategory,
  findCategoryById,
  updateCategory,
  deleteCategory,
};
