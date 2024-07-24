import React, { useState } from 'react';
import { Box } from '@mui/material';
import RegionCard from './RegionCard';
import { CardsProps } from './types';

interface CardsPropsWithFilter extends CardsProps {
  selectedVariables: number[];
}

const Cards: React.FC<CardsPropsWithFilter> = ({ isVisible, cardsData, selectedVariables }) => {
  const [openDescriptionId, setOpenDescriptionId] = useState<string | null>(null);

  if (!isVisible) return null;

  const onToggleDescription = (productId: string) => {
    setOpenDescriptionId((prevId) => (prevId === productId ? null : productId));
  };

  const filteredCardsData = cardsData.map(card => ({
    ...card,
    additionalCards: card.additionalCards.filter(additionalCard => selectedVariables.includes(additionalCard.variable))
  }));

  return (
    <Box sx={{ backgroundColor: '#fff', padding: '10px', overflowY: 'auto', marginTop: '10px' }}>
      {filteredCardsData.map((card) => (
        <RegionCard
          key={card.id}
          id={card.id}
          regionName={card.regionName}
          additionalCards={card.additionalCards}
          openDescriptionId={openDescriptionId}
          onToggleDescription={onToggleDescription}
        />
      ))}
    </Box>
  );
};

export default Cards;