import { models, parameterListType } from '@/pVersioning/versionTypes';
import { Box, Button, FormControl, FormLabel, InputLabel, MenuItem, Paper, Select, Slider, TextField, Typography } from '@mui/material'
import axios from 'axios';
import React, { useState, useEffect } from 'react'

const getParametersListAPI = '/api/getParameters'
const saveOneParameterAPI = '/api/saveParameter'

const Index = () => {
  const [toppValue, setToppValue] = useState<number>(0)
  const [modelValue, setModelValue] = useState<models>(models.gpt35)
  const [temperatureValue, setTemperatureValue] = useState<number>(0)
  const [list, setList] = useState<parameterListType[]>([]);

  useEffect(() => {
    const getList = async () => {
      const { data } = await axios(getParametersListAPI);
      setList(data);
    }
    // getList();
  }, [])

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    const { nameOfParam, description, maxtokens, stopSeq } = e.currentTarget;
    console.log('submit:', nameOfParam.value, description.value, maxtokens.value, temperatureValue, modelValue, toppValue, stopSeq)
  }

  const handleSliderChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (
    event: Event,
    newValue: number | number[],
  ) => {
    console.log('newValue: ', newValue),
      setter(newValue as number);
  };

  return (
    <>
      <Typography variant='h1'>manage parameters</Typography>
      <Paper elevation={3} sx={{ margin: 3, padding: 3 }}>
        <Typography variant='h4'>NEW parameters:</Typography>

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
        <Typography variant='h4'>parameters list : - to be done</Typography>

      </Paper>
    </>
  );

}

export default Index