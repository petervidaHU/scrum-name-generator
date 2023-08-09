import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, IconButton, Modal } from '@mui/material';

interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({ open, onClose, children }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          width: 600,
          height: 600,
          padding: 2,
          borderRadius: 2,
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <IconButton
          sx={{
            position: 'absolute',
            top: 2,
            right: 2,
          }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
        {children}
            </Box>
    </Modal>
  );
};

export default CustomModal;
