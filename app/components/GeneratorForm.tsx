import React from 'react'
import { Button, Checkbox, Label, TextInput } from 'flowbite-react';

interface GeneratorFormProps {
  s: (a: any) => any,
}

export const GeneratorForm: React.FC<GeneratorFormProps> = ({ s }) => {
  return (
    <form
      className="flex max-w-md flex-col gap-4"
      onSubmit={s}
    >
      <div>
        <div className="mb-2 block">
          <Label
            htmlFor="topic"
            value="Planned Topic"
          />
        </div>
        <TextInput
          id="topic"
          placeholder="... something fancy"
          required
          shadow
          type="input"
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label
            htmlFor="description"
            value="Description"
          />
        </div>
        <TextInput
          id="description"
          shadow
          type="textarea"
        />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox id="filter" />
        <Label
          className="flex"
          htmlFor="filter"
        >
          <p>
            filter
          </p>
        </Label>
      </div>
      <Button type="submit">
        Submit topic
      </Button>
    </form>
  )
}
