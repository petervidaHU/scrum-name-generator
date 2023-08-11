import React, { MouseEventHandler } from 'react';
import { Badge, IconButton } from '@mui/material';
import { FaTimes } from 'react-icons/fa';

interface TagsProps {
  tags: string[];
  parent: number;
  del?: MouseEventHandler<HTMLSpanElement>;
}

export const Tags: React.FC<TagsProps> = ({ tags, parent, del }) => {
  return (
    <>
      {tags.length === 0 ? (
        <p>no tags</p>
      ) : (
        tags.map((tag) => (
          <Badge
            color="info"
            badgeContent={
              <IconButton
                size="small"
                aria-label="delete"
                onClick={del}
                id={tag}
                data-parent={parent}
              >
                <FaTimes />
              </IconButton>
            }
            key={tag}
            className="flex mr-3"
          >
            {tag}
          </Badge>
        ))
      )}
    </>
  );
};
