import React, { useState } from 'react';

interface promptEditorProps {
  id: string,
}

const PromptEditor: React.FC<promptEditorProps> = ({id}) => {
  const [content, setContent] = useState(''); 

  const handleInputChange = (event: any) => {
    setContent(event.target.textContent);
  };

  return (
    <div
      contentEditable="true"
      onInput={handleInputChange}
      style={{
        border: '1px solid #ccc',
        padding: '8px',
        minHeight: '100px',
      }}
    >
      {content}
    </div>
  );
};

export default PromptEditor;
