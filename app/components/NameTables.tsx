import React, { MouseEventHandler } from 'react'
import { Button, Table, ToggleSwitch } from 'flowbite-react';
import { iResult, iResultWithTags } from '../types/nameTypes';
import { Tags } from './tags';

interface NameTablesProps {
  title: string,
  list: iResult[] | iResultWithTags[];
  descriptionWizard: any,
  proposalHandler: MouseEventHandler<HTMLSpanElement>,
  proposalLabel?: string,
}

export const NameTables: React.FunctionComponent<NameTablesProps> = ({ title, list, descriptionWizard, proposalHandler, proposalLabel = 'decline' }) => {
  return (
    <div className="my-6">
      <h3>{title}</h3>
      <Table className="my-6" striped>
        <Table.Head>
          <Table.HeadCell>
            Suggested Name
          </Table.HeadCell>
          <Table.HeadCell>
            Description
          </Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">
              Edit
            </span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {list.map(({ name, tags, description }) => {
            return (
              <React.Fragment key={name}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {name}
                  </Table.Cell>
                  <Table.Cell>
                    {description ? description : 'No Description!'}
                  </Table.Cell>
                  <Table.Cell className="flex">
                    <span data-name={name} onClick={proposalHandler} className="mx-4">
                      {proposalLabel.toUpperCase()}
                    </span>
                    <Button onClick={() => descriptionWizard(name)}>Get Further Desc.</Button>
                  </Table.Cell>
                </Table.Row>
                {tags && <Table.Row >
                  <Table.Cell className="flex mt-2" colSpan={3}>
                    <Tags tags={tags} />
                  </Table.Cell>
                </Table.Row>
                }
              </ React.Fragment>
            )
          })}

        </Table.Body>
      </Table>
    </div>
  )
}
