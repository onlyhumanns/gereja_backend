-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'MAJELIS') NOT NULL DEFAULT 'MAJELIS',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kepala_keluarga` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomorKK` VARCHAR(191) NOT NULL,
    `alamat` VARCHAR(191) NOT NULL,
    `rt` VARCHAR(191) NULL,
    `rw` VARCHAR(191) NULL,
    `kelurahan` VARCHAR(191) NULL,
    `kecamatan` VARCHAR(191) NULL,
    `kota` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `kepala_keluarga_nomorKK_key`(`nomorKK`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jemaat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomorJemaat` VARCHAR(191) NOT NULL,
    `namaLengkap` VARCHAR(191) NOT NULL,
    `tempatLahir` VARCHAR(191) NOT NULL,
    `tanggalLahir` DATETIME(3) NOT NULL,
    `jenisKelamin` ENUM('LAKI_LAKI', 'PEREMPUAN') NOT NULL,
    `statusPernikahan` ENUM('BELUM_MENIKAH', 'MENIKAH', 'CERAI', 'JANDA', 'DUDA') NOT NULL DEFAULT 'BELUM_MENIKAH',
    `pekerjaan` VARCHAR(191) NULL,
    `pendidikan` ENUM('SD', 'SMP', 'SMA', 'D3', 'S1', 'S2', 'S3') NULL,
    `nomorTelepon` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `statusJemaat` ENUM('AKTIF', 'TIDAK_AKTIF', 'PINDAH', 'MENINGGAL') NOT NULL DEFAULT 'AKTIF',
    `tanggalBaptis` DATETIME(3) NULL,
    `tanggalSidi` DATETIME(3) NULL,
    `keterangan` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `kkId` INTEGER NULL,

    UNIQUE INDEX `jemaat_nomorJemaat_key`(`nomorJemaat`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jadwal_ibadah` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `namaIbadah` VARCHAR(191) NOT NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `waktuMulai` VARCHAR(191) NOT NULL,
    `waktuSelesai` VARCHAR(191) NOT NULL,
    `lokasi` VARCHAR(191) NOT NULL,
    `tema` VARCHAR(191) NULL,
    `pengkhotbah` VARCHAR(191) NULL,
    `liturgos` VARCHAR(191) NULL,
    `pemainMusik` VARCHAR(191) NULL,
    `keterangan` VARCHAR(191) NULL,
    `status` ENUM('TERJADWAL', 'BERLANGSUNG', 'SELESAI', 'DIBATALKAN') NOT NULL DEFAULT 'TERJADWAL',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `jemaat` ADD CONSTRAINT `jemaat_kkId_fkey` FOREIGN KEY (`kkId`) REFERENCES `kepala_keluarga`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
