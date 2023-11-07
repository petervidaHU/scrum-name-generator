import { PromptVersionSelection } from '@/pVersioning/versionTypes';
import React, { useState, FC } from 'react'

interface InitVariableProps {
    onClose: () => void,
    onSave: (a: string) => void,
}

export const InitVariable: FC<InitVariableProps> = ({
    onClose,
    onSave,
}) => {
    const [content, setContent] = useState<string>('');
  return (
    <div>
        Initializing variable
        <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={() => onSave(content)}>Save</button>
        <button onClick={onClose}>Close</button>
    </div>
  )
}
