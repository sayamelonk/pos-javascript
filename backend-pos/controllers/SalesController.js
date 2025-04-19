// import express untuk membuat aplikasi web
const express = require("express");

// import prisma client untuk berinteraksi dengan database
const prisma = require("../prisma/client");

// import exceljs
const excelJS = require("exceljs");

// import moneyFormat
const { moneyFormat } = require("../utils/moneyFormat");
// fungsi untuk memfilter data penjualan berdasarkan rentang tanggal
const filterSales = async (req, res) => {
  try {
    // mengambil rentang tanggal untuk mencocokan data di database
    const startDate = new Date(req.query.start_date);
    const endDate = new Date(req.query.end_date);
    endDate.setHours(23, 59, 59, 999); // pastikan mencakup seluruh hari

    // ambil data penjualan dalam rentang tanggal
    const sales = await prisma.transaction.findMany({
      where: {
        created_at: {
          gte: startDate, // mulai dari startDate
          lte: endDate, // hingga endDate˝
        },
      },
      include: {
        cashier: {
          select: {
            id: true, // pilih ID kasir
            name: true, // pilih nama kasir
          },
        },
        customer: {
          select: {
            id: true, // pilih ID pelanggan
            name: true, // pilih nama pelanggan
          },
        },
      },
    });

    // hitung total penjualan dalam rentang tanggal
    const total = await prisma.transaction.aggregate({
      _sum: {
        grand_total: true, // hitung jumlah total grand_total
      },
      where: {
        created_at: {
          gte: startDate, // mulai dari startDate
          lte: endDate, // hingga endDate
        },
      },
    });

    // kirimkan respons
    res.status(200).json({
      meta: {
        success: true, // status sukses
        message: `Data penjualan dari ${req.query.start_date} sampai ${req.query.end_date} berhasil diambil`, // pesan keberhasilan
      },
      data: {
        sales: sales, // data penjualan
        total: total._sum.grand_total || 0, // total penjualan, jika tidak ada total maka default 0
      },
    });
  } catch (error) {
    // jika terjadi kesalahan, kirimkan respons kesalahan
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

// fungsi export
const exportSales = async (req, res) => {
  try {
    // hardcode rentang tanggal untuk mencocokan data di database
    const startDate = new Date(req.query.start_date);
    const endDate = new Date(req.query.end_date);
    endDate.setHours(23, 59, 59, 999); // pastikan mencakup seluruh hari

    // ambil data penjualan dalam rentang tanggal
    const sales = await prisma.transaction.findMany({
      where: {
        created_at: {
          gte: startDate, // mulai dari startDate
          lte: endDate, // hingga endDate
        },
      },
      include: {
        cashier: {
          select: {
            id: true, // pilih ID kasir
            name: true, // pilih nama kasir
          },
        },
        customer: {
          select: {
            id: true, // pilih ID pelanggan
            name: true, // pilih nama pelanggan
          },
        },
      },
    });

    // hitung total penjualan dalam rentang tanggal
    const total = await prisma.transaction.aggregate({
      _sum: {
        grand_total: true, // hitung jumlah total grand_total
      },
      where: {
        created_at: {
          gte: startDate, // mulai dari startDate
          lte: endDate, // hingga endDate
        },
      },
    });

    // buat workbook
    const workbook = new excelJS.Workbook();

    // buat worksheet
    const worksheet = workbook.addWorksheet("Penjualan");

    // set header styles
    worksheet.columns = [
      { header: "DATE", key: "created_at", width: 25 },
      { header: "INVOICE", key: "invoice", width: 30 },
      { header: "CASHIER", key: "cashier", width: 15 },
      { header: "CUSTOMER", key: "customer", width: 15 },
      { header: "TOTAL", key: "grand_total", width: 15 },
    ];

    // masukkan data ke worksheet
    worksheet.columns.forEach((col) => {
      col.style = {
        font: {
          bold: true,
        },
        alignment: {
          horizontal: "center",
        },
        border: {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        },
      };
    });

    // add sales data to the worksheet
    sales.forEach((sale) => {
      worksheet.addRow({
        created_at: sale.created_at,
        invoice: sale.invoice,
        cashier: sale.cashier.name,
        customer: sale.customer?.name || "Guest",
        grand_total: `Rp ${moneyFormat(sale.grand_total)}`,
      });
    });

    // add total row
    const totalRow = worksheet.addRow({
      created_at: "",
      invoice: "",
      cashier: "",
      customer: "TOTAl",
      grand_total: `Rp ${moneyFormat(total._sum.grand_total)}`,
    });

    // style total row
    totalRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: "right" };
      if (colNumber === 5) {
        cell.alignment = { horizontal: "center" };
      }
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // kirimkan respons
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    workbook.xlsx.write(res);
  } catch (error) {
    // jika terjadi kesalahan, kirimkan respons kesalahan
    res.status(500).send({
      meta: {
        success: false, // status gagal
        message: "Terjadi kesalahan di server", // pesan kesalahan
      },
      data: error,
    });
  }
};

// mengekspor fungsi-fungsi untuk digunakan di file lain
module.exports = {
  filterSales,
  exportSales,
};
