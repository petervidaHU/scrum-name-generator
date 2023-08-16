import { v4 as uuid } from 'uuid';
import { errorResponse, parameterType, promptCollectionType, promptVersionType } from './versionTypes';
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

  async getParametersList(): Promise<parameterType[]> {
    return await db.getParametersList();
  }

  async saveOneParameter(newParameter: parameterType) {
    try {
      return await db.saveOneParameter(newParameter);
    } catch (error) {
      return {
        error,
        errorMessage: `error in PVersioner / getParameter; id: ${newParameter}`,
      }
    }
  }

  async getParameter(parameterId: string): Promise<parameterType> {
    try {
      return await db.getOneParameter(parameterId);
    } catch (error) {
     throw new Error('error in versioner / getparameter')
    }
  }

  async createConnection(promptId: string): Promise<string> {
    const resultId = uuid();
    db.createResult(promptId, resultId)

    return resultId;
  }

}
