// import express untuk membuat aplikasi web
const express = require("express");

// import prisma client untuk berinteraksi dengan database
const prisma = require("../prisma/client");

// import function untuk menghasilkan invoice acak
const { generateRandomInvoice } = require("../utils/generateRandomInvoice");

// fungsi untuk membuat transaksi baru
const createTransaction = async (req, res) => {
  try {
    // menghasilkan invoice acak
    const invoice = generateRandomInvoice();

    // memastikan input numerik valid
    const cashierId = parseInt(req.userId);
    const customerId = parseInt(req.body.customer_id) || null;
    const cash = parseInt(req.body.cash);
    const change = parseInt(req.body.change);
    const discount = parseInt(req.body.discount);
    const grandTotal = parseInt(req.body.grand_total);

    // memeriksa nilai NaN dan mengembalikan error jika ditemukan
    if (
      isNaN(customerId) ||
      isNaN(cash) ||
      isNaN(change) ||
      isNaN(discount) ||
      isNaN(grandTotal)
    ) {
      return res.status(400).send({
        meta: {
          success: false,
          message: "Data input tidak valid. Silahkan periksa permintaan Anda",
        },
      });
    }

    // menyisipkan data transaksi ke dalam database
    const transaction = await prisma.transaction.create({
      data: {
        cashier_id: cashierId,
        customer_id: customerId,
        invoice: invoice,
        cash: cash,
        change: change,
        discount: discount,
        grand_total: grandTotal,
      },
    });

    // mengambilkan item keranjang untuk kasir saat ini
    const carts = await prisma.cart.findMany({
      where: { cashier_id: cashierId },
      include: { product: true },
    });

    // memproses setiap item keranjang
    for (const cart of carts) {
      // memastikan harga adalah float
      const price = parseFloat(cart.price);

      // menyisipkan detail transaksi
      await prisma.transactionDetail.create({
        data: {
          transaction_id: transaction.id,
          product_id: cart.product_id,
          qty: cart.qty,
          price: price,
        },
      });

      // menghitung keuntungan
      const totalBuyPrice = cart.product.buy_price * cart.qty;
      const totalSellPrice = cart.product.sell_price * cart.qty;
      const profits = totalSellPrice - totalBuyPrice;

      // menyisipkan keuntungan
      await prisma.profit.create({
        data: {
          transaction_id: transaction.id,
          total: profits,
        },
      });

      // memperbarui stok produk
      await prisma.product.update({
        where: { id: cart.product_id },
        data: { stock: { decrement: cart.qty } },
      });
    }

    // menghapus item keranjang untuk kasir
    await prisma.cart.deleteMany({
      where: { cashier_id: cashierId },
    });

    // mengirimkan response sukses
    res.status(201).send({
      meta: {
        success: true,
        message: "Transaksi berhasil dibuat",
      },
      data: transaction,
    });
  } catch (error) {
    res.status(500).send({
      meta: {
        success: false,
        message: "Terjadi kesalahan di server",
      },
      // data kesalahan
      data: error.message,
    });
  }
};

// fungsi findTransactionByInvoice
const findTransactionByInvoice = async (req, res) => {
  // ambil ID dari parameter URL
  const { invoice } = req.query;

  try {
    // ambil kategori bedasarkan ID
    const transaction = await prisma.transaction.findFirst({
      where: {
        invoice: invoice,
      },
      select: {
        id: true,
        cashier_id: true,
        customer_id: true,
        invoice: true,
        cash: true,
        change: true,
        discount: true,
        grand_total: true,
        created_at: true,
        customer: {
          select: {
            name: true,
          },
        },
        cashier: {
          select: {
            name: true,
            created_at: true,
            updated_at: true,
          },
        },
        transaction_details: {
          select: {
            id: true,
            product_id: true,
            qty: true,
            price: true,
            product: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

    if (!transaction) {
      // jika kategori tidak ditemukan, kirim respons 404
      return res.status(404).send({
        // meta untuk respons dalam format JSON
        meta: {
          success: false,
          message: `Transaksi dengan invoice: ${invoice} tidak ditemukan`,
        },
      });
    }

    // kirim respons
    res.status(200).send({
      // meta untuk respons dalam format JSON
      meta: {
        success: true,
        message: `Berhasil mendapatkan transaksi dengan invoice: ${invoice}`,
      },
      // data kategori
      data: transaction,
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
      data: error,
    });
  }
};

module.exports = { createTransaction, findTransactionByInvoice };
