// import express untuk membuat server
const express = require("express");

// import prisma client untuk berinteraksi dengan database
const prisma = require("../prisma/client");

// import exceljs
const excelJS = require("exceljs");

// import moneyFormat
const { moneyFormat } = require("../utils/moneyFormat");

// fungsi untuk memfilter data profit berdasarkan rentang tanggal
const filterProfit = async (req, res) => {
  try {
    // menetepkan rentang tanggal berdasarkan parameter query dari request
    const startDate = new Date(req.query.start_date);
    const endDate = new Date(req.query.end_date);
    endDate.setHours(23, 59, 59, 999); // mengatur endDate agar mencakup seluruh hari

    // mengambil data profit dalam rentang tanggal yang ditentukan
    const profits = await prisma.profit.findMany({
      where: {
        created_at: {
          gte: startDate, // mengambil data yang dibuat setelah atau pada startDate
          lte: endDate, // mengambil data yang dibuat sebelum atau pada endDate
        },
      },
      include: {
        transaction: {
          select: {
            id: true,
            invoice: true,
            grand_total: true,
            created_at: true,
          },
        },
      },
    });

    // menghitung total profit dalam rentang tanggal yang ditentukan
    const total = await prisma.profit.aggregate({
      _sum: {
        total: true, // menghitung jumlah total profit
      },
      where: {
        created_at: {
          gte: startDate, // mengambil data yang dibuat setelah atau pada startDate
          lte: endDate, // mengambil data yang dibuat sebelum atau pada endDate
        },
      },
    });

    // mengirim respons dengan status 200 (OK)
    res.status(200).send({
      meta: {
        success: true,
        message: `Data profit dari ${req.query.start_date} sampai ${req.query.end_date} berhasil diambil`,
      },
      data: {
        profits: profits, // data profit yang diambil
        total: total._sum.total || 0, // total profit atau 0 jika tidak ada
      },
    });
  } catch (error) {
    // mengirim respons dengan status 500 (Internal Server Error) jika terjadi kesalahan
    res.status(500).send({
      meta: {
        success: false,
        message: "Terjadi kesalahan di server",
      },
      data: error, // mengirimkan detail kesalahan
    });
  }
};

// fungsi untuk mengexport data profit dalam bentuk excel
const exportProfit = async (req, res) => {
  try {
    // menetapkan rentang tanggal berdasarkan parameter query dari request
    const startDate = new Date(req.query.start_date);
    const endDate = new Date(req.query.end_date);
    endDate.setHours(23, 59, 59, 999); // mengatur endDate agar mencakup seluruh hari

    // mengambil data profit dalam rentang tanggal yang ditentukan
    const profits = await prisma.profit.findMany({
      where: {
        created_at: {
          gte: startDate, // mengambil data yang dibuat setelah atau pada startDate
          lte: endDate, // mengambil data yang dibuat sebelum atau pada endDate
        },
      },
      include: {
        transaction: {
          select: {
            id: true,
            invoice: true,
          },
        },
      },
    });

    // menghitung total profit dalam rentang tanggal yang ditentukan
    const total = await prisma.profit.aggregate({
      _sum: {
        total: true, // menghitung jumlah total profit
      },
      where: {
        created_at: {
          gte: startDate, // mengambil data yang dibuat setelah atau pada startDate
          lte: endDate, // mengambil data yang dibuat sebelum atau pada endDate
        },
      },
    });

    // membuat workbook excel
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Profits");

    // menambahkan judul kolom
    worksheet.columns = [
      { header: "DATE", key: "created_at", width: 10 },
      { header: "INVOICE", key: "invoice", width: 20 },
      { header: "TOTAL", key: "total", width: 20 },
    ];

    worksheet.columns.forEach((col) => {
      col.style = {
        font: { bold: true },
        alignment: { horizontal: "center" },
        border: {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        },
      };
    });

    // menambahkan data worksheet
    worksheet.forEach((profit) => {
      worksheet.addRow({
        created_at: profit.created_at,
        invoice: profit.invoice,
        total: moneyFormat(profit.total),
      });
    });

    // add total row
    const totalRow = worksheet.addRow({
      created_at: "",
      invoice: "TOTAL",
      total: `Rp ${moneyFormat(total._sum.total)}`,
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

    // kirim respons
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    workbook.xlsx.write(res);
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

// mengekspor fungsi-fungsi untuk digunakan di file lain
module.exports = {
  filterProfit,
  exportProfit,
};
