"use client";
import { useEffect, useState } from "react";

export default function GamePage() {
  const [deckId, setDeckId] = useState(null);
  const [playerCards, setPlayerCards] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [dealerCards, setDealerCards] = useState([]);
  const [result, setResult] = useState("");

  // Deck initialisieren
  useEffect(() => {
    const startGame = async () => {
      const deckRes = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1");
      const deckData = await deckRes.json();
      setDeckId(deckData.deck_id);

      const drawRes = await fetch(`https://deckofcardsapi.com/api/deck/${deckData.deck_id}/draw/?count=4`);
      const drawData = await drawRes.json();

      setPlayerCards([drawData.cards[0], drawData.cards[1]]);
      setDealerCards([drawData.cards[2], drawData.cards[3]]);
    };

    startGame();
  }, []);

  const calculateScore = (cards) => {
    let score = 0;
    let aces = 0;

    for (let card of cards) {
      if (["KING", "QUEEN", "JACK"].includes(card.value)) {
        score += 10;
      } else if (card.value === "ACE") {
        score += 11;
        aces++;
      } else {
        score += parseInt(card.value);
      }
    }

    // Ass entweder 11 oder 1
    while (score > 21 && aces > 0) {
      score -= 10;
      aces--;
    }

    return score;
  };

  // Hit
  const handleHit = async () => {
    if (!deckId || gameOver) return;

    const res = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
    const data = await res.json();
    const newCards = [...playerCards, ...data.cards];
    setPlayerCards(newCards);
  };

  // Stand
  const handleStand = () => {
    setGameOver(true);
    // ==================================
    // Dealer Logik
    // ==================================
    const playerScore = calculateScore(playerCards);
    const dealerScore = calculateScore(dealerCards);

    if (playerScore > 21) {
      setResult("Der Dealer gewinnt.");
    } else if (dealerScore > 21 || playerScore > dealerScore) {
      setResult("Du hast gewonnen!");
    } else if (playerScore < dealerScore) {
      setResult("Der Dealer gewinnt.");
    } else {
      setResult("Unentschieden.");
    }
  };

  return (
    <main style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Blackjack</h1>

      <h2>Dealer Karten:</h2>
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "1rem" }}>
        {dealerCards.map((card) => (
          <img key={card.code} src={card.image} alt={card.code} width={100} />
        ))}
      </div>

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
        <>
          <p>Du hast gestanden.</p>
          <h2>{result}</h2>
        </>
      )}
    </main>
  );
}