import { Button, TextInput } from 'flowbite-react';
import React, { FormEventHandler, useState, useEffect } from 'react'
import axios from 'axios';
import { promptProperties, promptType } from '@/pVersioning/versionTypes';

const ManagePrompts = () => {
  const [newText, setNewText] = useState('');
  const [p, setP] = useState<promptType | null>(null);
  const createNewPromptAPI = '/api/newPrompt'

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const { newText } = event.target as any;

    console.log('handle new text: ', newText.value);

    const result = await axios(createNewPromptAPI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        newText: newText.value,
      },
    })
    setP(result.data);
  }

  useEffect(() => {
    if (p) {
      console.log('Object.keys(p)', Object.keys(p))
      const id: string = Object.keys(p)[0];
      const obj = p[id];
      for (let key in obj){
        console.log(key, ': ', obj[key as keyof promptProperties])
      }
    }
  
   }, [p])
  

  return (
    <>
      <div>manage prompts</div>
      <form onSubmit={handleSubmit}>

        <TextInput
          id="newText"
          sizing="lg"
          type="text"
        />
        <Button type="submit">
          Submit prompt
        </Button>
        {p && (
          <div>
            <p>{Object.keys(p)}</p>

          </div>
        )}
      </form>
    </>
  )
}

export default ManagePrompts;