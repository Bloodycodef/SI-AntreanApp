-- CreateTable
CREATE TABLE `RoomFormField` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roomId` INTEGER NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `type` ENUM('text', 'number', 'email', 'phone', 'textarea') NOT NULL,
    `required` BOOLEAN NOT NULL DEFAULT true,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `RoomFormField_roomId_idx`(`roomId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TicketFormAnswer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ticketId` INTEGER NOT NULL,
    `fieldId` INTEGER NOT NULL,
    `value` VARCHAR(191) NOT NULL,

    INDEX `TicketFormAnswer_ticketId_idx`(`ticketId`),
    UNIQUE INDEX `TicketFormAnswer_ticketId_fieldId_key`(`ticketId`, `fieldId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RoomFormField` ADD CONSTRAINT `RoomFormField_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TicketFormAnswer` ADD CONSTRAINT `TicketFormAnswer_ticketId_fkey` FOREIGN KEY (`ticketId`) REFERENCES `QueueTicket`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TicketFormAnswer` ADD CONSTRAINT `TicketFormAnswer_fieldId_fkey` FOREIGN KEY (`fieldId`) REFERENCES `RoomFormField`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
