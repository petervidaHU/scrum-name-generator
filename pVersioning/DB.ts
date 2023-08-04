import fs from 'fs/promises';
import path from 'path';
import { promptType } from './versionTypes';

const defaultDB = 'mockDatabase'

export class DB {
  private db: string;

  constructor() {
    this.db = defaultDB;
  }

  async getList() {
    let f;
    try {
      const files = await fs.readdir(this.db);
      f = files.map(file => path.parse(file).name)
    } catch (err) {
      console.error('Error reading directory:', err);
    }
    return f;
  }

  async getOnePrompt(id: string) {
    const filePath = path.join(this.db, `${id}.json`);
    let content = {};
    try {
      const res = await fs.readFile(filePath, 'utf-8');
      content = JSON.parse(res);
    } catch (error) {
      console.error('Error reading file:', error);
    }
    return content;

  }

  initializePrompt(p: any): void {
    const id = p.id;

    const filePath = path.join(this.db, `${id}.json`);
    const directoryPath = path.dirname(filePath);

    try {
      const jsonData = JSON.stringify(p, null, 2);
      fs.writeFile(filePath, jsonData, 'utf-8');
    } catch (error) {
      console.error('Error saving data to file:', error);
    }
  }

  async saveDataToFile(d: promptType): Promise<any> {
    const id = Object.keys(d)[0];
    const filePath = path.join(this.db, `${id}.json`);
    const directoryPath = path.dirname(filePath);
    /* 
        let existingData: promptType = {};
    
        if (await fs.access(filePath)) {
          try {
            const existingDataContent = await fs.readFile(filePath, 'utf-8');
            existingData = JSON.parse(existingDataContent);
            console.log('existing data: ', existingData)
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
        } */
  }

}