// mengimpor express
const express = require("express");

// mengimpor prisma client
const prisma = require("../prisma/client");

// fungsi findCustomers dengan pagination
const findCustomers = async (req, res) => {
  try {
    // mendapatkan nilai page dan limit dari parameter query, dengan nilai default
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // ambil kata kunci pencarian dari parameter query
    const search = req.query.search || "";

    // mendapatkan data pelanggan yang dipaginasikan dari database
    const customers = await prisma.customer.findMany({
      where: {
        name: {
          contains: search, // mencari nama pelanggan yang mengandung kata kunci
        },
      },
      select: {
        id: true,
        name: true,
        no_telp: true,
        address: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: {
        id: "desc",
      },
      skip: skip,
      take: limit,
    });

    // mencapatkan total jumlah pelanggan untuk pagination
    const totalCustomers = await prisma.customer.count({
      where: {
        name: {
          contains: search, //menghitung total pelanggan yang sesuai dengan kata kunci pencarian
        },
      },
    });

    // menghitung total halaman
    const totalPage = Math.ceil(totalCustomers / limit);

    // mengirimkan respons
    res.status(200).json({
      // meta untuk respons JSON
      meta: {
        success: true,
        message: "Berhasil mendapatkan sebuah daftar pelanggan",
      },
      // data pelanggan
      data: customers,
      // data pagination
      pagination: {
        currentPage: page,
        totalPage: totalPage,
        perPage: limit,
        total: totalCustomers,
      },
    });
  } catch (error) {
    // jika terjadi kesalahan, kirimkan respons dengan pesan error
    res.status(500).json({
      // meta untuk respons JSON
      meta: {
        success: false,
        message: "Terjadi kesalahan pada server",
      },
      // data error
      data: error,
    });
  }
};

// fungsi createCustomer unruk membuat pelanggan baru
const createCustomer = async (req, res) => {
  try {
    // menyisipkan data pelanggan baru ke dalam database
    const customer = await prisma.customer.create({
      data: {
        name: req.body.name,
        no_telp: req.body.no_telp,
        address: req.body.address,
      },
    });

    // mengirimkan respons setelah berhasil membuat pelanggan baru
    res.status(201).send({
      // meta untuk repons JSON
      meta: {
        success: true,
        message: "Pelanggan berhasil dibuat",
      },
      // data pelanggan yang baru dibuat
      data: customer,
    });
  } catch (error) {
    // jika terjadi kesalahan, kirimkan respons dengan pesan error
    res.status(500).send({
      // meta untuk repons JSON
      meta: {
        success: false,
        message: "Terjadi kesalahan di server",
      },
      // data error
      data: error,
    });
  }
};

// fungsi findCustomerById untuk mengambil pelanggan berdasarkan ID
const findCustomerById = async (req, res) => {
  // mendapatkan ID dari parameter
  const { id } = req.params;

  try {
    // mendapatkan pelanggan berdasarkan ID
    const customer = await prisma.customer.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        name: true,
        no_telp: true,
        address: true,
        created_at: true,
        updated_at: true,
      },
    });

    // jika pelanggan tidak ditemukan, kirimkan respons 404
    if (!customer) {
      res.status(404).send({
        // meta untuk repons JSON
        meta: {
          success: false,
          message: `Pelanggan dengan ID: ${id} tidak ditemukan`,
        },
      });
    }

    // mengirimkan respons setelah berhasil mendapatkan pelanggan berdasarkan ID
    res.status(200).send({
      // meta untuk repons JSON
      meta: {
        success: true,
        message: `Berhasil mendapatkan sebuah pelanggan dengan ID: ${id}`,
      },
      // data pelanggan
      data: customer,
    });
  } catch (error) {
    // jika terjadi kesalahan, kirimkan respons dengan pesan error
    res.status(500).send({
      // meta untuk repons JSON
      meta: {
        success: false,
        message: "Terjadi kesalahan di server",
      },
      // data error
      data: error,
    });
  }
};

// fungsi updateCustomer untuk mengupdate pelanggan
const updateCustomer = async (req, res) => {
  // mendapatkan ID dari parameter
  const { id } = req.params;

  try {
    // memperbarui data pelanggan berdasarkan ID
    const customer = await prisma.customer.update({
      where: {
        id: Number(id),
      },
      data: {
        name: req.body.name,
        no_telp: req.body.no_telp,
        address: req.body.address,
        updated_at: new Date(),
      },
    });

    // mengirimkan repons setelah berhasil memperbarui pelanggan
    res.status(200).send({
      // meta untuk repons JSON
      meta: {
        success: true,
        message: `Pelanggan dengan ID: ${id} berhasil diperbarui`,
      },
      // data pelanggan
      data: customer,
    });
  } catch (error) {
    // jika terjadi kesalahan, kirimkan respons dengan pesan error
    res.status(500).send({
      // meta untuk repons JSON
      meta: {
        success: false,
        message: "Terjadi kesalahan di server",
      },
      // data error
      data: error,
    });
  }
};

// fungsi deleteCustomer untuk menghapus pelanggan
const deleteCustomer = async (req, res) => {
  // mendapatkan ID dari parameter
  const { id } = req.params;

  try {
    // mendapatkan data pelanggan yang akan dihapus
    const customer = await prisma.customer.findUnique({
      where: {
        id: Number(id),
      },
    });
    // jika pelanggan tidak ditemukan, kirimkan respons 404
    if (!customer) {
      return res.status(404).send({
        // meta untuk repons JSON
        meta: {
          success: false,
          message: `Pelanggan dengan ID: ${id} tidak ditemukan`,
        },
      });
    }

    // menghapus pelanggan berdasarkan ID
    await prisma.customer.delete({
      where: {
        id: Number(id),
      },
    });

    // mengirimkan respons setelah berhasil menghapus pelanggan
    res.status(200).send({
      // meta untuk repons JSON
      meta: {
        success: true,
        message: "Pelanggan berhasil dihapus",
      },
    });
  } catch (error) {
    // jika terjadi kesalahan, kirimkan respons dengan pesan error
    res.status(500).send({
      // meta untuk repons JSON
      meta: {
        success: false,
        message: "Terjadi kesalahan di server",
      },
      // data error
      data: error,
    });
  }
};

// fungsi allCustomers
const allCustomers = async (req, res) => {
  try {
    // mendapatkan data pelanggan
    const customers = await prisma.customer.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    // map the customers to the desired format
    const formattedCustomers = customers.map((customer) => ({
      value: customer.id,
      label: customer.name,
    }));

    // mengirimkan respons
    res.status(200).send({
      // meta untuk repons JSON
      meta: {
        success: true,
        message: "Berhasil mendapatkan semua pelanggan",
      },
      // data pelanggan
      data: formattedCustomers,
    });
  } catch (error) {
    // jika terjadi kesalahan, kirimkan respons dengan pesan error
    res.status(500).send({
      // meta untuk repons JSON
      meta: {
        success: false,
        message: "Terjadi kesalahan di server",
      },
      // data error
      data: error.message,
    });
  }
};

// export fungsi-fungsi untuk digunakan di modul lain
module.exports = {
  findCustomers,
  createCustomer,
  findCustomerById,
  updateCustomer,
  deleteCustomer,
  allCustomers,
};
