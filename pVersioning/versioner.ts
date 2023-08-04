import { v4 as uuid } from 'uuid';
import { promptType } from './versionTypes';
import { DB } from './DB';

const db = new DB();


export class PVersion {
  constructor() { }

  async getList(): Promise<any> {
    const getListFromDB = await db.getList();
    return getListFromDB;

  }

  async getOnePromp(id: string): Promise<promptType> {
    const res = await db.getOnePrompt(id);
    return res;
  }

  initializePromp(name: string, description: string): string {
    const id = uuid();
    const newPrompt = {
      id,
      name,
      description,
      created: new Date(),
      prompts: {},
    }

    db.initializePrompt(newPrompt)

    return id;
  }

  createNewPrompt(pID: string, newText: string, newDesc: string): promptType {
    const vID = uuid();

    // db.getPrompt(pID)

    const newData = {
      [vID]: {
        pText: newText,
        v: 1,
        created: new Date(),
        description: newDesc,
      }
    }
    db.saveDataToFile(newData)

    return newData;

  }


}
