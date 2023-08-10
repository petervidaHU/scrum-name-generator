import { v4 as uuid } from 'uuid';
import { parameterType, promptCollectionType, promptVersionType } from './versionTypes';
import { DBfilesystem } from './DB';
import { DBInterface } from './dbInterface';

const db: DBInterface = new DBfilesystem();

export class PVersion {
  private db;
  constructor() {
    this.db = db;
   }

  async getList(): Promise<promptCollectionType[]> {
    const result = await this.db.getList();
    return result;
  }

  async getOnePromptCollection(id: string): Promise<promptCollectionType | {}> {
    const result = await this.db.getOnePromptCollection(id);
    return result;
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

  // parameters -- rather in a standalone class?

  async getParametersList(): Promise<parameterType[]>{
    return await db.getParametersList();
  }

  async saveOneParameter(newParameter: parameterType) {
    return await db.saveOneParameter(newParameter);
  }

}
