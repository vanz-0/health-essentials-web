// This script imports products from the CSV file into the catalogue table
// Run this once to populate the database

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const SUPABASE_URL = 'https://syymqotfxkmchtjsmhkr.supabase.co';
const SUPABASE_SERVICE_KEY = 'YOUR_SERVICE_ROLE_KEY_HERE'; // Replace with actual key

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let insideQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    
    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\n' || char === '\r') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      if (currentField || currentRow.length > 0) {
        currentRow.push(currentField.trim());
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
      }
    } else {
      currentField += char;
    }
  }
  
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    rows.push(currentRow);
  }
  
  return rows;
}

async function importProducts() {
  try {
    // Read CSV file
    const csvPath = path.join(__dirname, '../data/products.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    
    console.log('Parsing CSV...');
    const rows = parseCSV(csvContent);
    
    // Skip header and filter empty rows
    const dataRows = rows.slice(1).filter(row => row.length > 1 && row[0]);
    
    console.log(`Found ${dataRows.length} products to import`);
    
    // Prepare products
    const products = dataRows.map((row) => {
      const [productNum, price, name, productType, size, useCase, funFact, productCopy, instructions] = row;
      
      return {
        product_num: productNum || '',
        price: parseFloat(price) || 0,
        name: name || '',
        product_type: productType || null,
        size: size !== 'Not specified.' && size ? size : null,
        use_case: useCase || null,
        fun_fact: funFact || '',
        product_copy: productCopy || null,
        instructions: instructions || null,
      };
    });

    // Insert in batches
    const batchSize = 100;
    let inserted = 0;
    
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('catalogue')
        .insert(batch);
      
      if (error) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
        throw error;
      }
      
      inserted += batch.length;
      console.log(`Inserted ${inserted}/${products.length} products`);
    }

    console.log(`✅ Successfully imported ${inserted} products!`);
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
}

importProducts();
