import fs from 'fs/promises';
import path from 'path';
import { errorResponse, parameterType, promptCollectionType, promptVersionType } from './versionTypes';
import { DBInterface } from './dbInterface';

const defaultDB = 'mockDatabase'

export class DBfilesystem implements DBInterface {
  private db: string;
  private dbParams: string;
  private dbVersions: string;

  constructor() {
    this.db = defaultDB;
    this.dbParams = `${this.db}/params`;
    this.dbVersions = `${this.db}/versions`;
  }

  async getList(): Promise<promptCollectionType[]> {
    try {
      const files = await fs.readdir(this.db);

      const list = await files.reduce(async (accumulatorPromise, file) => {
        const accumulator = await accumulatorPromise;
        const filePath = path.join(this.db, file);
        const stats = await fs.stat(filePath);

        if (stats.isFile()) {
          const content = await fs.readFile(filePath, 'utf-8');
          return [...accumulator, JSON.parse(content)];
        }

        return accumulator;
      }, Promise.resolve([] as promptCollectionType[]));

      return list;
    } catch (err) {
      console.error('Error reading directory in getList:', err);
      return [];
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

  async savePromptVersion(collectionId: string, version: promptVersionType): Promise<any> {
    // connect new version id to collection   
    const filePathCollection = path.join(this.db, `${collectionId}.json`);

    try {
      const existingContent = await fs.readFile(filePathCollection, 'utf-8');
      const content = JSON.parse(existingContent);

      console.log('existing con: ', content)
      content.versions.push(version.id)

      await fs.writeFile(filePathCollection, JSON.stringify(content, null, 2));
    } catch (error) {
      console.error('Error in savePromptVersion in DB - updating new version of prompt collection:', error);
    }

    // save version file
    const filePathVersion = path.join(this.dbVersions, `${version.id}.json`);

    try {
      await fs.writeFile(filePathVersion, JSON.stringify(version, null, 2));
    } catch (error) {
      console.error('Error in savePromptVersion in DB - saving version:', error);
    }



    return collectionId;
  }
 
  async getParametersList() {
    let list: parameterType[] = [];
    try {
      const files = await fs.readdir(this.dbParams);
      list = await Promise.all(files.map(async file => {
        const filePath = path.join(this.dbParams, file);
        const content = await fs.readFile(filePath, 'utf-8')
        return JSON.parse(content);
      }));
    } catch (err) {
      console.error('Error getParameterList in DB', err);
    }
    return list;
  }

  async saveOneParameter(newParameter: parameterType) {
    const id = newParameter.id;
    const filePath = path.join(this.dbParams, `${id}.json`);

    try {
      const jsonData = JSON.stringify(newParameter, null, 2);
      fs.writeFile(filePath, jsonData, 'utf-8');
    } catch (error) {
      console.error('Error saveOneParameter in DB', error);
    }
  }

  async getOneParameter(id: string): Promise<parameterType> {
    console.log('in db get one param: ', id);
    const filePath = path.join(this.dbParams, `${id}.json`);

    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(fileContent);
    } catch (error) {
      throw new Error('Error in getOneParameter in DB')
    }
  }

  /*  async createResult(promptId, resultId) {
 
   } */

  async updateVersion(versionId: string, updatedData: Partial<promptVersionType>): Promise<void> {
    const filePath = path.join(this.db, `${versionId}.json`);

    try {
      const existingContent = await fs.readFile(filePath, 'utf-8');
      const content: promptVersionType = JSON.parse(existingContent);

      const updatedContent: promptVersionType = {
        ...content,
        ...updatedData,
      };

      await fs.writeFile(filePath, JSON.stringify(updatedContent, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error updating prompt version:', error);
      throw error;
    }
  }

}