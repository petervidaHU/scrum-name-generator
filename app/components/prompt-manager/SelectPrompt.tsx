import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, MenuItem, Typography, SelectChangeEvent, FormControl, Button } from '@mui/material';
import { promptCollectionType, promptVersionSelection } from '@/pVersioning/versionTypes';

const getPrompt = '/api/getPrompt'

interface SelectPromptProps {
  initialPrompt: promptVersionSelection | null;
  onClose: () => void;
  onSave: (a: promptVersionSelection) => void;
}

const SelectPrompt: React.FC<SelectPromptProps> = ({ initialPrompt, onClose, onSave }) => {
  const [selectedPrompt, setSelectedPrompt] = useState<promptCollectionType | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<number>(initialPrompt?.versionId || 0);
    
  const saveNewSelection = () => {
    if (selectedPrompt?.id && selectedPrompt?.id !== null && selectedVersion) {
      onSave({
        collectionId: selectedPrompt.id,
        versionId: selectedVersion,
      });
      onClose();
    }
  }

  useEffect(() => {
    if (initialPrompt?.collectionId) {
      const fetchData = async () => {
        try {
          const { data } = await axios(getPrompt, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            params: {
              prompt: initialPrompt.collectionId,
            },
          });
          setSelectedPrompt(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    }
  }, [initialPrompt]);

  const handleVersionChange = (event: SelectChangeEvent) => {
    const selectedVersionId = +event.target.value;
    setSelectedVersion(selectedVersionId);
  };
  console.log('selectedVersionId  ', selectedVersion)
  return (
    <div>
      {selectedPrompt && selectedPrompt.id ? (
        <div>
          <Typography variant="h4">{selectedPrompt.name}</Typography>
          <Typography variant="body1">{selectedPrompt.description}</Typography>
          <FormControl>
            <Select value={`${selectedVersion}`} onChange={handleVersionChange}>
              {selectedPrompt.versions.map((version, index) => (
                <MenuItem key={version.id} value={index}>
                  {version.promptText}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      ) : (
        <Typography>Loading...</Typography>
      )}
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={saveNewSelection}>Save</Button>
    </div>
  );
};

export default SelectPrompt;
