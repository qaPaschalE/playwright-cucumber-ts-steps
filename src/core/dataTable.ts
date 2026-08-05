export class DataTable {
  public rawTable: string[][];

  constructor(rawTable: string[][]) {
    this.rawTable = rawTable;
  }

  /**
   * Converts the data table into an array of objects.
   * The first row is treated as the headers.
   * @returns An array of objects mapped from the table.
   */
  hashes(): Record<string, string>[] {
    if (!this.rawTable || this.rawTable.length < 2) return [];

    const headers = this.rawTable[0];
    const rows = this.rawTable.slice(1);

    return rows.map(row => {
      const obj: Record<string, string> = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || "";
      });
      return obj;
    });
  }

  /**
   * Converts a 2-column data table into a single object (key-value pairs).
   * @returns An object where the first column is the key and the second is the value.
   */
  rowsHash(): Record<string, string> {
    if (!this.rawTable) return {};

    const obj: Record<string, string> = {};
    for (const row of this.rawTable) {
      if (row.length >= 2) {
        obj[row[0]] = row[1];
      }
    }
    return obj;
  }
}
