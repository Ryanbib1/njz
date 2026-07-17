SET FOREIGN_KEY_CHECKS=0;
-- CreateTable
CREATE TABLE `food_order` (
    `id` VARCHAR(36) NOT NULL,
    `orderNumber` VARCHAR(50) NOT NULL,
    `fulfillmentMethod` VARCHAR(30) NOT NULL,
    `pickupContactName` VARCHAR(120) NOT NULL,
    `pickupPhone` VARCHAR(50) NOT NULL,
    `customerEmail` VARCHAR(150) NOT NULL,
    `subtotalAmount` DECIMAL(10, 2) NOT NULL,
    `totalAmount` DECIMAL(10, 2) NOT NULL,
    `currency` VARCHAR(10) NOT NULL DEFAULT 'CNY',
    `paymentProvider` ENUM('CLINK') NOT NULL,
    `paymentSessionId` VARCHAR(120) NULL,
    `paymentOutTradeNo` VARCHAR(120) NULL,
    `paymentStatus` ENUM('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `orderStatus` ENUM('PENDING_PAYMENT', 'PAID', 'PREPARING', 'READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING_PAYMENT',
    `paidAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `food_order_orderNumber_key`(`orderNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `food_order_item` (
    `id` VARCHAR(36) NOT NULL,
    `orderId` VARCHAR(36) NOT NULL,
    `itemName` VARCHAR(255) NOT NULL,
    `unitPrice` DECIMAL(10, 2) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `lineTotal` DECIMAL(10, 2) NOT NULL,
    `notes` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `food_order_item_orderId_idx`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `food_order_item` ADD CONSTRAINT `food_order_item_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `food_order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
SET FOREIGN_KEY_CHECKS=1;