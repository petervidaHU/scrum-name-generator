import { v4 as uuid } from 'uuid';
import { models, promptVersionSelection, promptVersionType, resultConnectionType } from './versionTypes';

export const createNewPromptVersion = (
  content: (string | promptVersionSelection)[],
  desc: string = 'empty description',
  selectedParameter: string | null,
): promptVersionType => ({
  id: uuid(),
  description: desc,
  created: new Date(),
  promptObject: content,
  promptText: content.reduce((acc: string, item) => acc + (typeof item === 'string' ? item : item.promptText), ''),
  params: selectedParameter,
  result: [],
});

export const createNewParameter = ({
  nameOfParam,
  description,
  maxtokens,
  temperatureValue,
  toppValue,
  frequencyPenaltyValue,
  presencePenaltyValue,
  modelValue,
  stopSeq,
}: {
  nameOfParam: string,
  description: string,
  maxtokens: number,
  temperatureValue: number,
  toppValue: number,
  frequencyPenaltyValue: number,
  presencePenaltyValue: number,
  modelValue: models,
  stopSeq: string,
}) => {
  return {
    id: uuid(),
    name: nameOfParam,
    description,
    created: new Date(),
    parameters: {
      max_tokens: maxtokens,
      temperature: temperatureValue,
      top_p: toppValue,
      frequency_penalty: frequencyPenaltyValue,
      presence_penalty: presencePenaltyValue,
      model: modelValue,
      stop: [stopSeq],
    }
  };
}

export const mergeVariablesIntoPrompt = (
  prompt: string,
  variables: Record<string, string>
): string => {
  let filledTemplate = prompt;

  Object.keys(variables).forEach((variable) => {
    const placeholder = `{_{${variable}}_}`;
    filledTemplate = filledTemplate.replace(
      new RegExp(placeholder, "g"),
      variables[variable]
    );
  });

  return filledTemplate;
}

export const createResult = (reqId: string): resultConnectionType => {
  const id = uuid();
  return {
    requestId: reqId,
    resultId: id,
  }
}
