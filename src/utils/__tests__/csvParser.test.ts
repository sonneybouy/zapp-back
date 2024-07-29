import { parseCSV, InventoryRow } from '../csvParser';



describe('CSV Parser', () => {
    it('should correctly parse valid CSV data', async () => {
        const csvData = Buffer.from(
            'quantity,sku,description,store\n' +
            '10,SKU001,Item 1,Store A\n' +
            '20,SKU002,Item 2,Store B'
        );

        const expected: InventoryRow[] = [
            { quantity: 10, sku: 'SKU001', description: 'Item 1', store: 'Store A' },
            { quantity: 20, sku: 'SKU002', description: 'Item 2', store: 'Store B' }
        ];

        const result = await parseCSV(csvData);
        expect(result).toEqual(expected);
    });

    it('should handle empty description fields', async () => {
        const csvData = Buffer.from(
            'quantity,sku,description,store\n' +
            '10,SKU001,,Store A'
        );

        const expected: InventoryRow[] = [
            { quantity: 10, sku: 'SKU001', description: null, store: 'Store A' }
        ];

        const result = await parseCSV(csvData);
        expect(result).toEqual(expected);
    });

    it('should throw an error for CSV with missing required columns', async () => {
        const csvData = Buffer.from('quantity,sku\n10,SKU001');
        await expect(parseCSV(csvData)).rejects.toThrow('Invalid CSV data structure');
    });

    it('should throw an error for CSV with incorrect data types', async () => {
        const csvData = Buffer.from('quantity,sku,description,store\nnotanumber,SKU001,Item 1,Store A');
        await expect(parseCSV(csvData)).rejects.toThrow('Invalid CSV data structure: quantity must be a number');
    });
});