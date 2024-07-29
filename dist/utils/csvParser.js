"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCSV = parseCSV;
const csv_parse_1 = require("csv-parse");
function parseCSV(fileContent) {
    return new Promise((resolve, reject) => {
        const options = {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        };
        (0, csv_parse_1.parse)(fileContent, options, (err, records) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(records.map(record => ({
                    ...record,
                    quantity: parseInt(record.quantity, 10),
                    description: record.description || null
                })));
            }
        });
    });
}
