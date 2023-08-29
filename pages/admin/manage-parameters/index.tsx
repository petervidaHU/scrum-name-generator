import YellowCard from '@/app/components/YellowCard';
import AdminLayout from '@/app/components/layouts/adminLayout';
import ParameterList from '@/app/components/prompt-manager/ParameterList';
import { createNewParameter } from '@/pVersioning/promptVersionerUtils';
import { models, ParameterType } from '@/pVersioning/versionTypes';
import { Box, Button, FormControl, FormLabel, InputLabel, MenuItem, Paper, Select, Slider, TextField, Typography } from '@mui/material'
import axios from 'axios';
import React, { useState, useEffect } from 'react'

const getParametersListAPI = '/api/getParameters'
const saveOneParameterAPI = '/api/saveParameter'

const Index = () => {
  const [toppValue, setToppValue] = useState<number>(0)
  const [frequencyPenaltyValue, setFrequencyPenaltyValue] = useState<number>(0)
  const [presencePenaltyValue, setPresencePenaltyValue] = useState<number>(0)
  const [modelValue, setModelValue] = useState<models>(models.gpt35)
  const [temperatureValue, setTemperatureValue] = useState<number>(0)
  const [list, setList] = useState<ParameterType[]>([]);

  useEffect(() => {
    const getList = async () => {
      const { data } = await axios(getParametersListAPI);
      setList(data);
    }
    getList();
  }, [])

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    const { nameOfParam, description, maxtokens, stopSeq } = e.currentTarget;
    console.log('submit:', nameOfParam.value, description.value, maxtokens.value, temperatureValue, modelValue, toppValue, stopSeq)

    const newParameter: ParameterType = createNewParameter({
      nameOfParam: nameOfParam.value,
      description: description.value,
      maxtokens: maxtokens.value,
      temperatureValue,
      toppValue,
      frequencyPenaltyValue,
      presencePenaltyValue,
      modelValue,
      stopSeq: stopSeq.value,
    })

    const result = await axios(saveOneParameterAPI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        newParameter,
      }
    })

    console.log('save result: ', result.data);
  }

  const handleSliderChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (
    event: Event,
    newValue: number | number[],
  ) => {
    console.log('newValue: ', newValue),
      setter(newValue as number);
  };

  console.log('paramter list: ', list)

  return (
    <AdminLayout>
      <Typography variant='h1'>manage parameters</Typography>
      <Paper elevation={3} sx={{ margin: 3, padding: 3 }}>
        <Typography variant='h4'>NEW parameters:</Typography>
        <YellowCard title="Manage Parameters">
          <ul>
            <li>Tags like stable, untested, used in: etc</li>
            <li>comments on version</li>
            <li>Author of version</li>
            <li>Variables or checking variables of the connected prompt</li>
            <li>Conditional values according to variables (see before)</li>
            <li>Sibling versions (or minor version in subvrsioning) if only 1 value been changed like model, temperature</li>
            <li>search by author, tag, used in, id, name, etc...</li>
          </ul>
        </YellowCard>
        <form onSubmit={handleSubmit}>
          <TextField
            id="nameOfParam"
            label="Name"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            id="description"
            fullWidth
            margin="normal"
          />
          <TextField
            id="maxtokens"
            label="Max Tokens"
            type="number"
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="model">Model</InputLabel>
            <Select
              id="model"
              value={modelValue}
              onChange={(e) => setModelValue(e.target.value as models)}
              label="Model"
            >
              {Object.values(models).map(model => (
                <MenuItem key={model} value={model}>{model}</MenuItem>

              ))}
            </Select>
          </FormControl>
          <TextField
            id="stopSeq"
            label="stop sequences"
            fullWidth
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <FormLabel>Temperature</FormLabel>
            <Slider
              id="temperature"
              value={temperatureValue}
              onChange={handleSliderChange(setTemperatureValue)}
              min={0}
              max={2}
              step={0.01}
            />
            <Typography variant="caption">{temperatureValue.toFixed(2)}</Typography>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <FormLabel>Frequency penalty</FormLabel>
            <Slider
              id="frequency"
              value={frequencyPenaltyValue}
              onChange={handleSliderChange(setFrequencyPenaltyValue)}
              min={0}
              max={2}
              step={0.01}
            />
            <Typography variant="caption">{frequencyPenaltyValue.toFixed(2)}</Typography>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <FormLabel>Presence penalty</FormLabel>
            <Slider
              id="presence"
              value={presencePenaltyValue}
              onChange={handleSliderChange(setPresencePenaltyValue)}
              min={0}
              max={2}
              step={0.01}
            />
            <Typography variant="caption">{presencePenaltyValue.toFixed(2)}</Typography>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <FormLabel>Top P</FormLabel>
            <Slider
              id="topp"
              value={toppValue}
              onChange={handleSliderChange(setToppValue)}
              min={0}
              max={1}
              step={0.01}
            />
            <Typography variant="caption">{toppValue.toFixed(2)}</Typography>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </Paper>

      <Paper elevation={3} sx={{ margin: 3, padding: 3 }}>
        <Typography variant='h4'>parameters list:</Typography>
        <ParameterList params={list} />
      </Paper>
    </AdminLayout>
  );

}

export default Index