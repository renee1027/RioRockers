-- Insert new location
INSERT INTO `locations` (`id`, `name`, `address`, `createdAt`, `updatedAt`, `lat`, `lng`) VALUES (2, 'Pasing Arcaden', 'Pasinger Bahnhofspl. 5, 81241 München', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '48.1483003', '11.4616646');

-- Insert new ramp
INSERT INTO `ramps` (`id`, `occupiedSince`, `timesBooked`, `createdAt`, `updatedAt`, `rampNumber`, `locationId`, `lat`, `lng`, `totalHoursBooked`) VALUES (NULL, NULL, '0', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '2', '1', '48.133579', '11.542819', '0');