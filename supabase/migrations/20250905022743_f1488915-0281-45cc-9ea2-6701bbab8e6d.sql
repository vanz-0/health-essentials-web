-- Insert feature flag for Bit 3 - Shopping Cart
INSERT INTO feature_flags (key, description, enabled, rollout, payload) 
VALUES (
  'bit_3_cart', 
  'Enable shopping cart functionality with add to cart, quantity management, and cart drawer',
  false,
  100,
  '{
    "features": {
      "add_to_cart": true,
      "quantity_controls": true,
      "cart_drawer": true,
      "inventory_alerts": true,
      "quick_add": true
    },
    "limits": {
      "max_cart_items": 50,
      "max_quantity_per_item": 10
    }
  }'::jsonb
)
ON CONFLICT (key) DO UPDATE SET
  description = EXCLUDED.description,
  payload = EXCLUDED.payload;