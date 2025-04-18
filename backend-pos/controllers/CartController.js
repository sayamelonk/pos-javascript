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

// mengekspor fungsi fungsi untuk digunakan di file lain
module.exports = { findCarts };
