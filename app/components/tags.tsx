import React, { MouseEventHandler } from 'react';
import { Badge } from 'flowbite-react';
import { FaTimes } from 'react-icons/fa';

interface TagsProps {
  tags: string[];
  parent: number,
  del?: MouseEventHandler<HTMLSpanElement>,
};

export const Tags: React.FunctionComponent<TagsProps> = ({ tags, parent, del }) => {
  return (
    <>
      {tags.length === 0 ? (
        <p>no tags</p>
      ) : (
        tags.map((tag) => (
          <Badge
          color="blue"
          icon={FaTimes}
          key={tag}
          className="flex mr-3"
          onClick={del}
          id={tag}
          data-parent={parent}
          >
            {tag}
          </Badge>
        ))
      )}
    </>
  );
};
