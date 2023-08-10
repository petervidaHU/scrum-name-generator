import { v4 as uuid } from 'uuid';
import { promptVersionSelection, promptVersionType } from './versionTypes';

export const createNewPromptVersion = (
  content: (string | promptVersionSelection)[],
  desc: string = 'empty description',
): promptVersionType => ({
  id: uuid(),
  description: desc,
  created: new Date(),
  promptObject: content,
  promptText: content.reduce((acc: string, item) => acc + (typeof item === 'string' ? item : item.promptText), ''),
});
