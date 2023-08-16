import React, { FormEventHandler, useEffect, useState } from 'react';
import { Button, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Paper, Select, TextField } from '@mui/material';
import axios from 'axios';
import { promptVersionType } from '@/pVersioning/versionTypes';

interface GeneratorFormProps {
  submitHandler: FormEventHandler<HTMLFormElement>,
  promptVersions: string[],
  versionSelector: any,
  version: promptVersionType | null,
}

const getVersionListAPI = '/api/getVersionList'

export const GeneratorForm: React.FC<GeneratorFormProps> = ({
  submitHandler,
  versionSelector,
  promptVersions,
  version,
}) => {
  const [versions, setVersions] = useState<promptVersionType[]>([]);

  useEffect(() => {
    const getVersions = async () => {
      const { data } = await axios(getVersionListAPI, {
        method: 'POST',
        data: {
          versionIds: promptVersions,
        }
      });
      setVersions(data)
    }
    if (promptVersions.length) {
      getVersions();
    }
  }, [promptVersions])

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
            onChange={(e) => { versionSelector(versions[+e.target.value]) }}
          >
            {versions.length > 0 && versions.map((version, index) => (
              <MenuItem
                key={version.id}
                value={index}
              >
                {`name: ${version.promptText} / id: ${version.id}`}
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
