import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as readline from 'readline';
import * as parser from 'csv-parse';
import { IRetiros, retirosNames } from './input/csv.interface';
import { Mutex } from 'async-mutex';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private readonly mutex = new Mutex();
  private readonly getCsvPathOriginal = './public/data/retirossOriginal.tsv';
  private readonly getCsvPath = './public/data/retiross1.csv';

  constructor() {}

  public async getCsvData(
    page: number = 1,
    chunkSize: number = 100,
  ): Promise<any> {
    const release = await this.mutex.acquire();

    try {
      const csvFilePath = this.getCsvPath;
      const startLine = (page - 1) * chunkSize + 2;
      const endLine = startLine + chunkSize - 1;

      this.logger.debug('Converting csv...');
      const csvData = await this.readCsvFile(csvFilePath, startLine, endLine);

      this.logger.debug('Sending data...');
      return {
        total: csvData.length,
        data: csvData,
      };
    } catch (error) {
      this.logger.error(`Error fetching CSV data: ${error.message}`);
      throw error;
    } finally {
      release();
    }
  }

  private async readCsvFile(
    filePath: string,
    startLine: number,
    endLine: number,
  ): Promise<any[]> {
    const data: any[] = [];
    const columnNames = retirosNames;

    let currentLine = 1;

    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      if (currentLine >= startLine && currentLine <= endLine) {
        const rowData = line.split('\t');
        const rowObject: any = {};
        columnNames.forEach((columnName, index) => {
          const value = rowData[index]?.trim().replace(/"/g, '');
          if (value !== '') {
            rowObject[columnName] = value;
          }
        });
        data.push(rowObject);
      }
      if (currentLine > endLine) {
        break;
      }
      currentLine++;
    }

    return data;
  }

  public async orderCsv() {
    const csvFilePath = this.getCsvPathOriginal;
    const data = [];

    this.logger.debug('Reading csv...');
    fs.createReadStream(csvFilePath)
      .pipe(parser.parse({ delimiter: '\t', columns: true }))
      .on('data', (chunk: IRetiros) => {
        data.push({ ...chunk });
      })
      .on('end', () => {
        this.logger.debug('Sorting data...');
        data.sort(
          (a, b) =>
            new Date(b.C4C_CREATIONDATETIME).getTime() -
            new Date(a.C4C_CREATIONDATETIME).getTime(),
        );

        const columnHeaders = Object.keys(data[0]);
        const csvData = [columnHeaders.join('\t')];
        data.forEach((row) => {
          const rowValues = columnHeaders.map((key) => row[key]);
          csvData.push(rowValues.join('\t'));
        });
        const csvString = csvData.join('\n');

        fs.writeFileSync(this.getCsvPath, csvString);

        this.logger.log('CSV Order by creation datetime.');
      })
      .on('error', (error) => {
        this.logger.error('Error while processing CSV:', error);
      });
  }

  public async getCsvMap(
    page: number = 1,
    chunkSize: number = 100,
  ): Promise<{ total: number; data: IRetiros[] }> {
    const release = await this.mutex.acquire();

    try {
      const csvFilePath = this.getCsvPath;
      const startLine = (page - 1) * chunkSize + 2;
      const endLine = startLine + chunkSize - 1;

      this.logger.debug('Converting csv...');
      const csvData = await this.readCsvMap(csvFilePath, startLine, endLine);

      this.logger.debug('Sending data...');
      return {
        total: csvData.size,
        data: Array.from(csvData.values()),
      };
    } catch (error) {
      this.logger.error(`Error fetching CSV data: ${error.message}`);
      throw error;
    } finally {
      release();
    }
  }

  private async readCsvMap(
    filePath: string,
    startLine: number,
    endLine: number,
  ): Promise<Map<number, any>> {
    const data: Map<number, any> = new Map();
    const columnNames = retirosNames;

    let currentLine = 1;

    const fileStream = fs.createReadStream(filePath, { encoding: 'utf-8' });
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      if (currentLine >= startLine && currentLine <= endLine) {
        const rowData = line
          .split('\t')
          .map((value) => value.trim().replace(/"/g, ''));
        const rowObject = <IRetiros>{};
        columnNames.forEach(
          (columnName, index) => (rowObject[columnName] = rowData[index]),
        );
        if (Object.keys(rowObject).length > 0) {
          data.set(currentLine, rowObject);
        }
      }
      if (currentLine >= endLine) {
        break;
      }
      currentLine++;
    }

    return data;
  }
}
