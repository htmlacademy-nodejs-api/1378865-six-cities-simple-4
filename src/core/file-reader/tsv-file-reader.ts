import EventEmitter from 'node:events';
import { createReadStream } from 'node:fs';
import { FileReaderInterface } from './file-reader.interface.js';
import { CHUNK_SIZE } from '../../constants/index.js';

const FIRST_ARRAY_ELEMENT = 0;
const LINE_POSITION_STEP = 1;

export default class TSVFileReader extends EventEmitter implements FileReaderInterface {
  constructor(public filename: string) {
    super();
  }

  public async read(): Promise<void> {
    const stream = createReadStream(this.filename, {
      highWaterMark: CHUNK_SIZE,
      encoding: 'utf-8',
    });

    let remainingData = '';
    let nextLinePosition = -1;
    let importedRowCount = 0;

    for await (const chunk of stream) {
      remainingData += chunk.toString();

      while ((nextLinePosition = remainingData.indexOf('\n')) >= FIRST_ARRAY_ELEMENT) {
        const completeRow = remainingData.slice(FIRST_ARRAY_ELEMENT, nextLinePosition + LINE_POSITION_STEP);
        remainingData = remainingData.slice(++nextLinePosition);
        importedRowCount++;

        await new Promise((resolve) => {
          this.emit('line', completeRow, resolve);
        });
      }
    }

    this.emit('end', importedRowCount);
  }
}
