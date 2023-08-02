import fs from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { promptType } from './versionTypes';

const defaultDB = 'mockDatabase'

export class PVersion {
  private version: string | null = null;
  private result: string | null = null;
  private db: string;

  constructor() {
    this.db = defaultDB;
  }

  getPromptVersions(p: promptType): string | null {
    return this.version;
  }

  getPrompt(version: number): any {

    return
  }

  createNewPrompt(newText: string): promptType {
    const newID = uuid();

    const newData = {
      [newID]: {
        pText: newText,
        v: 1,
        created: new Date(),
      }
    }
    this.saveDataToFile(newData)

    return newData;

  }

  savePrompt(newText: string, id: string): number {
    return 1;
  }


  private saveDataToFile(d: promptType): void {
    const id = Object.keys(d)[0];
    const filePath = path.join(this.db, `${id}.json`);
    const directoryPath = path.dirname(filePath);

    let existingData: promptType = {};

    if (fs.existsSync(filePath)) {
      try {
        const existingDataContent = fs.readFileSync(filePath, 'utf-8');
        existingData = JSON.parse(existingDataContent);
        console.log('existing data: ',existingData)
      } catch (error) {
        console.error('Error reading existing data:', error);
        return;
      }
    }

    const mergedData = { ...existingData, ...d };

    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    try {
      const jsonData = JSON.stringify(mergedData, null, 2);
      fs.writeFileSync(filePath, jsonData, 'utf-8');
    } catch (error) {
      console.error('Error saving data to file:', error);
    }
  }

}
