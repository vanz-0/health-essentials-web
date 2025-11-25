import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const SUPABASE_URL = "https://syymqotfxkmchtjsmhkr.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface CSVRow {
  'Product Num': string;
  'Price': string;
  'Product Name': string;
  'Product Type': string;
  'Size': string;
  'Use case': string;
  'Attatchment funfact': string;
  'Attatchment Copy': string;
  'Attatchment Instructions': string;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  
  return result.map(field => field.replace(/^"|"$/g, ''));
}

async function importProducts() {
  try {
    console.log('Reading CSV file...');
    const csvPath = path.join(__dirname, '../data/products.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    console.log(`Found ${lines.length - 1} products to import`);
    
    // Skip header
    const products = [];
    
    for (let i = 1; i < lines.length; i++) {
      const fields = parseCSVLine(lines[i]);
      
      if (fields.length >= 9 && fields[0]) {
        const product = {
          product_num: fields[0],
          price: parseFloat(fields[1]) || 0,
          name: fields[2] || 'Unnamed Product',
          product_type: fields[3] || null,
          size: fields[4] || null,
          use_case: fields[5] || null,
          fun_fact: fields[6] || null,
          product_copy: fields[7] || null,
          instructions: fields[8] || null,
        };
        
        products.push(product);
      }
    }
    
    console.log(`Parsed ${products.length} valid products`);
    
    // Insert in batches of 100
    const batchSize = 100;
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      console.log(`Inserting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(products.length / batchSize)}...`);
      
      const { error } = await supabase
        .from('catalogue')
        .insert(batch);
      
      if (error) {
        console.error(`Error inserting batch at index ${i}:`, error);
        throw error;
      }
    }
    
    console.log('✅ All products imported successfully!');
    
    // Verify count
    const { count } = await supabase
      .from('catalogue')
      .select('*', { count: 'exact', head: true });
    
    console.log(`Total products in database: ${count}`);
    
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
}

importProducts();
