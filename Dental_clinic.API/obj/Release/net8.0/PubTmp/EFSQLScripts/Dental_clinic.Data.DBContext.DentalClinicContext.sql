CREATE TABLE IF NOT EXISTS `__EFMigrationsHistory` (
    `MigrationId` varchar(150) NOT NULL,
    `ProductVersion` varchar(32) NOT NULL,
    PRIMARY KEY (`MigrationId`)
);

START TRANSACTION;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20240516134040_init')
BEGIN
    CREATE TABLE `User` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `FirstName` longtext NOT NULL,
        `LastName` longtext NOT NULL,
        `Email` longtext NOT NULL,
        `Password` longtext NOT NULL,
        `Role` int NOT NULL,
        PRIMARY KEY (`Id`)
    );
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20240516134040_init')
BEGIN
    INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
    VALUES ('20240516134040_init', '8.0.5');
END;

COMMIT;

