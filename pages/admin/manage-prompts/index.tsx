import { Button, TextField, Select, SelectChangeEvent, MenuItem, Typography, Paper, Box, FormControl, InputLabel } from '@mui/material';
import React, { FormEventHandler, useState, useEffect } from 'react'
import axios from 'axios';
import { ParameterType, PromptCollectionType, PromptVersionType } from '@/pVersioning/versionTypes';
import PromptEditor from '@/app/components/PromptEditor';
import PromptCollectionCard from '@/app/components/prompt-manager/PromptCollectionCard';
import PromptFullList from '@/app/components/prompt-manager/PromptFullList';
import AdminLayout from '@/app/components/layouts/adminLayout';

const createNewPromptAPI = '/api/newPrompt'
const getPromptListAPI = '/api/getList'
const getVersionListAPI = '/api/getVersionList'
const getParametersListAPI = '/api/getParameters'
const getPrompt = '/api/getPrompt'
const savePrompt = '/api/savePrompt'

const ManagePrompts = () => {
  const [prompt, setPrompt] = useState<PromptCollectionType | null>(null);
  const [list, setList] = useState<PromptCollectionType[]>([]);
  const [versionList, setVersionList] = useState<PromptVersionType[]>([]);
  const [parameters, setParameters] = useState<ParameterType[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<number>(0);
  const [selectedParameter, setSelectedParameter] = useState<string>('');
  const [newPrompt, setNewPrompt] = useState<PromptCollectionType | null>(null);

  useEffect(() => {
    const getList = async () => {
      const { data } = await axios(getPromptListAPI);
      setList(data);
    }
    const getParameters = async () => {
      const { data } = await axios(getParametersListAPI);
      setParameters(data);
    }

    getList();
    getParameters();
  }, [])

  useEffect(() => {
    const getVersions = async () => {
      const { data } = await axios(getVersionListAPI, {
        method: 'POST',
        data: {
          versionIds: prompt?.versions,
        }
      });
      setVersionList(data)
    }
    if (prompt) {
      getVersions();
    }
  }, [prompt])

  const handleCreateNewPrompt: FormEventHandler<HTMLFormElement> = async (event) => {
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
        defaultParametersId: selectedParameter,
      },
    })
    setNewPrompt(result.data);
  }

  const handleSaveNewPromptVersion = async (newPrompt: PromptVersionType | undefined) => {
    if (newPrompt && prompt) {
      const result = await axios(savePrompt, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          id: prompt.id,
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

    setPrompt(data);
  }
  console.log('selected version:', selectedVersion);

  return (
    <AdminLayout>
      <Typography variant='h1'>manage prompts</Typography>
      <Paper elevation={3} sx={{ margin: 3, padding: 3 }}>
        <Typography variant='h4'>NEW prompt collection initializing:</Typography>
        <Box>
          <form onSubmit={handleCreateNewPrompt}>
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

            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="selectedParameter">select default parameter</InputLabel>
              <Select
                id="selectedParameter"
                value={selectedParameter}
                required
                onChange={(e) => { setSelectedParameter(e.target.value) }}
              >
                {parameters.length > 0 && parameters.map(parameter => (
                  <MenuItem key={parameter.id} value={parameter.id}>
                    {`name: ${parameter.name} / id: ${parameter.id}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="selectedP">Select your existing Prompt</InputLabel>
            <Select
              id="selectedP"
              required
              onChange={handleSelect}
            >
              {list.length > 0 && list.map(promptCollection => (
                <MenuItem key={promptCollection.id} value={promptCollection.id}>
                  {promptCollection.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {prompt && (
            <PromptCollectionCard
              prompt={prompt}
              versions={versionList}
              selectVersion={(a) => { setSelectedVersion(+a) }}
            />
          )}
        </form>

        <PromptEditor
          list={list}
          save={handleSaveNewPromptVersion}
          starterPrompt={versionList[selectedVersion]?.promptObject || []}
        />
      </Paper>

      <Paper elevation={3} sx={{ margin: 3, padding: 3 }}>
        <Typography variant='h4'>List of existing containers</Typography>
        <PromptFullList list={list} />


      </Paper>
    </AdminLayout>
  )
}

export default ManagePrompts;