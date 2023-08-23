import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';
import { ParameterType } from '@/pVersioning/versionTypes';

interface PromptListProps {
  params: ParameterType[];
}
const ParameterList: React.FC<PromptListProps> = ({ params }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Max Tokens</TableCell>
            <TableCell>Temperature</TableCell>
            <TableCell>Top P</TableCell>
            <TableCell>Frequency Penalty</TableCell>
            <TableCell>Presence Penalty</TableCell>
            <TableCell>Model</TableCell>
            <TableCell>Stop</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {params.map((param) => (
            <TableRow key={param.id}>
              <TableCell>{param.name}</TableCell>
              <TableCell>{param.description}</TableCell>
              <TableCell>{JSON.stringify(param.created)}</TableCell>
              <TableCell>{param.parameters.max_tokens}</TableCell>
              <TableCell>{param.parameters.temperature}</TableCell>
              <TableCell>{param.parameters.top_p}</TableCell>
              <TableCell>{param.parameters.frequency_penalty}</TableCell>
              <TableCell>{param.parameters.presence_penalty}</TableCell>
              <TableCell>{param.parameters.model}</TableCell>
              <TableCell>{param.parameters.stop.join(', ')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ParameterList;
