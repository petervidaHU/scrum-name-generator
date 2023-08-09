import { Button, TextField, Select, SelectChangeEvent, MenuItem, Typography, Paper, Box } from '@mui/material';
import React, { FormEventHandler, useState, useEffect, ChangeEventHandler, ChangeEvent } from 'react'
import axios from 'axios';
import { promptCollectionType, promptVersionType } from '@/pVersioning/versionTypes';
import PromptEditor from '@/app/components/PromptEditor';
import PromptCollectionCard from '@/app/components/prompt-manager/PromptCollectionCard';

const createNewPromptAPI = '/api/newPrompt'
const getPromptListAPI = '/api/getList'
const getPrompt = '/api/getPrompt'
const savePrompt = '/api/savePrompt'

const ManagePrompts = () => {
  const [prompt, setPrompt] = useState<promptCollectionType | null>(null);
  const [list, setList] = useState([]);
  const [id, setId] = useState<string>('');
  const [newPrompt, setNewPrompt] = useState<promptCollectionType | null>(null);

  useEffect(() => {
    const getList = async () => {
      const { data } = await axios(getPromptListAPI);
      console.log('data in useeffe', data);
      setList(data);
    }
    getList();
  }, [])

  const handleNewPrompt: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const { newName, newDesc } = event.target as any;

    const result = await axios(createNewPromptAPI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        newName: newName.value,
        newDesc: newDesc.value,
      },
    })
    console.log('new prompt rsult data:', result.data)
    setNewPrompt(result.data);
  }

  const saveNewPromptVersion = async (newPrompt: promptVersionType | undefined) => {
    if (newPrompt) {
      const result = await axios(savePrompt, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          id,
          newPrompt,
        },
      });
    }
  };

  const handleSelect = async (event: SelectChangeEvent) => {
    event.preventDefault();
    const { value } = event.target;

    const { data } = await axios(getPrompt, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        prompt: value,
      },
    })

    setId(data.id);
    setPrompt(data);
  }
  console.log('list: ', list);

  return (
    <>
      <Typography variant='h1'>manage prompts</Typography>
      <Paper elevation={3} sx={{ margin: 3, padding: 3 }}>
        <Typography variant='h4'>NEW prompt collection initializing:</Typography>
        <Box>
          <form onSubmit={handleNewPrompt}>
            <TextField
              id="newName"
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <TextField
              id="newDesc"
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              margin="normal"
            />
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </form>

          {newPrompt && (
            <div>
              <Typography variant='h6'>{JSON.stringify(newPrompt)}</Typography>
            </div>
          )}
        </Box>
      </Paper>

      <hr />
      <Paper elevation={3} sx={{ margin: 3, padding: 3 }}>
        <Typography variant='h4'>Work with existing collection</Typography>
        <form >
          <div
            id="select"
          >
            <div >
              <label
                htmlFor="countries"
              >
                Select your existing Prompt
              </label>
            </div>
            <Select
              id="selectedP"
              required
              onChange={handleSelect}
            >
              {list.length > 0 && list.map(l => (
                <MenuItem key={l} value={l}>
                  {l}
                </MenuItem>
              ))}
            </Select>
          </div>
          {/*prompt.length > 0 && (<div>{prompt}</div>)*/}
          {prompt && <PromptCollectionCard p={prompt} />}
        </form>

        <PromptEditor save={saveNewPromptVersion} />
      </Paper>

      <Paper elevation={3} sx={{ margin: 3, padding: 3 }}>
        <Typography variant='h4'>List of existing container - to be done</Typography>


      </Paper>

    </>
  )
}

export default ManagePrompts;