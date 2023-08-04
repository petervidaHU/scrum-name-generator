import { Button, TextField, Select, SelectChangeEvent, MenuItem, Typography, Paper } from '@mui/material';
import React, { FormEventHandler, useState, useEffect, ChangeEventHandler, ChangeEvent } from 'react'
import axios from 'axios';
import { promptProperties, promptType } from '@/pVersioning/versionTypes';
import PromptEditor from '@/app/components/PromptEditor';

const ManagePrompts = () => {
  const [prompt, setPrompt] = useState<React.JSX.Element[]>([]);
  const [list, setList] = useState([]);
  const [id, setId] = useState<string>('');
  const [newPrompt, setNewPrompt] = useState<promptType | null>(null);

  const createNewPromptAPI = '/api/newPrompt'
  const getPromptListAPI = '/api/getList'
  const getPrompt = '/api/getPrompt'

  useEffect(() => {
    const getList = async () => {
      const { data } = await axios(getPromptListAPI);
      console.log('data in useeffe', data);
      setList(data);
    }
    getList();
  }, [])

  useEffect(() => {
    if (newPrompt) {
      console.log('Object.keys(p)', Object.keys(newPrompt))
      const id: string = Object.keys(newPrompt)[0];
      const obj = newPrompt[id];
      for (let key in obj) {
        console.log(key, ': ', obj[key as keyof promptProperties])
      }
    }

  }, [newPrompt])

  const handleSubmitNewPrompt: FormEventHandler<HTMLFormElement> = async (event) => {
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
    setNewPrompt(result.data);
  }

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
    const output = Object.keys(data).map(p => (
      <p key={p}>
        <strong>
          {p}
        </strong>
        :
        <span>
          {typeof data[p] === 'string' ? data[p] : JSON.stringify(data[p])}
        </span>
      </p>
    ))
    setId(data.id);
    setPrompt(output);
  }

  console.log('lis1', prompt)

  return (
    <>
      <Typography variant='h2'>manage prompts</Typography>
      <Paper elevation={3} sx={{margin: 3, padding: 3}}>
        <Typography variant='h4'>NEW prompt container initializing:</Typography>
        <h2></h2>
        <form onSubmit={handleSubmitNewPrompt}>
          <label htmlFor="newName" >
            name of new managed Prompt
          </label>
          <TextField
            id="newName"
            multiline
            type="text"
          />

          <label htmlFor="newDesc">
            new description
          </label>

          <TextField
            id="newDesc"
            multiline
            type="text"
          />
          <Button type="submit">
            Submit prompt
          </Button>

          {newPrompt && (
            <div>
              <p>{Object.keys(newPrompt)}</p>
            </div>
          )}
        </form>
      </Paper>
<hr/>
      <Paper elevation={3} sx={{margin: 3, padding: 3}}>
        <Typography variant='h4'>Work with existing container</Typography>
        <form >
          <div
            className="max-w-md"
            id="select"
          >
            <div className="mb-2 block">
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
          <div>
            {prompt.length > 0 && (<div>{prompt}</div>)}
          </div>
        </form>

        <div className="mt-5">
          {id && (
            <p>selected prompt: {id}</p>
          )}
        </div>

        <PromptEditor id={id} />
      </Paper>

    </>
  )
}

export default ManagePrompts;