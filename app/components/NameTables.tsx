import React, { MouseEventHandler } from 'react';
import { Button, Table, TableCell, TableContainer, TableHead, TableRow, TableBody, Typography } from '@mui/material';
import { Tags } from './tags';
import { iNameItem, iNameItemWithTags } from '../types/nameTypes';

interface NameTablesProps {
  title: string;
  list: iNameItem[] | iNameItemWithTags[];
  descriptionWizard: (name: string) => void;
  proposalHandler: MouseEventHandler<HTMLSpanElement>;
  proposalLabel?: string;
  tagDeleteHandler?: MouseEventHandler<HTMLSpanElement>;
}

export const NameTables: React.FunctionComponent<NameTablesProps> = ({
  title,
  list,
  descriptionWizard,
  proposalHandler,
  proposalLabel = 'decline',
  tagDeleteHandler,
}) => {
  return (
    <div >
      <Typography variant="h3">{title}</Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Suggested Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>
                <span className="sr-only">Edit</span>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map(({ name, tags, description }, index) => (
              <React.Fragment key={name}>
                <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {name}
                  </TableCell>
                  <TableCell>{description ? description : 'No Description!'}</TableCell>
                  <TableCell className="flex">
                    <span data-name={name} onClick={proposalHandler} className="mx-4">
                      {proposalLabel.toUpperCase()}
                    </span>
                    <Button onClick={() => descriptionWizard(name)}>Get Further Desc.</Button>
                  </TableCell>
                </TableRow>
                {tags && (
                  <TableRow>
                    <TableCell className="flex mt-2" colSpan={3}>
                      <Tags tags={tags} del={tagDeleteHandler} parent={index} />
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
