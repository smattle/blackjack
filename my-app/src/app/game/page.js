"use client";
import { useEffect, useState } from "react";

export default function GamePage() {
  const [deckId, setDeckId] = useState(null);
  const [playerCards, setPlayerCards] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  // Deck initialisieren
  useEffect(() => {
    const startGame = async () => {
      const deckRes = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1");
      const deckData = await deckRes.json();
      setDeckId(deckData.deck_id);

      const drawRes = await fetch(`https://deckofcardsapi.com/api/deck/${deckData.deck_id}/draw/?count=2`);
      const drawData = await drawRes.json();
      setPlayerCards(drawData.cards);
    };

    startGame();
  }, []);

  // Hit
  const handleHit = async () => {
    if (!deckId || gameOver) return;

    const res = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
    const data = await res.json();
    setPlayerCards((prev) => [...prev, ...data.cards]);
  };

  // Stand
  const handleStand = () => {
    setGameOver(true);
    // ==================================
    // Dealer Logik
    // ==================================
  };

  return (
    <main style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Blackjack</h1>

      <h2>Deine Karten:</h2>
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        {playerCards.map((card) => (
          <img key={card.code} src={card.image} alt={card.code} width={100} />
        ))}
      </div>

      {!gameOver ? (
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
          <button onClick={handleHit}>Hit</button>
          <button onClick={handleStand}>Stand</button>
        </div>
      ) : (
        <p>Du hast gestanden.</p>
      )}
    </main>
  );
}