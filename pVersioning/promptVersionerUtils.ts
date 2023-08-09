import { v4 as uuid } from 'uuid';
import { promptVersionSelection, promptVersionType } from './versionTypes';

export const createNewPromptVersion = (content: (string | promptVersionSelection)[], desc: string = 'empty description'): promptVersionType => {
  console.log('createNewPromptVersion:::', content)
  const versionId = uuid();
  return {
    id: versionId,
    description: desc,
    created: new Date(),
    promptObject: content,
    promptText: typeof content === 'string' ? content : 'not implemented yet',
  }
}
