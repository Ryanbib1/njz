-- Database snapshot: PROJ_43bb5105_snap_20260716_073319_373
-- Created at: 2026-07-16 09:06:22.574995
-- Include structure: True
-- Include data: True

SET FOREIGN_KEY_CHECKS = 0;

-- Table structure for `_prisma_migrations`
DROP TABLE IF EXISTS `_prisma_migrations`;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `_prisma_migrations`
INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('1b6ea31d-4dec-46a9-b7bf-7ce40057ce01', 'a0fc8e8ae3f971ef7623dcfc3736eccc80f1db642d004ff9b9dddb7b6e8b499a', '2026-07-16 03:40:01', '20260716033959_init', '', NULL, '2026-07-16 03:40:01', 0),
('8df98dda-1294-42c7-b5f2-ef6c9ad9d9f0', '2261a65154d44df9f02c9cb6ae169136f0aeb7e8137151bbf6b7cbb36d9a04e4', '2026-07-16 06:16:07', 'agent_update_1784182565334633300_afd6aa67', '', NULL, '2026-07-16 06:16:07', 0);

-- Table structure for `food_order`
DROP TABLE IF EXISTS `food_order`;
CREATE TABLE `food_order` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `orderNumber` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fulfillmentMethod` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pickupContactName` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pickupPhone` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customerEmail` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtotalAmount` decimal(10,2) NOT NULL,
  `totalAmount` decimal(10,2) NOT NULL,
  `currency` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CNY',
  `paymentProvider` enum('CLINK') COLLATE utf8mb4_unicode_ci NOT NULL,
  `paymentSessionId` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paymentOutTradeNo` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paymentStatus` enum('PENDING','SUCCESS','FAILED','CANCELLED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `orderStatus` enum('PENDING_PAYMENT','PAID','PREPARING','READY_FOR_PICKUP','COMPLETED','CANCELLED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING_PAYMENT',
  `paidAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `food_order_orderNumber_key` (`orderNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `food_order`
INSERT INTO `food_order` (`id`, `orderNumber`, `fulfillmentMethod`, `pickupContactName`, `pickupPhone`, `customerEmail`, `subtotalAmount`, `totalAmount`, `currency`, `paymentProvider`, `paymentSessionId`, `paymentOutTradeNo`, `paymentStatus`, `orderStatus`, `paidAt`, `createdAt`, `updatedAt`) VALUES
('38500e5c-80de-11f1-83b6-02cf0dd0fdc5', 'FO-20260716-1001', 'PICKUP', 'Lin Xiaoyu', '+86 139 1188 2601', 'lin.xiaoyu@example.com', '118.00', '118.00', 'CNY', 'CLINK', 'demo-session-fo-20260716-1001', 'demo-outtrade-fo-20260716-1001', 'PENDING', 'PENDING_PAYMENT', NULL, '2026-07-16 06:18:54', '2026-07-16 07:52:48'),
('3850135b-80de-11f1-83b6-02cf0dd0fdc5', 'FO-20260716-1002', 'PICKUP', 'Marcus Chen', '+86 138 2004 7712', 'marcus.chen@example.com', '176.00', '176.00', 'CNY', 'CLINK', 'fake-session', NULL, 'PENDING', 'PENDING_PAYMENT', NULL, '2026-07-16 02:18:54', '2026-07-16 07:47:53'),
('5db1a40d-5e72-4692-9466-289154d814d8', 'FO-20260716-064717-2DNC', 'PICKUP', 'Test Pickup Customer', '+86 139 0000 1234', 'pickup.test@example.com', '120.00', '120.00', 'CNY', 'CLINK', 'clink_1784184437712_h9maf9z', NULL, 'PENDING', 'PENDING_PAYMENT', NULL, '2026-07-16 06:47:17', '2026-07-16 06:59:57'),
('87ac61d4-62d7-4340-a65b-6182059113a8', 'FO-20260716-073920-JBQC', 'PICKUP', 'Alex Carter', '13800138000', 'alex.carter@example.com', '94.00', '94.00', 'CNY', 'CLINK', 'sess_fs9grko5rnn9373', 'CLINK_1784187560216_586', 'PENDING', 'PENDING_PAYMENT', NULL, '2026-07-16 07:39:20', '2026-07-16 07:50:53'),
('a64a617e-dc18-49e5-8852-6ee9c189332c', 'FO-20260716-074714-SE8K', 'PICKUP', 'Test User', '13800138000', 'test@example.com', '72.00', '72.00', 'CNY', 'CLINK', 'sess_fs9hgyq9nk5c192', 'CLINK_1784188034821_980', 'PENDING', 'PENDING_PAYMENT', NULL, '2026-07-16 07:47:14', '2026-07-16 07:47:15');

-- Table structure for `food_order_item`
DROP TABLE IF EXISTS `food_order_item`;
CREATE TABLE `food_order_item` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `orderId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `itemName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `unitPrice` decimal(10,2) NOT NULL,
  `quantity` int NOT NULL,
  `lineTotal` decimal(10,2) NOT NULL,
  `notes` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `food_order_item_orderId_idx` (`orderId`),
  CONSTRAINT `food_order_item_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `food_order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `food_order_item`
INSERT INTO `food_order_item` (`id`, `orderId`, `itemName`, `unitPrice`, `quantity`, `lineTotal`, `notes`, `createdAt`, `updatedAt`) VALUES
('3850237b-80de-11f1-83b6-02cf0dd0fdc5', '38500e5c-80de-11f1-83b6-02cf0dd0fdc5', 'Truffle Mushroom Arancini', '46.00', 1, '46.00', 'Extra parmesan on the side', '2026-07-16 06:18:54', '2026-07-16 06:18:54'),
('385025df-80de-11f1-83b6-02cf0dd0fdc5', '38500e5c-80de-11f1-83b6-02cf0dd0fdc5', 'Wood-Fired Burrata Pizza', '72.00', 1, '72.00', 'Slice before pickup', '2026-07-16 06:18:54', '2026-07-16 06:18:54'),
('38502767-80de-11f1-83b6-02cf0dd0fdc5', '3850135b-80de-11f1-83b6-02cf0dd0fdc5', 'Tagliatelle al Ragù', '88.00', 2, '176.00', 'No parsley garnish', '2026-07-16 02:18:54', '2026-07-16 03:18:54'),
('3e41c7a3-6dfa-4e4d-9290-be4007cfc892', '87ac61d4-62d7-4340-a65b-6182059113a8', 'Sparkling Citrus Juice', '24.00', 2, '48.00', NULL, '2026-07-16 07:39:20', '2026-07-16 07:39:20'),
('4e0aaca8-2417-45e5-9aa2-7eaca91b8fa4', '5db1a40d-5e72-4692-9466-289154d814d8', 'Wood-Fired Burrata Pizza', '72.00', 1, '72.00', NULL, '2026-07-16 06:47:17', '2026-07-16 06:47:17'),
('68279725-b2a7-4d8e-8e30-0e908b987638', '5db1a40d-5e72-4692-9466-289154d814d8', 'Sparkling Citrus Juice', '24.00', 2, '48.00', NULL, '2026-07-16 06:47:17', '2026-07-16 06:47:17'),
('ba949f6e-c0dd-407f-91a4-f59114db105a', 'a64a617e-dc18-49e5-8852-6ee9c189332c', 'Wood-Fired Burrata Pizza', '72.00', 1, '72.00', NULL, '2026-07-16 07:47:14', '2026-07-16 07:47:14'),
('c75f96b6-9ffa-4231-9603-d1516d0a556c', '87ac61d4-62d7-4340-a65b-6182059113a8', 'Truffle Mushroom Arancini', '46.00', 1, '46.00', NULL, '2026-07-16 07:39:20', '2026-07-16 07:39:20');

-- Table structure for `member`
DROP TABLE IF EXISTS `member`;
CREATE TABLE `member` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `account` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('GUEST','ADMIN') COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `member_account_key` (`account`),
  UNIQUE KEY `member_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `member`
INSERT INTO `member` (`id`, `account`, `password`, `email`, `role`, `createdAt`, `updatedAt`) VALUES
('2b62598a-3715-4610-806a-9dd5028aa37c', 'jason_bourne', '790f48e3ba51e2d0762e7d4a74d4076a62cfb34d44e3dfbc43798fe9ff399602', 'jbourne@tavola.com', 'ADMIN', '2026-04-07 03:41:57', '2026-07-14 03:41:57'),
('6055e916-3384-456c-8844-24f5470a5d8c', 'emily_davis', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'emily.davis@example.com', 'GUEST', '2026-05-17 03:41:57', '2026-06-06 03:41:57'),
('a2babacc-dbd7-4f5b-93b0-f5b7ce848ef3', 'john_smith', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'john.smith@example.com', 'GUEST', '2026-06-01 03:41:57', '2026-07-06 03:41:57'),
('d50eba84-25c0-4c13-a830-d27599458a42', 'sarah_connor', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 's.connor@domain.net', 'GUEST', '2026-06-26 03:41:57', '2026-06-28 03:41:57'),
('e94fbdc7-c02b-4534-809c-5981d431a308', 'michael.brown', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'michael.brown@testmail.com', 'GUEST', '2026-07-01 03:41:57', '2026-07-11 03:41:57');

-- Table structure for `restaurant`
DROP TABLE IF EXISTS `restaurant`;
CREATE TABLE `restaurant` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `website` varchar(700) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` decimal(2,1) NOT NULL,
  `reviewCount` int NOT NULL,
  `brandStory` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `highlights` json NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `restaurant`
INSERT INTO `restaurant` (`id`, `name`, `address`, `phone`, `website`, `rating`, `reviewCount`, `brandStory`, `highlights`, `createdAt`, `updatedAt`) VALUES
('8cb4d996-14e9-4386-9aa6-b569699c5a38', 'Tavola Italian Dining', 'China, Bei Jing Shi, Chao Yang Qu, Dong Fang Dong Lu, 19号亮马桥外交公寓B区会所2层 邮政编码: 100028', '010 8532 5068', 'https://ditu.amap.com/search?query=Tavola+Italian+Dining+亮马桥', '4.6', 59, 'A refined destination for authentic Italian cuisine in Beijing. Experience our sunlit dining room, outstanding wood-fired pizza, affordable prefix lunch menus, and beautifully curated courses crafted with classic rustic passion.', '["Wood-Fired Pizza", "Affordable Prefix Lunch", "Premium Wine Pairing", "Authentic Italian Cuisine"]', '2026-03-18 03:41:58', '2026-07-01 03:41:58');

-- Table structure for `restauranthour`
DROP TABLE IF EXISTS `restauranthour`;
CREATE TABLE `restauranthour` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `restaurantId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `weekday` enum('MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY') COLLATE utf8mb4_unicode_ci NOT NULL,
  `sortOrder` int NOT NULL,
  `fullLine` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `restauranthour_weekday_key` (`weekday`),
  KEY `restauranthour_restaurantId_fkey` (`restaurantId`),
  CONSTRAINT `restauranthour_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `restaurant` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `restauranthour`
INSERT INTO `restauranthour` (`id`, `restaurantId`, `weekday`, `sortOrder`, `fullLine`, `createdAt`, `updatedAt`) VALUES
('1e79d3fa-c8f9-4886-aaec-616839cdb205', '8cb4d996-14e9-4386-9aa6-b569699c5a38', 'TUESDAY', 2, 'Monday – Sunday: 10:00 AM – 10:30 PM', '2026-03-18 03:41:58', '2026-07-01 03:41:58'),
('3b99f29b-7ac5-4168-9208-04884e60fdfd', '8cb4d996-14e9-4386-9aa6-b569699c5a38', 'SATURDAY', 6, 'Monday – Sunday: 10:00 AM – 10:30 PM', '2026-03-18 03:41:58', '2026-07-01 03:41:58'),
('492bf417-47d4-4f55-ba98-00ca554a59a0', '8cb4d996-14e9-4386-9aa6-b569699c5a38', 'WEDNESDAY', 3, 'Monday – Sunday: 10:00 AM – 10:30 PM', '2026-03-18 03:41:58', '2026-07-01 03:41:58'),
('520a2191-ac3f-430c-b755-617989a091a2', '8cb4d996-14e9-4386-9aa6-b569699c5a38', 'FRIDAY', 5, 'Monday – Sunday: 10:00 AM – 10:30 PM', '2026-03-18 03:41:58', '2026-07-01 03:41:58'),
('6bd7c869-11fa-434f-ad67-9a33bb8dc49b', '8cb4d996-14e9-4386-9aa6-b569699c5a38', 'SUNDAY', 7, 'Monday – Sunday: 10:00 AM – 10:30 PM', '2026-03-18 03:41:58', '2026-07-01 03:41:58'),
('6ca094ad-14b5-42cd-92e9-68d0210a1bbe', '8cb4d996-14e9-4386-9aa6-b569699c5a38', 'THURSDAY', 4, 'Monday – Sunday: 10:00 AM – 10:30 PM', '2026-03-18 03:41:58', '2026-07-01 03:41:58'),
('d81132e8-2ba6-48d5-b841-5abe8d453562', '8cb4d996-14e9-4386-9aa6-b569699c5a38', 'MONDAY', 1, 'Monday – Sunday: 10:00 AM – 10:30 PM', '2026-03-18 03:41:58', '2026-07-01 03:41:58');

-- Table structure for `restaurantphoto`
DROP TABLE IF EXISTS `restaurantphoto`;
CREATE TABLE `restaurantphoto` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `restaurantId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `photoKey` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sortOrder` int NOT NULL,
  `alt` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `imageUrl` varchar(700) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `restaurantphoto_photoKey_key` (`photoKey`),
  KEY `restaurantphoto_restaurantId_fkey` (`restaurantId`),
  CONSTRAINT `restaurantphoto_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `restaurant` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `restaurantphoto`
INSERT INTO `restaurantphoto` (`id`, `restaurantId`, `photoKey`, `sortOrder`, `alt`, `description`, `imageUrl`, `createdAt`, `updatedAt`) VALUES
('06ccafd2-15bd-4aa6-abb9-e4076817767d', '8cb4d996-14e9-4386-9aa6-b569699c5a38', 'img-05', 5, 'Decadent layered chocolate and strawberry dessert styled meticulously', 'Plated', 'https://lh3.googleusercontent.com/place-photos/AG9NLjCrPM3APOmGVFjMTVCICocp0yOLJS0q1u0PmtN1zuxvOD13McEAopO42v3smayZxxudt7UNPGyoxYAbe6TZN-s6zIgGUlqJFh6kxuL-cp44X-SG072lyDQiyskHccdWw2dyUQIxH0i379-lMVGow4Ly6w=s4800-w1200', '2025-12-08 03:41:58', '2026-07-01 03:41:58'),
('216ddf70-0300-44d6-953c-66679de25f5b', '8cb4d996-14e9-4386-9aa6-b569699c5a38', 'img-01', 1, 'Shelves lined with genuine Italian imports overlooking lively tables', 'Ambiance', 'https://lh3.googleusercontent.com/place-photos/AG9NLjCxrZAxgMRhWpFCtLWVnYeySHkHDhMqQ9BjKsTG5QUTjRZnGOVH4Y63b2GXD1MR12IsUgsm3YbYdDoVVz52REe-0lxp5_TzfS3bQRIE0Q0zmPqAlBfMcbwvgWtL1ROOsBFKIAHJSaIBOpxmdg=s4800-w1200', '2025-09-19 03:41:58', '2026-07-01 03:41:58'),
('8b755b43-d930-4729-9e94-b20f3e7a9748', '8cb4d996-14e9-4386-9aa6-b569699c5a38', 'img-04', 4, 'Artisanal red candles melted into sculptural wax forms at our wooden bar', 'Detail', 'https://lh3.googleusercontent.com/place-photos/AG9NLjD--K4TP4ekNIF8n8VvwKY1Wcg8tpiMi_5ZZCumM5MitZWGLjMUf0m6VPDR59wc11oNtQRZ6XvaHRdKgBh92QXkKt3EAZz_hEvmP2ibrMY-odZLnqk3CJlgrdLCFgS9nxSygYILn6NxpHWn_bkQxf4l=s4800-w1200', '2025-11-18 03:41:58', '2026-07-01 03:41:58'),
('9c484f3e-eeab-4e4f-a93a-7a1a359cc921', '8cb4d996-14e9-4386-9aa6-b569699c5a38', 'img-10', 10, 'Seared sliced ribeye served on hot stone with roasted garden garlic', 'Signature', 'https://lh3.googleusercontent.com/place-photos/AG9NLjB8zLMayaytBoDRhonrWGKP3TUr177b4OaR7Z079eN-GjgnLMralg-noF4WutM_l25YPJI4Ob8RYSthNhbWTwA1WqSYVDvSt2lEZdRS50CfdUiRvTntRv4sPAKFw4HbjVZv4N-ITtRz4h3nLg=s4800-w1200', '2026-03-18 03:41:58', '2026-07-01 03:41:58'),
('a283a67e-f528-45f1-95ce-10f3f055c074', '8cb4d996-14e9-4386-9aa6-b569699c5a38', 'img-09', 9, 'Linen tablecloths set elegant stages beneath romantic, warm candlelight', 'Ambiance', 'https://lh3.googleusercontent.com/place-photos/AG9NLjB1sO0efGOAOY2l2KPuu3Wxt8PUlNLbkp-uQFVnI9iidiz6RtV-vFNH0C-lCds0qZRmazRM9Dfn1dPlSMMJsx2rgyk1RclNCYg5THhqzLQWM7Pgf4KBuyNfV68rSdBFVPJuWT86aCOcZlELERk=s4800-w1200', '2026-02-26 03:41:58', '2026-07-01 03:41:58'),
('a86ed92e-c3d9-4f63-baf1-13329884a89c', '8cb4d996-14e9-4386-9aa6-b569699c5a38', 'img-06', 6, 'Artfully drizzled beef carpaccio with micro-greens and signature purées', 'Plated', 'https://lh3.googleusercontent.com/place-photos/AG9NLjBsQXrr_2ibwjCByIgEZniIV2dpirE_G9okvzVckTccPQYXyPIuBeRYcON9O8-PpwnEiZJIofynTQDU5H-uElPUAlSsk1rUD5wdM9IKHNR4OBcTr8vKEYxYbLgDN4WxtSRyO4yu9XcWfEZg3A=s4800-w1200', '2025-12-28 03:41:58', '2026-07-01 03:41:58'),
('ba1150c0-9fe0-42e4-8023-b46f97011034', '8cb4d996-14e9-4386-9aa6-b569699c5a38', 'img-02', 2, 'Delicately plated appetizer of fresh, vibrant heirloom vegetables', 'Plated', 'https://lh3.googleusercontent.com/place-photos/AG9NLjDI-klgjpWDjIUPgOD9vfUdYJgIJbZYraztXkLaWEhuXLV0yu34mFnzASNbXHC2bUFKajFvXS-zlWlj7IjXXDd0YJlGQWgoGzpdFf2p9qjfT4X2l8WM1hFbZ_HkyMPIWb-fruy_aeEQ2BRW-8DPVSys=s4800-w1200', '2025-10-09 03:41:58', '2026-07-01 03:41:58'),
('c5feb5c5-efbc-48b9-aa01-eb7b00d586b1', '8cb4d996-14e9-4386-9aa6-b569699c5a38', 'img-07', 7, 'Prime pan-roasted medallions served with crisp seasonal broccolini', 'Signature', 'https://lh3.googleusercontent.com/place-photos/AG9NLjCo8Ulsm5rTM7Y_s0T7VIdtq1bHSP2elBRTWqKOLiYVCHf1Hjqs-gBouM6e0LoE5pggXm747qlOfRGp4nMUxhRp4BiE8TlzUrmPHTeeqoU6CJj6tVqWrl8bPar3fi-GYKJml2erk-dUYguFRg=s4800-w1200', '2026-01-17 03:41:58', '2026-07-01 03:41:58'),
('d4ad64da-fa03-40e0-8a3d-261ba681cf01', '8cb4d996-14e9-4386-9aa6-b569699c5a38', 'img-08', 8, 'Sunlit dining pavilion framed in warm walnut tones and autumnal flora', 'Ambiance', 'https://lh3.googleusercontent.com/place-photos/AG9NLjDVEyeuSfZ31zI012CF0pBfw7awf8USHJIIX01d4gBUBYVmlSAGdbtA6bD--MsCfWMQYtroHhlloe5zATTXotF0kF696NSPrc9C1bQ_PvDzfT23AVKV6DixVeM3JeMF_JKfc9hlhwjp2nj2RQ=s4800-w1200', '2026-02-06 03:41:58', '2026-07-01 03:41:58'),
('ef28790b-e129-46d9-948a-c5e5b958a6c7', '8cb4d996-14e9-4386-9aa6-b569699c5a38', 'img-03', 3, 'Neapolitan-style pizza blistered to perfection with rich toppings', 'Signature', 'https://lh3.googleusercontent.com/place-photos/AG9NLjDxGoYvPxmlnwfXlJjbj7DLQJ-oE_mpzBfDsTVLlsLwon2MOcbzNn0wCCpSuOUy8UbHH-KUxaJhHDwD7wRarpMrpd-WqdKhxs4iE7puZwdDnxyr7l7_QenGWE9xLqAFhAORHURfXKH1PY3-H6nT69cFEw=s4800-w1200', '2025-10-29 03:41:58', '2026-07-01 03:41:58');

-- Table structure for `restaurantreview`
DROP TABLE IF EXISTS `restaurantreview`;
CREATE TABLE `restaurantreview` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `restaurantId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reviewSlot` int NOT NULL,
  `authorName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` int NOT NULL,
  `relativeTime` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `restaurantreview_reviewSlot_key` (`reviewSlot`),
  KEY `restaurantreview_restaurantId_fkey` (`restaurantId`),
  CONSTRAINT `restaurantreview_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `restaurant` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `restaurantreview`
INSERT INTO `restaurantreview` (`id`, `restaurantId`, `reviewSlot`, `authorName`, `rating`, `relativeTime`, `content`, `createdAt`, `updatedAt`) VALUES
('4ee51eac-86d9-44b0-a2d7-decdf598bb41', '8cb4d996-14e9-4386-9aa6-b569699c5a38', 1, 'Kae Anchalee', 5, 'Recent', 'On this trip to Beijing, I changed from Chinese food to Western food. This is probably the best Italian restaurant in Beijing. I highly recommend it.', '2026-07-14 03:41:58', '2026-07-15 03:41:58'),
('5c235480-685b-4675-85d3-bbb311da9115', '8cb4d996-14e9-4386-9aa6-b569699c5a38', 4, 'Lydia ZHU', 5, 'Recent', 'Favorite Italian restaurant in town with the best pizza of Beijing!! Perfect for a date night or a family dinner!', '2026-06-26 03:41:58', '2026-06-27 03:41:58'),
('72735ff6-c276-4927-ac24-0f42c87858bd', '8cb4d996-14e9-4386-9aa6-b569699c5a38', 2, 'Neville Panter', 5, 'Recent', 'Im from north America and everything was really good.  If you want a change of pace from chinese food this place is really classy!', '2026-07-11 03:41:58', '2026-07-12 03:41:58'),
('77849d3d-62d7-4168-b16a-775d12388ae8', '8cb4d996-14e9-4386-9aa6-b569699c5a38', 3, 'SAM DC', 5, 'Recent', 'a great place to have lunch!! they a prefix lunch menu that’s very affordable. you can choose just two courses or go with three course. and u can choose appetizer and main course or appetizer main course and dessert! the courses are just the right size but i would say two courses is plenty of food.   they also have a sparkling juice that is very nice!', '2026-07-04 03:41:58', '2026-07-05 03:41:58'),
('be0d3edb-c802-4a83-8482-b7ad19ababcd', '8cb4d996-14e9-4386-9aa6-b569699c5a38', 5, 'Robert Baertschi', 5, 'Recent', 'Absolutely amazing food, service and presentation of the food. Cozzy place.', '2026-06-21 03:41:58', '2026-06-22 03:41:58');

SET FOREIGN_KEY_CHECKS = 1;
