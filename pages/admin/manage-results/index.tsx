import AdminLayout from '@/app/components/layouts/adminLayout';
import { Box, FormControl, InputLabel, MenuItem, Paper, Select, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

const getResultsListAPI = '/api/versionapi/getResults'; // Replace with your API endpoint

interface ResultData {
  // Define your result data structure here
  [key: string]: any;
}

const ManageResults: React.FC = () => {
  const [selectedResult, setSelectedResult] = useState<string | null>(null);
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [resultsList, setResultsList] = useState<string[]>([]);

  useEffect(() => {
    const getResultsList = async () => {
      const { data } = await axios.get<string[]>(getResultsListAPI);
      setResultsList(data);
    };
    getResultsList();
  }, []);

  const handleResultChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedResultId = event.target.value as string;
    setSelectedResult(selectedResultId);

    // Fetch and set result data based on selectedResultId
    const response = await axios.get<ResultData>(`/api/getResultData?id=${selectedResultId}`); // Replace with your API endpoint
    setResultData(response.data);
  };

  return (
    <AdminLayout>
      <Typography variant='h1'>Manage Results</Typography>
      <Box sx={{ margin: 3 }}>
        <FormControl fullWidth margin="normal">
          <InputLabel htmlFor="result-select">Select Result</InputLabel>
          <Select
            id="result-select"
            value={selectedResult || ''}
            onChange={handleResultChange}
            label="Select Result"
          >
            {resultsList.map((resultId) => (
              <MenuItem key={resultId} value={resultId}>{resultId}</MenuItem>
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
                  <TableCell>Property</TableCell>
                  <TableCell>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(resultData).map(([property, value]) => (
                  <TableRow key={property}>
                    <TableCell>{property}</TableCell>
                    <TableCell>{value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </AdminLayout>
  );
};

export default ManageResults;
