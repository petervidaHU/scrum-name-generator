import React, { useState, useRef, useEffect } from 'react';

interface EditableSpanProps {
  text: string;
  onChange: (newText: string) => void;
  position: number;
}

export const EditableSpan: React.FC<EditableSpanProps> = ({ text, onChange, position }) => {
  const spanRef = useRef<HTMLSpanElement | null>(null);
  const [editableContent, setEditableContent] = useState(text);
  const [cursorPosition, setCursorPosition] = useState(text.length);

  useEffect(() => {
    if (spanRef.current) {
      const range = document.createRange();
      const selection = window.getSelection();

      range.setStart(spanRef.current.firstChild || spanRef.current, cursorPosition);
      range.collapse(true);

      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }, [cursorPosition]);

  const handleInput = (event: React.FormEvent<HTMLSpanElement>) => {
    const newContent = event.currentTarget.textContent || '';
    setEditableContent(newContent);
    setCursorPosition(getCursorPosition());
    onChange(newContent);
  };



  const getCursorPosition = (): number => {
    if (spanRef.current) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(spanRef.current);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        return preCaretRange.toString().length;
      }
    }
    return cursorPosition;
  };

  return (
    <span
      id={`${position}`}
      ref={spanRef}
      contentEditable={true}
      onInput={handleInput}
      style={{
        display: 'inline-block',
        border: '1px solid #ccc',
        padding: '8px',
      }}
    >
      {editableContent}
    </span>
  );
};

export default EditableSpan;
