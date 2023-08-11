import React, { FormEventHandler, useEffect, useState } from 'react';
import { Button, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Paper, Select, TextField } from '@mui/material';
import axios from 'axios';
import { promptVersionType } from '@/pVersioning/versionTypes';

interface GeneratorFormProps {
  submitHandler: FormEventHandler<HTMLFormElement>,
  promptVersions: promptVersionType[],
  versionSelector: any,
  version: promptVersionType | null,
}

export const GeneratorForm: React.FC<GeneratorFormProps> = ({
  submitHandler,
  versionSelector,
  promptVersions,
  version,
}) => {

  console.log('generatorform promptVersions: ', promptVersions)
  console.log('generatorform version: ', version)

  return (
    <Paper elevation={3} sx={{ margin: 3, padding: 3 }}>
      <form
        onSubmit={submitHandler}
      >
        <div>
          <div>
            <label htmlFor="topic">Planned Topic</label>
          </div>
          <TextField
            id="topic"
            required
            variant="outlined"
            fullWidth
            label="topic"
          />
        </div>
        <div>
          <div>
            <label htmlFor="description">Description</label>
          </div>
          <TextField
            rows={3}
            fullWidth
            multiline
            id="description"
            placeholder="a short description to make it clear. Not mandatory."

          />
        </div>

        <FormControlLabel
          control={<Checkbox id="filter" />}
          label="filter"
        />

        <FormControl fullWidth margin="normal">
          <InputLabel htmlFor="selectedversion">select prompt version</InputLabel>
          <Select
            id="selectedversion"
            value={version?.id}
            required
            onChange={(e) => { versionSelector(e.target.value as unknown as promptVersionType) }}
          >
            {promptVersions.length > 0 && promptVersions.map(v => (
              <MenuItem
                key={v.id}
                value={v}
              >
                {`name: ${v.promptText} / id: ${v.id}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button type="submit" variant="contained" color="primary">
          Submit topic
        </Button>
      </form>
    </Paper>
  );
};
