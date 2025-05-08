// import express
const express = require("express");

// import prisma client
const prisma = require("../prisma/client");

// import library untuk manipulasi tanggal
const { subDays, format } = require("date-fns");

const getDashboardData = async (req, res) => {
  try {
    // mendapatkan tanggal hari ini
    const today = new Date();

    // menghitung tanggal satu minggu yang lalu
    const week = subDays(today, 7);

    // mengambil data penjualan dalam 7 hari terakhir dan mengelompokkan berdasarkan tanggal
    const chartSalesWeek = await prisma.transaction.groupBy({
      by: ["created_at"], // mengelompokkan berdasarkan tanggal pembuatan
      _sum: {
        grand_total: true, // menjumlahkan total penjualan
      },
      where: {
        created_at: {
          gte: week, // hanya mengambil data dari 7 hari terakhir
        },
      },
    });

    // inisialisasi array untuk menyimpan tanggal dan total penjualan
    let sales_date = [];
    let sales_total = [];

    // menghitung total penjualan selama 7 hari terakhir
    let sumSalesWeek = 0;

    // memproses data penjualan
    if (chartSalesWeek.length > 0) {
      chartSalesWeek.forEach((result) => {
        sales_date.push(format(new Date(result.created_at), "yyyy-MM-dd"));
        const total = parseInt(result._sum.grand_total || 0);
        sales_total.push(total);
        sumSalesWeek += total;
      });
    } else {
      sales_date.push("");
      sales_total.push(0);
    }

    // mengambil data profit dalam 7 hari terakhir dan mengelompokkan berdasarkan tanggal
    const chartProfitsWeek = await prisma.profit.groupBy({
      by: ["created_at"], // mengelompokkan berdasarkan tanggal pembuatan
      _sum: {
        total: true, // menjumlahkan total profit
      },
      where: {
        created_at: {
          gte: week, // hanya mengambil data dari 7 hari terakhir
        },
      },
    });

    // inisialisasi array untuk menyimpan tanggal dan total profit
    let profits_date = [];
    let profits_total = [];

    // menghitung total profit selama 7 hari terakhir
    let sumProfitsWeek = 0;

    // memproses data profit
    if (chartProfitsWeek.length > 0) {
      chartProfitsWeek.forEach((result) => {
        profits_date.push(format(new Date(result.created_at), "yyyy-MM-dd"));
        const total = parseInt(result._sum.total || 0);
        profits_total.push(total);
        sumProfitsWeek += total;
      });
    } else {
      profits_date.push("");
      profits_total.push(0);
    }

    // menghitung jumlah traksaksi dalam 7 hari terakhir
    const countSalesToday = await prisma.transaction.count({
      where: {
        created_at: {
          gte: new Date(`${today.toISOString().split("T")[0]}T00:00:00.000Z`), // mulai dari jam 00:00 hari ini
          lte: new Date(`${today.toISOString().split("T")[0]}T23:59:59.999Z`), // sampai jam 23:59 hari ini
        },
      },
    });

    // mengjumlahkan total penjualan pada hari ini
    const sumSalesToday = await prisma.transaction.aggregate({
      _sum: {
        grand_total: true, // menjumlahkan total grand_total
      },
      where: {
        created_at: {
          gte: new Date(`${today.toISOString().split("T")[0]}T00:00:00.000Z`), // mulai dari jam 00:00 hari ini
          lte: new Date(`${today.toISOString().split("T")[0]}T23:59:59.999Z`), // sampai jam 23:59 hari ini
        },
      },
    });

    // menjumlahkan total keuntungan pada hari ini
    const sumProfitsToday = await prisma.profit.aggregate({
      _sum: {
        total: true, // menjumlahkan total total
      },
      where: {
        created_at: {
          gte: new Date(`${today.toISOString().split("T")[0]}T00:00:00.000Z`), // mulai dari jam 00:00 hari ini
          lte: new Date(`${today.toISOString().split("T")[0]}T23:59:59.999Z`), // sampai jam 23:59 hari ini
        },
      },
    });

    // mengambil produk yang stoknya kurang dari atau sama dengan 5
    const productsLimitStock = await prisma.product.findMany({
      where: {
        stock: {
          lte: 5, // produk dengan stok kurang dari atau sama dengan 5
        },
      },
      include: {
        category: true, // sertakan data kategori produk
      },
    });

    // mengambil 5 produk terlaris bedsarkan jumlah transaksi
    const chartBestProducts = await prisma.transactionDetail.groupBy({
      by: ["product_id"], // mengelompokan berdasarkan ID produk
      _sum: {
        qty: true, // menjumlahkan total kuantitas
      },
      orderBy: {
        _sum: {
          qty: "desc", // mengurutkan bedasarkan kuantitas tertinggi
        },
      },
      take: 5, // ambil 5 produk teratas
    });

    // mengambil ID produk yang terlaris
    const productIds = chartBestProducts.map((item) => item.product_id);

    // mengambil detail produk bedasarkan ID yang sudah didapat
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        }, // hanya ambil produk dengan ID yang termasuk dalam productIds
      },
      select: {
        id: true,
        title: true, // hanya ambil ID dan judul produk
      },
    });

    // menggabungkan data produk terlaris dengan judul produk
    const bestSellingProducts = chartBestProducts.map((item) => {
      const product = products.find((p) => p.id === item.product_id);
      return {
        title: product?.title || "Unknown Product", // jika produk tidak ditemukan, gunakan judul "Unknown Product"
        total: item._sum.qty || 0, // total kuantitas produk terjual
      };
    });

    // mengirimkan response dengan data dashboard
    res.status(200).json({
      meta: {
        success: true,
        message: "Data dashboard berhasil diambil",
      },
      data: {
        count_sales_today: countSalesToday,
        sum_sales_today: sumSalesToday._sum.grand_total || 0,
        sum_sales_week: sumSalesWeek || 0,
        sum_profit_today: sumProfitsToday._sum.total || 0,
        sum_profit_week: sumProfitsWeek || 0,
        products_limit_stock: productsLimitStock,
        best_selling_products: bestSellingProducts,
        sales: {
          sales_date,
          sales_total,
        },
        profits: {
          profits_date,
          profits_total,
        },
      },
    });
  } catch (error) {
    // mengrimkan error jika terjadi kesalahan
    res.status(500).json({
      meta: {
        success: false,
        message: "Internal server error",
      },
      errors: error.message,
    });
  }
};

// ekspor fungsi-fungsi agar dapat digunakan di tempat lain
module.exports = {
  getDashboardData,
};
