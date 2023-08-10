import fs from 'fs/promises';
import path from 'path';
import { promptCollectionType, promptVersionType } from './versionTypes';

const defaultDB = 'mockDatabase'

export class DB {
  private db: string;

  constructor() {
    this.db = defaultDB;
  }

  async getList() {
    let list;
    try {
      const files = await fs.readdir(this.db);
      list = await Promise.all(files.map(async file => {
        const filePath = path.join(this.db, file);
        const content = await fs.readFile(filePath, 'utf-8')
        return JSON.parse(content);
      }));
      return list;
    } catch (err) {
      console.error('Error reading directory:', err);
    }
  }

  async getOnePromptCollection(id: string) {
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

  initializePrompt(p: promptCollectionType): void {
    const id = p.id;
    const filePath = path.join(this.db, `${id}.json`);

    try {
      const jsonData = JSON.stringify(p, null, 2);
      fs.writeFile(filePath, jsonData, 'utf-8');
    } catch (error) {
      console.error('Error saving init. prompt collection:', error);
    }
  }

  async savePromptVersion(collectionId: string, p: promptVersionType): Promise<any> {
    const filePath = path.join(this.db, `${collectionId}.json`);

    try {
      const existingContent = await fs.readFile(filePath, 'utf-8');
      const content = JSON.parse(existingContent);

      console.log('existing con: ', content)
      content.versions.push(p)

      await fs.writeFile(filePath, JSON.stringify(content, null, 2));
    } catch (error) {
      console.error('Error saving prompt version:', error);
    }

    return collectionId;
  }

}