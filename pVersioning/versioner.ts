import { v4 as uuid } from 'uuid';
import { ParameterType, PromptCollectionType, PromptVersionType, ResultCollectionType, ResultObject } from './versionTypes';
import { DBfilesystem } from './DB';
import { DBInterface } from './dbInterface';

const db: DBInterface = new DBfilesystem();

export class PVersion {
  private db;
  constructor() {
    this.db = db;
  }

  async getList(): Promise<PromptCollectionType[]> {
    const result = await this.db.getList();
    return result;
  }


  async getVersions(versionIds: string[]): Promise<PromptVersionType[]> {
    const result = await this.db.getVersions(versionIds);
    return result;
  }

  async getOnePromptCollection(id: string): Promise<PromptCollectionType | {}> {
    const result = await this.db.getOnePromptCollection(id);
    return result;
  }

  initializePromp(name: string, description: string, defaultParametersId: string): string {
    const id = uuid();
    const newPromptCollection = {
      id,
      name,
      description,
      created: new Date(),
      versions: [],
      defaultParametersId,
    }

    this.db.initializePrompt(newPromptCollection)
    return id;
  }

  async savePromptVersion(collectionId: string, newPrompt: PromptVersionType) {
    const result = await this.db.savePromptVersion(collectionId, newPrompt)
    return result;
  }

  async getParametersList(): Promise<ParameterType[]> {
    return await db.getParametersList();
  }

  async saveOneParameter(newParameter: ParameterType) {
    try {
      return await db.saveOneParameter(newParameter);
    } catch (error) {
      return {
        error,
        errorMessage: `error in PVersioner / getParameter; id: ${newParameter}`,
      }
    }
  }

  async getParameter(parameterId: string): Promise<ParameterType> {
    try {
      return await db.getOneParameter(parameterId);
    } catch (error) {
      throw new Error('error in versioner / getparameter')
    }
  }

  async initializeResultCollection(promptId: string, paramId: string, resultId: string): Promise<string> {

    // hash new id from parameters?
    // hash from request string?
    const content: ResultCollectionType = {
      promptId,
      results: {
        [paramId]: [resultId],
      }
    };
    await db.initializeResultCollection(promptId, content)

    return resultId;
  }

  async createNewResult(promptId: string, paramId: string): Promise<string> {
    const collectionExist: boolean = await db.getResultCollection(promptId);
    const resultId = uuid();

    if (collectionExist) {
      db.createResult(promptId, paramId, resultId)
    } else {
      await this.initializeResultCollection(promptId, paramId, resultId)
    }
    return resultId;
  }

  async saveResult(resultObject: ResultObject) {
    db.saveResult(resultObject);
  }
}
