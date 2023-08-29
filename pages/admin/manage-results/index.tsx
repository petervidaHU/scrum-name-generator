import AdminLayout from '@/app/components/layouts/adminLayout';
import { APINames } from '@/types/apiNames';
import { ResultCollectionType } from '@/pVersioning/versionTypes';
import { Box, FormControl, InputLabel, MenuItem, Paper, Select, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import YellowCard from '@/app/components/YellowCard';
import { ResultEvaluator_True_Or_False } from '@/pVersioning/resultEvaulator';

const collectResultData = async (input: any) => Object
  .entries(input.results)
  .reduce(async (accPromise, [key, value]) => {
    const acc = await accPromise;

    const param = await axios.get<any>(`${APINames.parameters}?idtoget=${key}`);
    const resultArray = await Promise.all(
      (value as Array<string>)
        .map(async (resultId: string) => {
          const { data } = await axios.get<any>(`${APINames.results}?idtoget=${resultId}`);
          return {
            resultId,
            data,
          };
        }
        ));

    acc.push({
      ...param.data,
      results: resultArray,
    });

    return acc;
  }, Promise.resolve([] as any[]))

const ManageResults: React.FC = () => {
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [resultData, setResultData] = useState<any | null>(null);
  const [resultsList, setResultsList] = useState<Array<ResultCollectionType>>([]);

  useEffect(() => {
    const getResultsList = async () => {
      const { data } = await axios.get<Array<ResultCollectionType>>(APINames.resultCollections);
      setResultsList(data);
    };
    getResultsList();
  }, []);

  const handleResultChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedResultId = event.target.value as string;
    setSelectedCollection(selectedResultId);
    const { data } = await axios.get<any>(`${APINames.resultCollections}?id=${selectedResultId}`);
    const consumedData = await collectResultData(data[0]);
    setResultData(consumedData);
  };

  console.log('resultData', resultData);
  console.log('resultList', resultsList);

  return (
    <AdminLayout>
      <Typography
        variant='h1'
      >
        Manage Results
      </Typography>
      <YellowCard title="Manage Results">
        <ul>
          <li>Here should be plenty of magic</li>
          <li>Comparing more result of one prompt</li>
          <li>Comparing results of different prompts</li>
          <li>Comparing results of different prompts with different parameters</li>
          <li>Checking other elements of response from API</li>
          <li>Check reason of stop</li>
        </ul>
        <br />
        <strong>
          more result ResultEvaulators:
        </strong>
        <ul>
          <li>True or False</li>
          <li>Percentage</li>
          <li>Positive false, positive true, negative false, negative true</li>
          <li>Predefined value collectors</li>
          <li>Ratings</li>
          <li>More...</li>
          <li>User defined evaluators</li>
        </ul>
        <br />
        <strong>
          more visualisations:
        </strong>
        <ul>
          <li>Plotly or any other data vis. library?</li>
          <li>Built-in visualisations for the different types of the evaluators</li>
          <li>More...</li>
        </ul>
      </YellowCard>

      <Box sx={{ margin: 3 }}>
        <FormControl fullWidth margin="normal">
          <InputLabel
            htmlFor="result-select"
          >
            Select Result collection (promp version, basically)
          </InputLabel>
          <Select
            id="result-select"
            value={selectedCollection || ''}
            onChange={handleResultChange}
            label="Select Result"
          >
            {resultsList.map((result) => (
              <MenuItem
                key={result.promptId}
                value={result.promptId}
              >
                {result.promptId}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {resultData && (
        <Paper elevation={3} sx={{ margin: 3, padding: 3 }}>
          <Typography variant='h4'>Result Data</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>id</TableCell>
                  <TableCell>name</TableCell>
                  <TableCell>description</TableCell>
                  <TableCell>created</TableCell>
                </TableRow>
              </TableHead>

              {resultData.map(({ id, created, description, name, parameters, results }) => (
                <React.Fragment key={id}>
                  <TableBody>
                    <TableRow>
                      <TableCell>{id}</TableCell>
                      <TableCell>{name}</TableCell>
                      <TableCell>{description}</TableCell>
                      <TableCell>{created}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography variant='body1'>Parameter</Typography>
                      </TableCell>
                    </TableRow>
                    {Object.entries(parameters).map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell>{key}</TableCell>
                        <TableCell>{value as string}</TableCell>
                      </TableRow>
                    ))}
                    {results.map(({ resultId, data }: { resultId: string, data: any }) => (
                      <TableRow key={resultId}>
                        <TableCell>{resultId}</TableCell>
                        {Object.entries(data).map(([key, value]) => (
                          <TableRow key={key}>
                            <TableCell>{JSON.stringify(key)}</TableCell>
                            <TableCell>{JSON.stringify(value)}</TableCell>
                          </TableRow>
                        ))}
                      </TableRow>
                    ))}

                  </TableBody>
                </React.Fragment>
              ))}
            </Table>
          </TableContainer>
        </Paper>
      )}
    </AdminLayout>
  );
};

export default ManageResults;
