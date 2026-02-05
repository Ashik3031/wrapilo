export interface ShopifyProduct {
    name: string;
    slug: string;
    description: string;
    price: number;
    compareAtPrice?: number;
    category: string;
    tags: string[];
    inventory: number;
    images: string[];
    seo: {
        title: string;
        description: string;
    };
    status: 'active' | 'draft' | 'archived';
}

export function parseShopifyCSV(csvText: string): ShopifyProduct[] {
    const lines = csvText.split(/\r?\n/);
    if (lines.length < 2) return [];

    const headers = parseCSVLine(lines[0]);
    const productsMap = new Map<string, ShopifyProduct>();

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const row = parseCSVLine(lines[i]);
        const data: Record<string, string> = {};
        headers.forEach((header, index) => {
            data[header] = row[index] || '';
        });

        const handle = data['Handle'];
        if (!handle) continue;

        if (productsMap.has(handle)) {
            // Update existing product (add images or variants)
            const product = productsMap.get(handle)!;
            const imageSrc = data['Image Src'];
            if (imageSrc && !product.images.includes(imageSrc)) {
                product.images.push(imageSrc);
            }
            // In a real Shopify CSV, variants might have different prices/inventory.
            // For now, we'll just take the first one or update if needed.
        } else {
            // Create new product
            const product: ShopifyProduct = {
                name: data['Title'] || handle || 'Untitled Product',
                slug: handle,
                description: data['Body (HTML)'] || data['Title'] || handle || 'No description provided.',
                price: parseFloat(data['Variant Price']) || 0,
                compareAtPrice: data['Variant Compare At Price'] ? parseFloat(data['Variant Compare At Price']) : undefined,
                category: data['Custom Product Type'] || data['Standard Product Type'] || 'Uncategorized',
                tags: data['Tags'] ? data['Tags'].split(',').map(t => t.trim()).filter(t => t !== '') : [],
                inventory: parseInt(data['Variant Inventory Qty']) || 0,
                images: data['Image Src'] ? [data['Image Src']] : [],
                seo: {
                    title: data['SEO Title'] || '',
                    description: data['SEO Description'] || ''
                },
                status: data['Published']?.toLowerCase() === 'true' ? 'active' : 'draft'
            };
            productsMap.set(handle, product);
        }
    }

    return Array.from(productsMap.values());
}

function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                cur += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(cur);
            cur = '';
        } else {
            cur += char;
        }
    }
    result.push(cur);
    return result.map(s => s.trim());
}
