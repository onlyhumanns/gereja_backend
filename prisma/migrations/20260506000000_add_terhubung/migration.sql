-- Drop lama: hapus tabel jemaat dan kepala_keluarga
DROP TABLE IF EXISTS `jemaat`;
DROP TABLE IF EXISTS `kepala_keluarga`;

-- Buat tabel terhubung
CREATE TABLE `terhubung` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `namaLengkap` VARCHAR(191) NOT NULL,
    `nomorHp` VARCHAR(191) NOT NULL,
    `alamat` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `jenisPelayanan` VARCHAR(191) NOT NULL,
    `keterangan` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
