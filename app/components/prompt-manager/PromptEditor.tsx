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
  textBeforeCursor: '',
  textAfterCursor: '',
  subPromptId: 0,
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

  const injector = (isVariable = false) => {
    let variableName: string | null = '';
    let myTempNewItem: any = temporaryNewItem;
    if (isVariable) {
      while (!variableName) {
        variableName = window.prompt('Please enter variable name');
      }
      myTempNewItem = `{_{${variableName.toUpperCase()}}_}`;
    }

    const { textBeforeCursor, textAfterCursor, subPromptId } = cursorPosition;
    const newContent = [...content];

    if (textBeforeCursor.length === 0 || textAfterCursor.length === 0) {
      const pos = textBeforeCursor.length === 0 ? subPromptId : subPromptId + 1;
      newContent.splice(pos, 0, myTempNewItem);
    } else {
      newContent.splice(subPromptId, 1, textBeforeCursor, myTempNewItem, textAfterCursor);
    }
    if (!isVariable) {
      handleEditSubprompt(subPromptId + 1);
    }
    setContentSimplify(newContent);
  }

  const setPosition = (e: any) => {
    const target = e.target;

    if (target instanceof HTMLInputElement) {
      const cursorPosition = target.selectionStart || 0;
      const spanText = target.value || '';
      const subPromptId = +target.id;
      const textBeforeCursor = spanText.slice(0, cursorPosition);
      const textAfterCursor = spanText.slice(cursorPosition);

      setCursorPosition({
        textBeforeCursor,
        textAfterCursor,
        subPromptId,
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

  const visualMayhem = content.map((fragment, index) => {
    if (typeof fragment === 'string') {
      return (
        <EditableInput
          key={`${index}--${fragment}`}
          text={fragment}
          onChange={(newText: string) => handleContentChange(index, newText)}
          position={index}
        />
      );
    }
    return (
      <EditableObject
        position={index}
        key={`${index}--${fragment}`}
        content={fragment}
        onEdit={() => handleEditSubprompt(index)}
        onDelete={() => handleDeleteSubPrompt(index)}
      />
    );
  });

  const addNewSubprompt = (n: number) => {
    const newContent = [...content];
    newContent.splice(n, 0, temporaryNewItem);
    handleEditSubprompt(n);
    setContent(newContent);
  }

  const replaceSubPrompt = (newSelection: PromptVersionSelection) => {
    if (selectedSubPromptIndex !== null) {
      const newContent = [...content];
      newContent.splice(selectedSubPromptIndex, 1, newSelection);
      setContent(newContent);
    }
  }

  console.log('content in editor:', content);

  return (
    <>
      <Typography variant='h5'>
        New version
      </Typography>

      <Box
        sx={editorBox}
        onClick={(e) => { setPosition(e) }}
      >
        <AddObjectButton onClick={() => addNewSubprompt(0)} />
        {visualMayhem.length > 0 && visualMayhem}
        {visualMayhem.length === 0 && addText}
        <AddObjectButton onClick={() => addNewSubprompt(content.length)} />
      </Box>

      <Button
        sx={{ marginRight: '10px' }}
        variant="contained"
        color="secondary"
        onClick={() => injector()}
      >
        inject subPrompt
      </Button>
      <Button
        sx={{ marginRight: '10px' }}
        variant="contained"
        color="secondary"
        onClick={() => injector(true)}
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
        <Typography variant='h6'>
          Length of the prompt: {content.length}
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
        <SelectPrompt
          list={list}
          initialPrompt={content[selectedSubPromptIndex || 0] as PromptVersionSelection}
          onClose={handleCloseModal}
          onSave={(a) => replaceSubPrompt(a)}
        />
      </CustomModal>
    </>
  );
};

export default PromptEditor;
