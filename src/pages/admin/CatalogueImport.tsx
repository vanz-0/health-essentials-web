import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function CatalogueImport() {
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({ total: 0, success: 0, failed: 0 });

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"' && (i === 0 || line[i - 1] !== '\\')) {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    
    return result.map(field => field.replace(/^"|"$/g, '').trim());
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setProgress(0);
    setStats({ total: 0, success: 0, failed: 0 });

    try {
      const text = await file.text();
      const lines = text.split('\n');
      
      // Skip header and filter empty lines
      const dataLines = lines.slice(1).filter(line => line.trim());
      
      console.log(`Processing ${dataLines.length} products...`);
      setStats(prev => ({ ...prev, total: dataLines.length }));

      const products = [];
      let currentLine = '';
      let inQuotedField = false;

      for (let i = 0; i < dataLines.length; i++) {
        const line = dataLines[i];
        
        // Check if we're in a multi-line quoted field
        const quoteCount = (line.match(/"/g) || []).length;
        if (quoteCount % 2 !== 0) {
          inQuotedField = !inQuotedField;
        }

        currentLine += (currentLine ? '\n' : '') + line;

        // If we're not in a quoted field, we have a complete row
        if (!inQuotedField) {
          const fields = parseCSVLine(currentLine);
          
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
          
          currentLine = '';
        }
      }

      console.log(`Parsed ${products.length} valid products`);

      // Insert in batches of 50
      const batchSize = 50;
      let successCount = 0;
      let failedCount = 0;

      for (let i = 0; i < products.length; i += batchSize) {
        const batch = products.slice(i, i + batchSize);
        
        try {
          const { error } = await supabase
            .from('catalogue')
            .insert(batch);
          
          if (error) throw error;
          
          successCount += batch.length;
        } catch (error) {
          console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
          failedCount += batch.length;
        }

        setProgress(Math.round(((i + batch.length) / products.length) * 100));
        setStats({ 
          total: products.length, 
          success: successCount, 
          failed: failedCount 
        });
      }

      if (failedCount === 0) {
        toast.success(`Successfully imported ${successCount} products!`);
      } else {
        toast.warning(`Imported ${successCount} products, ${failedCount} failed.`);
      }

    } catch (error) {
      console.error('Import failed:', error);
      toast.error('Failed to import products. Check console for details.');
    } finally {
      setImporting(false);
      event.target.value = ''; // Reset file input
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Catalogue Import</CardTitle>
            <CardDescription>
              Upload a CSV file to bulk import products into the catalogue
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={importing}
                className="hidden"
                id="csv-upload"
              />
              <label 
                htmlFor="csv-upload"
                className="cursor-pointer flex flex-col items-center gap-4"
              >
                <Upload className="h-12 w-12 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {importing ? 'Importing...' : 'Click to upload CSV file'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    CSV format: Product Num, Price, Product Name, Product Type, Size, Use case, Fun fact, Product Copy, Instructions
                  </p>
                </div>
              </label>
            </div>

            {importing && (
              <div className="space-y-4">
                <Progress value={progress} className="w-full" />
                <div className="flex items-center justify-between text-sm">
                  <span>Progress: {progress}%</span>
                  <span>{stats.success} / {stats.total} products</span>
                </div>
              </div>
            )}

            {stats.total > 0 && !importing && (
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
                <div className="p-4 bg-green-500/10 rounded-lg">
                  <div className="flex items-center justify-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-2xl font-bold text-green-500">{stats.success}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Success</div>
                </div>
                <div className="p-4 bg-red-500/10 rounded-lg">
                  <div className="flex items-center justify-center gap-1">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-2xl font-bold text-red-500">{stats.failed}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Failed</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
