import React from 'react';
import { Badge } from 'flowbite-react';
import { FaTimes } from 'react-icons/fa';

interface TagsProps {
  tags: string[];
}

export const Tags: React.FunctionComponent<TagsProps> = ({ tags }) => {
  return (
    <>
      {tags.length === 0 ? (
        <p>no tags</p>
      ) : (
        tags.map((tag) => (
          <Badge color="blue" icon={FaTimes} key={tag} className="flex mr-3">
            {tag}
          </Badge>
        ))
      )}
    </>
  );
};
