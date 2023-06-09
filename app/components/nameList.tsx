import React, { useCallback } from 'react';

interface iNamesList {
  list: string[],
  message: string | null,
  deleteHandler: (index: number) => void,
}

const NameList: React.FC<iNamesList> = ({ list, message, deleteHandler }) => {

  

  return (
    <div>
      <div>{message}</div>
      <div>
        {list.map((name, index) => (
          <div key={`${name}-${index}`} id={`${index}`}>{name}
            {message === 'ok' && <button onClick={() => deleteHandler(index)}>del</button>}
          </div>
        ))}

      </div>
    </div>
  )
}

export default NameList