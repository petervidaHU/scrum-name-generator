import React, { useState } from 'react';
import { IconButton, TextField, Tooltip } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { PromptVersionSelection } from '@/pVersioning/versionTypes';

interface EditableObjectProps {
  content: PromptVersionSelection,
  onDelete: (index: number) => void,
  onEdit: (index: number) => void,
  position: number,
}

const EditableObject: React.FC<EditableObjectProps> = ({ content, onDelete, onEdit, position }) => {

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: 'lightblue',
        borderRadius: '8px',
        padding: '4px 8px',
        marginRight: '8px',
      }}
    >
      <span style={{ marginRight: '8px' }}>{content.promptText}</span>
      <IconButton onClick={() => onEdit(position)} size="small">
        <Tooltip title="Edit">
          <Edit />
        </Tooltip>
      </IconButton>
      <IconButton onClick={() => onDelete(position)} size="small">
        <Tooltip title="Delete">
          <Delete />
        </Tooltip>
      </IconButton>

    </div>
  );
};

export default EditableObject;
