import React from 'react';
import AddIcon from '@mui/icons-material/Add'; // Import the Add icon from Material-UI
import { IconButton, Tooltip } from '@mui/material';

interface AddObjectButtonProps {
  onClick: (n: number) => void;
}

const AddObjectButton: React.FC<AddObjectButtonProps> = ({ onClick }) => {
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
      <IconButton onClick={() => onClick(0)} size="small">
        <Tooltip title="Add ...">
          <AddIcon />
        </Tooltip>
      </IconButton>
         </div>
  );
};

export default AddObjectButton;
