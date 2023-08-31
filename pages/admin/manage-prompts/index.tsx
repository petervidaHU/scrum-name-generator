import { Button, TextField, Select, SelectChangeEvent, MenuItem, Typography, Paper, Box, FormControl, InputLabel } from '@mui/material';
import React, { FormEventHandler, useState, useEffect } from 'react'
import axios from 'axios';
import { ParameterType, PromptCollectionType, PromptVersionType } from '@/pVersioning/versionTypes';
import PromptEditor from '@/app/components/prompt-manager/PromptEditor';
import PromptCollectionCard from '@/app/components/prompt-manager/PromptCollectionCard';
import PromptFullList from '@/app/components/prompt-manager/PromptFullList';
import AdminLayout from '@/app/components/layouts/adminLayout';
import YellowCard from '@/app/components/YellowCard';

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
      <YellowCard title="Manage Prompts">
        <ul>
          <li>Tags like stable, untested, used in: etc</li>
          <li>comments on version</li>
          <li>Author of version</li>
          <li>Readable version number</li>
          <li>subversions? like 1.3.2</li>
          <li>search by author, tag, used in, id, name, etc...</li>
        </ul>
      </YellowCard>

      <Typography variant='h1'>manage prompts</Typography>
      <YellowCard title="Create new prompt">
        <ul>
          <li>Differenciate between collection and subprompts?</li>
          <li>Set project or any other way for context to prompt collections?</li>
        </ul>
      </YellowCard>

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
        </form>
        {prompt && (
          <>
            <PromptCollectionCard
              prompt={prompt}
              versions={versionList}
              selectVersion={(a) => { setSelectedVersion(+a) }}
            />
            <YellowCard title="Editor">
              <ul>
                <li>enhanced editor</li>
                <li>enhanced variables (type, range, validations etc)</li>
                <li>conditionals in text like single/plural forms of words, depending on variables</li>
                <li>add auto space if necessary</li>
                <li>add auto punctuation if necessary</li>
                <li>Grammarly implementation to correct grammar errors</li>
                <li>drag and drop?</li>
                <li>counting approx. input tokens</li>
              </ul>
            </YellowCard>
            <PromptEditor
              list={list}
              save={handleSaveNewPromptVersion}
              starterPrompt={versionList[selectedVersion]?.promptObject || []}
            />
          </>
        )}
      </Paper>

      <Paper elevation={3} sx={{ margin: 3, padding: 3 }}>
        <Typography variant='h4'>List of existing containers</Typography>
        <YellowCard title="List of existing containers">
          <ul>
            <li>sublist of used variables</li>
            <li>search by name, id, author, tag, used in etc</li>
            <li>filter by tag, author, used in etc</li>
            <li>sort by name, id, author, tag, used in etc</li>
          </ul>
        </YellowCard>

        <PromptFullList list={list} />

      </Paper>
    </AdminLayout>
  )
}

export default ManagePrompts;