// mengimpor modul multer untuk menangani upload file
const multer = require("multer");
// mengimpor modul path untuk memanipulasi path file
const path = require("path");
// mengimpor modul crypto untuk menghasilkan hash unik
const crypto = require("crypto");

// ekstensi gambar yang diizinkan
const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

// konfigurasi penyimpanan multer
const storage = multer.diskStorage({
  // menentukan direktori tujuan upload
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // mengarahkkan file yang diupload ke direktori "uploads/"
  },
  // menentukan nama file yang disimpan
  filename: (req, file, cb) => {
    // menghasilkan hash unik untuk nama file
    const fileHash = crypto.randomBytes(16).toString("hex");
    // mengambil ekstensi file dari nama file asli
    const ext = path.extname(file.originalname).toLowerCase();
    // menyusun nama file baru dengan hash dan ekstensi
    cb(null, `${fileHash}${ext}`);
  },
});

// filter file multer
const fileFilter = (req, file, cb) => {
  // mengambil ekstensi file dari nama file asli
  const ext = path.extname(file.originalname).toLowerCase();
  // memeriksa apakah ekstensi file termasuk dalam daftar ekstensi yang diizinkan
  if (allowedExtensions.includes(ext)) {
    cb(null, true); // jika ekstensi diizinkan, lanjutkan dengan upload
  } else {
    // jika ekstensi tidak diizinkan, batalkan upload dan kirimkan pesan error
    cb(new Error("Ekstensi gambar tidak diizinkan"), false);
  }
};

// konfigurasi upload multer
const upload = multer({
  storage: storage, // menggunakan konfigurasi penyimpanan yang telah ditentukan
  fileFilter: fileFilter, // menggunakan filter file yang telah ditentukan
  limits: { fileSize: 5 * 1024 * 1024 }, // membatasi ukuran file maksimum hingga (5MB)
});

// mengekspor konfigurasi upload agar dapat digunakan di tempat lain
module.exports = upload;
