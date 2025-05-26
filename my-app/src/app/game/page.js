"use client";
import { useState } from 'react';

export default function GamePage() {
  const [deckId, setDeckId] = useState(null);
  const [playerCards, setPlayerCards] = useState([]);
  const [dealerCards, setDealerCards] = useState([]);

  const shuffleDeck = async () => {
    const { deck_id } = await fetch(
      "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
    ).then(r => r.json());
    setDeckId(deck_id);
    setPlayerCards([]);
    setDealerCards([]);
  };

  const deal = async () => {
    const { cards } = await fetch(
      `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=4`
    ).then(r => r.json());
    setPlayerCards(cards.slice(0, 2));
    setDealerCards(cards.slice(2, 4));
  };

  const drawCard = async () => {
    const { cards } = await fetch(
      `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
    ).then(r => r.json());
    setPlayerCards(prev => [...prev, ...cards]);
  };

  return (
    <div>
      <button onClick={shuffleDeck}>Shuffle</button>
      <button onClick={deal} disabled={!deckId}>Deal</button>
      <button onClick={drawCard} disabled={!deckId}>Hit</button>

      <div>
        {dealerCards.map(card => (
          <img key={card.code} src={card.image} alt={card.code} />
        ))}
      </div>

      <div>
        {playerCards.map(card => (
          <img key={card.code} src={card.image} alt={card.code} />
        ))}
      </div>
    </div>
  );
}
