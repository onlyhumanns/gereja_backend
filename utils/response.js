// src/utils/response.js
// Helper untuk membuat format response API yang konsisten

const responseHelper = {
  // Response sukses
  success(res, data, message = 'Berhasil', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  },

  // Response sukses tanpa data (misal: delete)
  successMessage(res, message = 'Berhasil', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
    });
  },

  // Response error
  error(res, message = 'Terjadi kesalahan', statusCode = 400) {
    return res.status(statusCode).json({
      success: false,
      message,
    });
  },

  // Response validasi gagal
  validationError(res, errors) {
    return res.status(422).json({
      success: false,
      message: 'Validasi gagal',
      errors,
    });
  },
};

module.exports = responseHelper;
