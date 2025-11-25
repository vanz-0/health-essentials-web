import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple CSV parser that handles quoted fields with line breaks
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
        // Escaped quote
        currentField += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      // End of field
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\n' || char === '\r') && !insideQuotes) {
      // End of row
      if (char === '\r' && nextChar === '\n') {
        i++; // Skip \n in \r\n
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
  
  // Add last field and row
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    rows.push(currentRow);
  }
  
  return rows;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    );

    const { csvContent } = await req.json();
    
    if (!csvContent) {
      throw new Error('CSV content is required');
    }

    // Parse CSV
    const rows = parseCSV(csvContent);
    
    // Skip header row and filter out empty rows
    const dataRows = rows.slice(1).filter(row => row.length > 1 && row[0]);
    
    console.log(`Parsed ${dataRows.length} products from CSV`);
    
    // Prepare products for insertion
    const products = dataRows.map((row) => {
      const [productNum, price, name, productType, size, useCase, funFact, productCopy, instructions] = row;
      
      return {
        product_num: productNum || '',
        price: parseFloat(price) || 0,
        name: name || '',
        product_type: productType || null,
        size: size !== 'Not specified.' ? size : null,
        use_case: useCase || null,
        fun_fact: funFact || '',
        product_copy: productCopy || null,
        instructions: instructions || null,
      };
    });

    // Insert in batches of 100
    const batchSize = 100;
    let inserted = 0;
    
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      
      const { error } = await supabaseClient
        .from('catalogue')
        .insert(batch);
      
      if (error) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
        throw error;
      }
      
      inserted += batch.length;
      console.log(`Inserted ${inserted}/${products.length} products`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully imported ${inserted} products`,
        totalProducts: products.length,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});
