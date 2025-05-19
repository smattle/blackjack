"use client";
import { useState } from 'react';

export default function GamePage() {
  const [deckId, setDeckId] = useState(null);
  const [playerCards, setPlayerCards] = useState([]);

  const shuffleDeck = async () => {
    const { deck_id } = await fetch(
      "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
    ).then(r => r.json());
    setDeckId(deck_id);
    setPlayerCards([]);
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
      <button onClick={drawCard}>Draw</button>
      <div>
        {playerCards.map(card => (
          <img key={card.code} src={card.image} alt={card.code} />
        ))}
      </div>
    </div>
  );
}
