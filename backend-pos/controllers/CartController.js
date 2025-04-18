// import express
const express = require("express");

// import prisma client
const prisma = require("../prisma/client");

// fungsi findCarts dengan pagination
const findCarts = async (req, res) => {
  try {
    // mendapatkan data keranjang dari database
    const carts = await prisma.cart.findMany({
      select: {
        id: true,
        cashier_id: true,
        product_id: true,
        qty: true,
        price: true,
        created_at: true,
        updated_at: true,
        product: {
          select: {
            id: true,
            title: true,
            buy_price: true,
            sell_price: true,
            image: true,
          },
        },
        cashier: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where: {
        cashier_id: parseInt(req.userId),
      },
      orderBy: {
        id: "desc",
      },
    });

    // menghitung total harga dengan menjumlahkan harga setiap item keranjang
    const totalPrice = carts.reduce((sum, cart) => sum + cart.price, 0);

    // mengirimkan respons
    res.status(200).send({
      // meta untuk repons JSON
      meta: {
        success: true,
        message: `Berhasil mendapatkan semua keranjang oleh kasir: ${req.userId}`,
      },
      // data keranjang
      data: carts,
      totalPrice: totalPrice,
    });
  } catch (error) {
    res.status(500).send({
      // meta untuk repons JSON
      meta: {
        success: false,
        message: "Terjadi kesalahan di server",
      },
      // data kesalahan
      data: error,
    });
  }
};

// fungsi createCart
const createCart = async (req, res) => {
  try {
    // memeriksa apakah produk ada
    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(req.body.product_id),
      },
    });

    if (!product) {
      // jika produk tidak ada, kembalikan error 404
      return res.status(404).send({
        meta: {
          success: false,
          message: `Produk dengan ID: ${req.body.product_id} tidak ditemukan`,
        },
      });
    }

    // memeriksa apakah item keranjang dengan produk_id dan cashier_id yang sama sudah ada
    const existingCart = await prisma.cart.findFirst({
      where: {
        product_id: parseInt(req.body.product_id),
        cashier_id: req.userId,
      },
    });

    if (existingCart) {
      // jika item keranjang sudah ada, tambahkan jumlahnya
      const updateCart = await prisma.cart.update({
        where: {
          id: existingCart.id,
        },
        data: {
          qty: existingCart.qty + parseInt(req.body.qty),
          price:
            product.sell_price * (existingCart.qty + parseInt(req.body.qty)),
          updated_at: new Date(),
        },
      });

      // mengirimkan respons untuk keranjang yang diperbarui
      return res.status(200).send({
        meta: {
          success: true,
          message: "Jumlah keranjang berhasil diperbarui",
        },
        data: updateCart,
      });
    } else {
      // jika item keranjang belum ada, buat baru
      const cart = await prisma.cart.create({
        data: {
          cashier_id: req.userId,
          product_id: parseInt(req.body.product_id),
          qty: parseInt(req.body.qty),
          price: product.sell_price * parseInt(req.body.qty),
        },
        include: {
          product: true,
          cashier: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // mengirimkan respons untuk keranjang baru
      return res.status(201).send({
        meta: {
          success: true,
          message: "Keranjang berhasil dibuat",
        },
        data: cart,
      });
    }
  } catch (error) {
    res.status(500).send({
      // meta untuk repons JSON
      meta: {
        success: false,
        message: "Terjadi kesalahan di server",
      },
      // data kesalahan
      data: error,
    });
  }
};

// fungsi deleteCart
const deleteCart = async (req, res) => {
  // mendapatkan ID dari params
  const { id } = req.params;

  try {
    // mendapatkan data keranjang yang akan dihapus
    const cart = await prisma.cart.findUnique({
      where: {
        id: Number(id),
        cashier_id: parseInt(req.userId),
      },
    });

    if (!cart) {
      return res.status(404).send({
        // meta untuk repons JSON
        meta: {
          success: false,
          message: `Keranjang dengan ID: ${id} tidak ditemukan`,
        },
      });
    }

    // menghapus keranjang
    await prisma.cart.delete({
      where: {
        id: Number(id),
        cashier_id: parseInt(req.userId),
      },
    });

    // mengirimkan respons
    res.status(200).send({
      // meta untuk repons JSON
      meta: {
        success: true,
        message: "Keranjang berhasil dihapus",
      },
    });
  } catch (error) {
    res.status(500).send({
      // meta untuk repons JSON
      meta: {
        success: false,
        message: "Terjadi kesalahan di server",
      },
      // data kesalahan
      data: error,
    });
  }
};

// mengekspor fungsi fungsi untuk digunakan di file lain
module.exports = { findCarts, createCart, deleteCart };
