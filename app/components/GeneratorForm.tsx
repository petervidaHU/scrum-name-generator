import React from 'react';
import { Button, Checkbox, FormControlLabel, TextField, TextareaAutosize } from '@mui/material';

interface GeneratorFormProps {
  onSubmit: (event: React.FormEvent) => void;
}

export const GeneratorForm: React.FC<GeneratorFormProps> = ({ onSubmit }) => {
  return (
    <form
      className="flex max-w-md flex-col gap-4"
      onSubmit={onSubmit}
    >
      <div>
        <div className="mb-2 block">
          <label htmlFor="topic">Planned Topic</label>
        </div>
        <TextField
          id="topic"
          placeholder="... something fancy"
          required
          variant="outlined"
          fullWidth
        />
      </div>
      <div>
        <div className="mb-2 block">
          <label htmlFor="description">Description</label>
        </div>
        <TextareaAutosize
          id="description"
          placeholder="a short description to make it clear. Not mandatory."
          
        />
      </div>

      <FormControlLabel
        control={<Checkbox id="filter" />}
        label="filter"
        className="flex"
      />
      <Button type="submit" variant="contained" color="primary">
        Submit topic
      </Button>
    </form>
  );
};
