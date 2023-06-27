import React from 'react';
import { iResult } from '@/app/types/nameTypes';

interface iNamesList {
  list: iResult[],
  deleteHandler: (index: number) => void,
  deleteHandlerTag: (tag: string, index: number) => void,
}

const NameList: React.FC<iNamesList> = ({ list, deleteHandler, deleteHandlerTag }) => {
  console.log('list in nameslist componet:', list)


  return (
    <div>
      <div>{typeof list === "string" && list}</div>
      <div>
        {typeof list !== "string" && list.map(({ name, tags }, index) => (
          <>
            <div key={`${name}-${index}`} id={`${index}`}>
              {name}
              {<button onClick={() => deleteHandler(index)}>del</button>}
            </div>
            {(tags && tags.length > 0) && tags.map(tag => (
              <div key={tag}>
                this is a tag for: {name} -- {tag}
                <button onClick={() => deleteHandlerTag(tag, index)}>del</button>
              </div>))}
          </>
        ))}

      </div>
    </div>
  )
}

export default NameList