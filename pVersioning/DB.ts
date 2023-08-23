import fs from 'fs/promises';
import path from 'path';
import { ParameterType, PromptCollectionType, PromptVersionType, ResultObject } from './versionTypes';
import { DBInterface } from './dbInterface';

const defaultDB = 'mockDatabase';

const wFile = async (path: string, content: unknown) => {
  fs.writeFile(path, JSON.stringify(content, null, 2), 'utf-8');
}

const rFile = async (filePath: string) => {
  // const res = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(await fs.readFile(filePath, 'utf-8'));
}

export class DBfilesystem implements DBInterface {
  private db: string;
  private dbPrompts: string;
  private dbParams: string;
  private dbVersions: string;
  private dbResults: string;
  private dbResultCollections: string;

  constructor() {
    this.db = defaultDB;
    this.dbPrompts = `${this.db}/prompts`;
    this.dbParams = `${this.db}/params`;
    this.dbVersions = `${this.db}/versions`;
    this.dbResults = `${this.db}/results`;
    this.dbResultCollections = `${this.db}/result-collections`;
  }

  async getList(): Promise<PromptCollectionType[]> {
    try {
      const files = await fs.readdir(this.dbPrompts);

      const list = await files.reduce(async (accumulatorPromise, file) => {
        const accumulator = await accumulatorPromise;
        const filePath = path.join(this.dbPrompts, file);
        const stats = await fs.stat(filePath);

        if (stats.isFile()) {
          const content = await fs.readFile(filePath, 'utf-8');
          return [...accumulator, JSON.parse(content)];
        }

        return accumulator;
      }, Promise.resolve([] as PromptCollectionType[]));

      return list;
    } catch (err) {
      console.error('Error getList in DB', err);
      return [];
    }
  }

  async getOnePromptCollection(id: string) {
    const filePath = path.join(this.dbPrompts, `${id}.json`);
    let content = {};
    try {
      const res = await fs.readFile(filePath, 'utf-8');
      content = JSON.parse(res);
    } catch (error) {
      console.error('Error getOnePromptCollection in DB', error);
    }
    return content;

  }

  initializePrompt(promptCollectionObject: PromptCollectionType): void {
    const id = promptCollectionObject.id;
    const filePath = path.join(this.dbPrompts, `${id}.json`);

    try {
      const jsonData = JSON.stringify(promptCollectionObject, null, 2);
      fs.writeFile(filePath, jsonData, 'utf-8');
    } catch (error) {
      console.error('Error in initializePrompt in DB', error);
    }
  }

  async savePromptVersion(collectionId: string, version: PromptVersionType): Promise<any> {
    // connect new version id to collection   
    const filePathCollection = path.join(this.dbPrompts, `${collectionId}.json`);

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

  async getVersions(ids: string[]): Promise<PromptVersionType[]> {
    let list: PromptVersionType[] = [];
    try {
      list = await Promise.all(ids.map(async file => {
        const filePath = path.join(this.dbVersions, `${file}.json`);
        const content = await fs.readFile(filePath, 'utf-8')
        return JSON.parse(content);
      }));
    } catch (err) {
      console.error('Error getParameterList in DB', err);
    }
    return list;
  }

  async getParametersList() {
    let list: ParameterType[] = [];
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

  async saveOneParameter(newParameter: ParameterType) {
    const { id } = newParameter;
    const filePath = path.join(this.dbParams, `${id}.json`);

    try {
      const jsonData = JSON.stringify(newParameter, null, 2);
      fs.writeFile(filePath, jsonData, 'utf-8');
    } catch (error) {
      console.error('Error saveOneParameter in DB', error);
    }
  }

  async getOneParameter(id: string): Promise<ParameterType> {
    const filePath = path.join(this.dbParams, `${id}.json`);

    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(fileContent);
    } catch (error) {
      throw new Error('Error in getOneParameter in DB')
    }
  }

  async initializeResultCollection(requestId: string, content: any) {
    const filePath = path.join(this.dbResultCollections, `${requestId}.json`);

    try {
      const jsonData = JSON.stringify(content, null, 2);
      fs.writeFile(filePath, jsonData, 'utf-8');
    } catch (error) {
      console.error('Error createResult in DB', error);
    }

    return;
  }
  async createResult(collectionId: string, paramId: string, resultId: string): Promise<string> {
    const filePathCollection = path.join(this.dbResultCollections, `${collectionId}.json`);

    try {
      const existingContent = await fs.readFile(filePathCollection, 'utf-8');
      const content = JSON.parse(existingContent);

      if (paramId in content.results) {
        content.results[paramId].push(resultId);
      } else {
        content.results[paramId] = [resultId];
      }

      await fs.writeFile(filePathCollection, JSON.stringify(content, null, 2));
    } catch (error) {
      console.error('Error in createResult in DB - updating new version of result collection:', error);
    }

    return 'result created';
  }

  async saveResult(result: ResultObject) {
    const { resultId, resultObject, evaluatorName } = result;
    const filePath = path.join(this.dbResults, `${resultId}.json`);
    const content = {
      evaluatorName,
      resultObject,
    };

    try {
      const jsonData = JSON.stringify(content, null, 2);
      fs.writeFile(filePath, jsonData, 'utf-8');
    } catch (error) {
      console.error('Error saveResult in DB', error);
    }
  }

  async getResultCollection(promptId: string): Promise<boolean> {
    const filePath = path.join(this.dbResultCollections, `${promptId}.json`);
    try {
      const collectionFound = await fs.readFile(filePath, 'utf-8');
      console.log('collectionFound::', collectionFound);
      return true;
    } catch (error) {
      return false;
    }
  }

  async updateVersion(versionId: string, updatedData: Partial<PromptVersionType>): Promise<void> {
    const filePath = path.join(this.dbVersions, `${versionId}.json`);

    try {
      const existingContent = await fs.readFile(filePath, 'utf-8');
      const content: PromptVersionType = JSON.parse(existingContent);

      const updatedContent: PromptVersionType = {
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