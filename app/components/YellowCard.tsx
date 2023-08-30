import React, { ReactNode } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/rootReducer';

const YellowCard: React.FC<{ title: string, children: ReactNode }> = ({ title, children }) => {
  const commentsOn = useSelector((state: RootState) => state.comments.value);

  if (!commentsOn) {
    return null;
  }

  return (
    <Card style={{
      backgroundColor: '#ffff80',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      margin: '16px',
    }}>
      <CardContent>
        <Typography variant="h6" style={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
        <Typography>
          {children}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default YellowCard;
