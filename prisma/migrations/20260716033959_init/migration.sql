SET FOREIGN_KEY_CHECKS=0;
-- CreateTable
CREATE TABLE `member` (
    `id` VARCHAR(36) NOT NULL,
    `account` VARCHAR(50) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `role` ENUM('GUEST', 'ADMIN') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `member_account_key`(`account`),
    UNIQUE INDEX `member_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `restaurant` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `address` TEXT NOT NULL,
    `phone` VARCHAR(50) NOT NULL,
    `website` VARCHAR(700) NOT NULL,
    `rating` DECIMAL(2, 1) NOT NULL,
    `reviewCount` INTEGER NOT NULL,
    `brandStory` TEXT NOT NULL,
    `highlights` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `restaurantphoto` (
    `id` VARCHAR(36) NOT NULL,
    `restaurantId` VARCHAR(36) NOT NULL,
    `photoKey` VARCHAR(50) NOT NULL,
    `sortOrder` INTEGER NOT NULL,
    `alt` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `imageUrl` VARCHAR(700) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `restaurantphoto_photoKey_key`(`photoKey`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `restaurantreview` (
    `id` VARCHAR(36) NOT NULL,
    `restaurantId` VARCHAR(36) NOT NULL,
    `reviewSlot` INTEGER NOT NULL,
    `authorName` VARCHAR(255) NOT NULL,
    `rating` INTEGER NOT NULL,
    `relativeTime` VARCHAR(100) NOT NULL,
    `content` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `restaurantreview_reviewSlot_key`(`reviewSlot`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `restauranthour` (
    `id` VARCHAR(36) NOT NULL,
    `restaurantId` VARCHAR(36) NOT NULL,
    `weekday` ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY') NOT NULL,
    `sortOrder` INTEGER NOT NULL,
    `fullLine` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `restauranthour_weekday_key`(`weekday`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `restaurantphoto` ADD CONSTRAINT `restaurantphoto_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `restaurant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `restaurantreview` ADD CONSTRAINT `restaurantreview_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `restaurant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `restauranthour` ADD CONSTRAINT `restauranthour_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `restaurant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
SET FOREIGN_KEY_CHECKS=1;