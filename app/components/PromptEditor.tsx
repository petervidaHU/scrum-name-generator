import { Box, Button, TextField, Typography, Modal } from '@mui/material';
import React, { useState } from 'react';
import { promptVersionSelection, promptVersionType, cursorPositionType, promptObjectArray } from '@/pVersioning/versionTypes';
import { createNewPromptVersion } from '@/pVersioning/promptVersionerUtils';
import { EditableSpan } from './prompt-manager/EditableSpan';
import EditableObject from './prompt-manager/EditableSubPrompt';
import AddObjectButton from './prompt-manager/AddSubprompt';
import CustomModal from './prompt-manager/CustomModal';
import SelectPrompt from './prompt-manager/SelectPrompt';
import { access } from 'fs';

interface promptEditorProps {
  save: (k: promptVersionType) => Promise<void>,
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


const PromptEditor: React.FC<promptEditorProps> = ({ save }) => {
  const [content, setContent] = useState<promptObjectArray>(['fff', 'second string', 'third fff']);
  const [cursorPosition, setCursorPosition] = useState<cursorPositionType>(initCursorPos);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedSubPromptIndex, setSelectedSubpromptIndex] = useState<number>(0)

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleNewVersion = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { desc } = event.currentTarget;
    const newVersion = createNewPromptVersion(content, desc.value);
    save(newVersion);
  }

  const setContentSimplify = (content: promptObjectArray ): void => {
      const simplyfiedContent: promptObjectArray = content.reduce((acc: promptObjectArray, item) => {
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

  const injectSubprompt = () => {
    const { textBeforeCursor, textAfterCursor, subPromptId } = cursorPosition;
    const newItem = {
      collectionId: '7d0472fe-f1ea-4def-a549-1f5b6c21b372',
      versionId: 1,
    };
    const newContent = [...content];

    if (textBeforeCursor.length === 0 || textAfterCursor.length === 0) {
      const pos = textBeforeCursor.length === 0 ? subPromptId : subPromptId + 1;
      newContent.splice(pos, 0, newItem);
    } else {
      newContent.splice(subPromptId, 1, textBeforeCursor, newItem, textAfterCursor);
    }
    setContentSimplify(newContent);
  }

  const setPosition = (e: any) => {
    const target = e.target;
    const selection = window.getSelection();

    if (target instanceof HTMLSpanElement && selection) {
      const cursorPosition = selection.anchorOffset;
      const spanText = target.textContent || '';
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

  const visualMayhem = content.map((fragment, index) => {
    if (typeof fragment === 'string') {
      return (
        <EditableSpan
          key={`${index}--${fragment}`}
          text={fragment}
          onChange={(newText) => handleContentChange(index, newText)}
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
    const newItem = {
      collectionId: '7d0472fe-f1ea-4def-a549-1f5b6c21b372',
      versionId: 1,
    };
    const newContent = [...content];

    newContent.splice(n, 0, newItem);
    setContent(newContent);
  }

  const replaceSubPrompt = (newSelection: promptVersionSelection) => {
    if (selectedSubPromptIndex) {
      const newContent = [...content];
      newContent.splice(selectedSubPromptIndex, 1, newSelection);
      setContent(newContent);
    }
  }

  return (
    <>
      <Typography variant='h5'>
        New prompt
      </Typography>

      <Box
        sx={editorBox}
        onClick={(e) => { setPosition(e) }}
      >
        <AddObjectButton onClick={() => addNewSubprompt(0)} />
        {visualMayhem.length > 0 && visualMayhem}
        <AddObjectButton onClick={() => addNewSubprompt(content.length)} />
      </Box>

      <Button
        variant="contained"
        color="secondary"
        onClick={() => { injectSubprompt() }}
      >
        inject subPrompt
      </Button>

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
          initialPrompt={content[selectedSubPromptIndex] as promptVersionSelection}
          onClose={handleCloseModal}
          onSave={(a) => replaceSubPrompt(a)}
        />
      </CustomModal>
    </>
  );
};

export default PromptEditor;
