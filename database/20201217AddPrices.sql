-- ID's change between dev and prod. So, updating by code.. Had to run
-- set SQL_SAFE_UPDATES = 0
UPDATE `bookkit_dev`.`inventoryitem` SET `cost` = '40' WHERE (`code` = 'gen');
UPDATE `bookkit_dev`.`inventoryitem` SET `cost` = '25' WHERE (`code` = 'exo');
UPDATE `bookkit_dev`.`inventoryitem` SET `cost` = '30' WHERE (`code` = 'lev');
UPDATE `bookkit_dev`.`inventoryitem` SET `cost` = '25' WHERE (`code` = 'num');
UPDATE `bookkit_dev`.`inventoryitem` SET `cost` = '25' WHERE (`code` = 'deut');
UPDATE `bookkit_dev`.`inventoryitem` SET `cost` = '15' WHERE (`code` = 'josh');
UPDATE `bookkit_dev`.`inventoryitem` SET `cost` = '0' WHERE (`code` = 'jdg');
