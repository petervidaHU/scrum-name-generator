import { Box, Button, TextField, Typography, Modal, Select, MenuItem, SelectChangeEvent, InputLabel, FormControl } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { PromptVersionSelection, PromptVersionType, CursorPositionType, PromptObjectArray, PromptCollectionType, ParameterType } from '@/pVersioning/versionTypes';
import { createNewPromptVersion } from '@/pVersioning/promptVersionerUtils';
import { EditableInput } from './EditableInput';
import EditableObject from './EditableSubPrompt';
import AddObjectButton from './AddSubprompt';
import CustomModal from './CustomModal';
import SelectPrompt from './SelectPrompt';
import axios from 'axios';
import YellowCard from '../YellowCard';
import { InitVariable } from './InitVariable';
import styled from '@emotion/styled';

interface promptEditorProps {
  starterPrompt: PromptObjectArray,
  list: PromptCollectionType[],
  save: (k: PromptVersionType) => Promise<void>,
}

const editorBox = {
  border: '1px solid black',
  margin: '10px 0px',
}

const initCursorPos = {
  isInput: false,
}

const temporaryNewItem = {
  collectionId: '',
  versionId: '',
  promptText: 'please edit!!',
};

const getParametersListAPI = '/api/getParameters'

const PromptEditor: React.FC<promptEditorProps> = ({ save, list, starterPrompt }) => {
  const [content, setContent] = useState<PromptObjectArray>([]);
  const [cursorPosition, setCursorPosition] = useState<CursorPositionType>(initCursorPos);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedSubPromptIndex, setSelectedSubpromptIndex] = useState<number | null>(null);
  const [parameters, setParameters] = useState<ParameterType[]>([]);
  const [selectedParameter, setSelectedParameter] = useState<string>('');
  const [isVariable, setIsVariable] = useState<boolean>(false);

  useEffect(() => {
    if (starterPrompt) {
      setContent(starterPrompt);
    }
  }, [starterPrompt]);

  useEffect(() => {
    const getList = async () => {
      const { data } = await axios(getParametersListAPI);
      setParameters(data);
    }
    getList();
  }, [])

  const handleCloseModal = () => {
    setIsVariable(false);
    setIsModalOpen(false);
  };

  const handleNewVersion = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { desc } = event.currentTarget;

    const newVersion = createNewPromptVersion(content, desc.value, selectedParameter);
    save(newVersion);
  }

  const setContentSimplify = (content: PromptObjectArray): void => {
    const simplyfiedContent: PromptObjectArray = content.reduce((acc: PromptObjectArray, item) => {
      if (typeof item === 'string') {
        const lastItem = acc[acc.length - 1];
        if (typeof lastItem === 'string') {
          acc[acc.length - 1] = lastItem + item;
        } else {
          acc.push(item);
        }
      } else {
        acc.push(item);
      }
      return acc;
    }, [])
    setContent(simplyfiedContent);
  }

  const handleContentChange = (index: number, newText: string) => {
    const newContent = [...content];
    newContent[index] = newText;
    setContentSimplify(newContent);
  };

  const injector = (newPrompt: PromptVersionSelection) => {
    const { textBeforeCursor, textAfterCursor, subPromptId } = cursorPosition;
    const newContent = [...content];

    if (textBeforeCursor === undefined
      || textAfterCursor === undefined
      || subPromptId === undefined) throw new Error('something went wrong with cursorPosition');

    if (textBeforeCursor.length === 0 || textAfterCursor.length === 0) {
      const pos = textBeforeCursor.length === 0 ? subPromptId : subPromptId + 1;
      newContent.splice(pos, 0, newPrompt);
    } else {
      newContent.splice(subPromptId, 1, textBeforeCursor, newPrompt, textAfterCursor);
    }

    setContentSimplify(newContent);
  }

  const setPosition = (e: any) => {
    const { target } = e;
    console.log('target:', target);
    const isInput = target instanceof HTMLInputElement;

    if (isInput || target instanceof HTMLSpanElement) {
      const cursorPosition = isInput ? target.selectionStart || 0 : 0;
      const spanText = isInput ? target.value || '' : '';
      const subPromptId = +target.id;
      const textBeforeCursor = isInput ? spanText.slice(0, cursorPosition) : '';
      const textAfterCursor = isInput ? spanText.slice(cursorPosition) : '';

      setCursorPosition({
        isInput: true,
        textBeforeCursor,
        textAfterCursor,
        subPromptId,
      })
    } else {
      setCursorPosition({
        isInput: false,
      })
    }
  };

  const handleDeleteSubPrompt = (position: number) => {
    const newContent = [...content];
    newContent.splice(position, 1);
    setContentSimplify(newContent);
  }

  const handleEditSubprompt = (position: number) => {
    setIsModalOpen(true)
    setSelectedSubpromptIndex(position)
  }

  const addText = (
    <EditableInput
      key={`strater`}
      text='add some text'
      onChange={(newText) => handleContentChange(0, newText)}
      position={0}
    />)

  const visualMayhem = content.map((fragment, index) => (
    <>
      {typeof fragment === 'string' ? (
        <EditableInput
          key={`${index}--${fragment}`}
          text={fragment}
          onChange={(newText: string) => handleContentChange(index, newText)}
          position={index}
        />
      ) : (
        <>
          {index === 0 && (
            <input
              key={`input-${index}`}
              id={`${index}`}
              onChange={(e) => { setPosition(e) }}
            />
          )}
          <EditableObject
            position={index}
            key={`${index}--${fragment}`}
            content={fragment}
            onEdit={() => handleEditSubprompt(index)}
            onDelete={() => handleDeleteSubPrompt(index)}
          />
          {(typeof content[index + 1] !== 'string') && (
            <PlaceholderInput
              key={`input-${index}`}
              id={`${index + 1}`}
              onChange={(e) => { setPosition(e) }}
            >
              +
            </PlaceholderInput>
          )}
          {index === content.length - 1 && (
            <input
              key={`input-${index}`}
              id={`${index + 1}`}
              onChange={(e) => { setPosition(e) }}
            />
          )}
        </>
      )}
    </>
  ));

  const promptLength = content.reduce((acc, item) => {
    if (typeof item === 'string') {
      return acc + item.length;
    }
    return acc + item.promptText.length;
  }, 0);

  const handleVariableInjection = () => {
    setIsVariable(true)
    setIsModalOpen(true);
  }

  console.log('content in editor:', cursorPosition);

  function variableInjector(a: string): void {
  }

  return (
    <>
      <Typography variant='h5'>
        New version
      </Typography>

      <Box
        sx={editorBox}
        onClick={(e) => { setPosition(e) }}
      >
        {visualMayhem.length > 0 && visualMayhem}
        {visualMayhem.length === 0 && addText}

      </Box>

      <Button
        disabled={!cursorPosition.isInput}
        sx={{ marginRight: '10px' }}
        variant="contained"
        color="secondary"
        onClick={() => setIsModalOpen(true)}
      >
        inject subPrompt
      </Button>
      <Button
        disabled={!cursorPosition.isInput}
        sx={{ marginRight: '10px' }}
        variant="contained"
        color="secondary"
        onClick={() => handleVariableInjection()}
      >
        inject variable
      </Button>
      <Button
        sx={{ marginRight: '10px' }}
        variant="contained"
        color="secondary"
        onClick={() => { setContent([]) }}
      >
        Clear editor
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => { setContent(starterPrompt) }}
      >
        Reset editor
      </Button>

      <Box>
        <Typography variant='h6' sx={{ marginTop: '10px' }}>
          Length of the prompt: {promptLength}
        </Typography>
      </Box>

      <YellowCard title="insert subprompts">
        <ul>
          <li>insert subprompt by TAG or version like: latest stable, tested, </li>
          <li>insert subprompt by range of minor versions, if subversioning is implemented, like ~1.3.2 or ^1.3.4</li>
          <li>search subprompt by id, name, author, tag, comment</li>
          <li>conditionaly insert variable or subprompt according to any given variables?</li>
        </ul>
      </YellowCard>

      <form onSubmit={handleNewVersion}>
        <TextField
          id="desc"
          label="Description"
          variant="outlined"
          fullWidth
          multiline
          rows={3}
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel htmlFor="selectedParameter">select parameter</InputLabel>
          <Select
            id="selectedParameter"
            value={selectedParameter}
            onChange={(e) => { setSelectedParameter(e.target.value) }}
          >
            {parameters.length > 0 && parameters.map(parameter => (
              <MenuItem key={parameter.id} value={parameter.id}>
                {`name: ${parameter.name} / id: ${parameter.id}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          type="submit"
        >
          Save New Prompt
        </Button>
      </form>

      <CustomModal
        open={isModalOpen}
        onClose={handleCloseModal}
      >
        {isVariable && (
          <InitVariable
            onClose={handleCloseModal}
            onSave={(a) => variableInjector(a)}
          />

        )}
        {!isVariable && (
          <SelectPrompt
            list={list}
            initialPrompt={content[selectedSubPromptIndex || 0] as PromptVersionSelection}
            onClose={handleCloseModal}
            onSave={(a) => injector(a)}
          />
        )}
      </CustomModal>
    </>
  );
};

export default PromptEditor;


const PlaceholderInput = styled.span`
  background-color: pink;
  margin: 0;
  padding: 0;
  cursor: pointer;
`;