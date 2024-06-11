// app/Cards.tsx
import React, { useState } from 'react';

// Define Card type
interface Card {
  id: number;
  content: string;
  additionalCards: string[];
}

interface CardsProps {
  isVisible: boolean;
  onClose: () => void;
  cardsData: Card[];
}

const Cards: React.FC<CardsProps> = ({ isVisible, onClose, cardsData }) => {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);

  if (!isVisible) return null;

  const handleCheckboxChange = (cardId: number, isChecked: boolean) => {
    if (isChecked) {
      setVisibleCards((prev) => [...prev, cardId]);
    } else {
      setVisibleCards((prev) => prev.filter((id) => id !== cardId));
    }
  };

  return (
    <div style={styles.container}>
      <button style={styles.closeButton} onClick={onClose}>Close</button>
      {cardsData.map((card) => (
        <div key={card.id} style={styles.card}>
          {card.content}
          <div>
            <input 
              type="checkbox" 
              id={`showMore-${card.id}`} 
              name={`showMore-${card.id}`} 
              onChange={(e) => handleCheckboxChange(card.id, e.target.checked)} 
            />
            <label htmlFor={`showMore-${card.id}`}> Show more options</label>
          </div>
          {visibleCards.includes(card.id) && (
            <>
              {card.additionalCards.map((additionalContent, index) => (
                <div key={index} style={styles.additionalCard}>{additionalContent}</div>
              ))}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed' as 'fixed',
    top: 0,
    right: 0,
    width: '300px',
    height: '100%',
    backgroundColor: '#fff',
    boxShadow: '-2px 0 5px rgba(0,0,0,0.3)',
    padding: '10px',
    zIndex: 1000,
    overflowY: 'auto' as 'auto'
  },
  closeButton: {
    backgroundColor: '#ff5e5e',
    border: 'none',
    color: '#fff',
    padding: '10px',
    cursor: 'pointer',
    marginBottom: '10px',
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    marginBottom: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  additionalCard: {
    backgroundColor: '#e9e9e9',
    padding: '15px',
    marginBottom: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
};

export default Cards;
