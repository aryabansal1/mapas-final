export interface Card {
  id: number;
  regionName: string;
  additionalCards: {
    description: string;
    price: string;
    details: string;
    productId: string;
    actionUrl: string;
    variable: number;
  }[];
}

export interface CardsProps {
  isVisible: boolean;
  onClose: () => void;
  cardsData: Card[];
}
