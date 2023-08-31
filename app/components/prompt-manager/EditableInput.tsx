import React, { useState, useRef, useEffect } from 'react';

interface EditableInputProps {
  text: string;
  onChange: (newText: string) => void;
  position: number;
}

export const EditableInput: React.FC<EditableInputProps> = ({ text, onChange, position }) => {
  const [editableContent, setEditableContent] = useState(text);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inputWidth, setInputWidth] = useState(0);

  useEffect(() => {
    if (inputRef.current) {
      setInputWidth(inputRef.current.scrollWidth);
    }
  }, [editableContent]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditableContent(event.target.value);
    setInputWidth(inputRef.current?.scrollWidth || 0);
  };

  const handleInputBlur = () => {
    onChange(editableContent);
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={editableContent}
      onChange={handleInputChange}
      onBlur={handleInputBlur}
      style={{
        display: 'inline-block',
        border: '1px solid #ccc',
        padding: '8px',
        backgroundColor: 'transparent',
        outline: 'none',
        cursor: 'pointer',
        width: `${inputWidth}px`, 
      }}
    />
  );
};
