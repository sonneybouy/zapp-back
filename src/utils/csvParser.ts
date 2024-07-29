import { parse, Options } from 'csv-parse';

export interface InventoryRow {
    quantity: number;
    sku: string;
    description: string | null;
    store: string;
}

export function parseCSV(fileContent: Buffer): Promise<InventoryRow[]> {
    return new Promise((resolve, reject) => {
        const options: Options = {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        };

        parse(fileContent, options, (err, records: InventoryRow[]) => {
            if (err) {
                reject(err);
            } else {
                resolve(records.map(record => ({
                    ...record,
                    quantity: parseInt(record.quantity as unknown as string, 10),
                    description: record.description || null
                })));
            }
        });
    });
}