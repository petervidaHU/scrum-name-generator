import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, MenuItem, Typography, SelectChangeEvent, FormControl, Button, InputLabel, Box } from '@mui/material';
import { promptCollectionType, promptVersionSelection } from '@/pVersioning/versionTypes';

const getPrompt = '/api/getPrompt'

interface SelectPromptProps {
  list: promptCollectionType[],
  initialPrompt: promptVersionSelection | null,
  onClose: () => void,
  onSave: (a: promptVersionSelection) => void,
}

const SelectPrompt: React.FC<SelectPromptProps> = ({ initialPrompt, onClose, onSave, list }) => {
  const [selectedPrompt, setSelectedPrompt] = useState<promptCollectionType | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<number>(initialPrompt?.versionId || 0);

  const saveNewSelection = () => {
    if (selectedPrompt?.id && selectedPrompt?.id !== null ) {
      onSave({
        collectionId: selectedPrompt.id,
        versionId: selectedVersion,
        promptText: selectedPrompt.versions[selectedVersion].promptText,
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

  const handlePromptChange = (event: SelectChangeEvent) => {
    const selectedPromptId = event.target.value;
    setSelectedPrompt(list.find(p => p.id === selectedPromptId) || null)
  }

  return (
    <div>
      <Typography variant="h4">{selectedPrompt?.name}</Typography>
      <Typography variant="body1">{selectedPrompt?.description}</Typography>
      <Box>
        <FormControl>
          <InputLabel id="select-prompt-label">select prompt collection</InputLabel>
          <Select
            value={`${selectedPrompt?.id}`}
            onChange={handlePromptChange}
            label='prompt'
            id='select-prompt'
            labelId='select-prompt-label'
          >
            {list.map(p => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {selectedPrompt && selectedPrompt.id ? (
        <Box>
          <FormControl>
            <InputLabel id="select-version-label">select version</InputLabel>
            <Select
              id='select-version'
              labelId='select-version-label'
              label='version'
              value={selectedVersion}
              onChange={(event) => setSelectedVersion(+event.target.value)}
            >
              {selectedPrompt.versions.map((version, index) => (
                <MenuItem key={version.id} value={index}>
                  {version.promptText}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      ) : (
        <Typography>Loading...</Typography>
      )}
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={saveNewSelection}>Save</Button>
    </div>
  );
};

export default SelectPrompt;
