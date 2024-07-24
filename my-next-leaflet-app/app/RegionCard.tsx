import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton, Box, Divider } from '@mui/material';
import InfoCard from './InfoCard';

interface RegionCardProps {
  id: number;
  regionName: string;
  additionalCards: {
    name: string;
    description: string;
    price: string;
    details: string;
    productId: string;
    actionUrl: string;
    variable: number;
  }[];
  openDescriptionId: string | null;
  onToggleDescription: (productId: string) => void;
}

const RegionCard: React.FC<RegionCardProps> = ({
  id,
  regionName,
  additionalCards,
  openDescriptionId,
  onToggleDescription
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <Card sx={{ marginBottom: 2, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', fontFamily: 'Poppins, sans-serif' }}>
      <CardContent>
        <Box display="flex" alignItems="center">
          <Typography gutterBottom variant="h5" component="div" sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '1rem' }}>
            {regionName}
          </Typography>
          <IconButton onClick={handleToggleExpand} sx={{ fontSize: '1rem', marginLeft: 1, marginTop: -2 }}>
            {isExpanded ? '-' : '+'}
          </IconButton>
        </Box>
        <Divider sx={{ marginY: 1 }} />
        {isExpanded && (
          <Box>
            {additionalCards.map((card, index) => (
              <InfoCard
                key={`${id}-${index}`}
                name={card.name}
                description={card.description}
                price={card.price}
                details={card.details}
                productId={card.productId}
                actionUrl={card.actionUrl}
                isOpen={openDescriptionId === card.productId}
                onToggleDescription={onToggleDescription}
                sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '1rem' }}
              />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default RegionCard;