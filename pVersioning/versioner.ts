import { v4 as uuid } from 'uuid';
import { promptCollectionType, promptVersionType } from './versionTypes';
import { DB } from './DB';
import { parseJsonText } from 'typescript';

const db = new DB();

export class PVersion {
  private db;
  constructor() {
    this.db = db;
   }

  async getList(): Promise<any> {
    const getListFromDB = await this.db.getList();
    return getListFromDB;
  }

  async getOnePromptCollection(id: string): Promise<promptCollectionType | {}> {
    const res = await this.db.getOnePromptCollection(id);
    return res;
  }

  initializePromp(name: string, description: string): string {
    const id = uuid();
    const newPromptCollection = {
      id,
      name,
      description,
      created: new Date(),
      versions: [],
    }

    this.db.initializePrompt(newPromptCollection)

    return id;
  }
  
  async savePromptVersion(collectionId: string, newPrompt: promptVersionType) {
    const result = await this.db.savePromptVersion(collectionId, newPrompt)
    return result;
  }

}
