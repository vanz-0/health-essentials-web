-- Update best_sellers_config with actual product numbers from Catalogue1
UPDATE best_sellers_config SET product_num = '165.png' WHERE display_order = 1;
UPDATE best_sellers_config SET product_num = '182.png' WHERE display_order = 2;
UPDATE best_sellers_config SET product_num = '219.png' WHERE display_order = 3;
UPDATE best_sellers_config SET product_num = '134.png' WHERE display_order = 4;

-- Add more best sellers with actual product numbers
INSERT INTO best_sellers_config (product_num, display_order, notes, active)
VALUES 
  ('77.png', 5, 'Popular product', true),
  ('81.png', 6, 'Top seller', true),
  ('119.png', 7, 'Customer favorite', true),
  ('139.png', 8, 'Best value', true)
ON CONFLICT DO NOTHING;