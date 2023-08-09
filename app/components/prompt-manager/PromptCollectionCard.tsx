import React from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { promptCollectionType } from '@/pVersioning/versionTypes';

interface PromptCollectionCardProps {
  p: promptCollectionType;
}

const PromptCollectionCard: React.FC<PromptCollectionCardProps> = ({ p: { name, description, created, id, versions } }) => {
  // console.log('name: ', versions)
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
                <TableCell>version id</TableCell>
                <TableCell>prompt text</TableCell>
                <TableCell>description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {versions.map((version) => (
                <TableRow key={version.id}>
                  <TableCell>{version.id}</TableCell>
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
