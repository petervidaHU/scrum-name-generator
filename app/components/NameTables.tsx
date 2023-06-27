import React from 'react'
import { Button, Table } from 'flowbite-react';
import { iResult, iResultWithTags } from '../types/nameTypes';

interface NameTablesProps {
  list: iResult[] | iResultWithTags[];
  descriptionWizard: any,
}

export const NameTables: React.FunctionComponent<NameTablesProps> = ({ list, descriptionWizard }) => {
  return (
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
        {list.map(listElem => {
          return (
            <Table.Row key={listElem.name} className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {listElem.name}
              </Table.Cell>
              <Table.Cell>
                {listElem.description ? listElem.description : (<Button onClick={() => descriptionWizard(listElem.name)}>Get Description</Button>)}
              </Table.Cell>
              <Table.Cell>
                ADD TO OK
              </Table.Cell>
            </Table.Row>
          )
        })}

      </Table.Body>
    </Table>
  )
}
