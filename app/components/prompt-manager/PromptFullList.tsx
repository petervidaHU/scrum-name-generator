import React from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { promptCollectionType } from '@/pVersioning/versionTypes';

interface PromptCollectionCardProps {
  list: promptCollectionType[];
}

const PromptFullList: React.FC<PromptCollectionCardProps> = ({ list  }) => {
  return (
    <Card>
      <CardContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>id</TableCell>
                <TableCell>name</TableCell>
                <TableCell>description</TableCell>
                <TableCell>versions </TableCell>
                <TableCell>created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map(({ name, description, created, id, versions }) => (
                <TableRow key={id} >
                  <TableCell>{id}</TableCell>
                  <TableCell>{name}</TableCell>
                  <TableCell>{description}</TableCell>
                  <TableCell>{versions.length}</TableCell>
                  <TableCell>{JSON.stringify(created)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default PromptFullList;