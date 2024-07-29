import { parse, Options } from 'csv-parse';

export interface InventoryRow {
    quantity: number;
    sku: string;
    description: string | null;
    store: string;
}

export function parseCSV(fileContent: Buffer): Promise<InventoryRow[]> {
    return new Promise((resolve, reject) => {
        // Preliminary check for valid CSV structure
        const contentString = fileContent.toString().trim();
        if (!contentString || !contentString.includes(',')) {
            reject(new Error('Invalid CSV data structure'));
            return;
        }

        const options: Options = {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        };

        parse(fileContent, options, (err, records: any[]) => {
            if (err) {
                reject(new Error('Invalid CSV data structure'));
            } else if (records.length === 0) {
                reject(new Error('CSV file is empty or contains no valid data'));
            } else {
                try {
                    const validatedRecords = records.map(validateAndTransformRecord);
                    if (validatedRecords.length === 0) {
                        reject(new Error('No valid records found in CSV'));
                    } else {
                        resolve(validatedRecords);
                    }
                } catch (error) {
                    reject(error);
                }
            }
        });
    });
}

function validateAndTransformRecord(record: any): InventoryRow {
    if (!record.quantity || !record.sku || !record.store) {
        throw new Error('Invalid CSV data structure: missing required fields');
    }

    const quantity = parseInt(record.quantity, 10);
    if (isNaN(quantity)) {
        throw new Error('Invalid CSV data structure: quantity must be a number');
    }

    return {
        quantity: quantity,
        sku: record.sku,
        description: record.description || null,
        store: record.store
    };
}