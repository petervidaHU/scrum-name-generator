import React from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { PromptCollectionType, PromptVersionType } from '@/pVersioning/versionTypes';

interface PromptCollectionCardProps {
  prompt: PromptCollectionType,
  versions: PromptVersionType[],
  selectVersion: (k: number) => void,
}

const PromptCollectionCard: React.FC<PromptCollectionCardProps> = ({ prompt: { name, description, created, id }, versions, selectVersion }) => {
  
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">name: {name}</Typography>
        <Typography variant="subtitle1">desc: {description}</Typography>
        <Typography variant="body2">Created: {JSON.stringify(created)}</Typography>
        <Typography variant="body2">ID: {id}</Typography>
        <Typography variant='h5'>
          Existing versions
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>version</TableCell>
                <TableCell>prompt text</TableCell>
                <TableCell>description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {versions.map((version, index) => (
                <TableRow key={version.id} onClick={() => {
                  selectVersion(index)
                  }}>
                  <TableCell>{index}</TableCell>
                  <TableCell>{version.promptText}</TableCell>
                  <TableCell>{version.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default PromptCollectionCard;
