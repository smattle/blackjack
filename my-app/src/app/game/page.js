"use client";
import { useEffect, useState } from "react";

const CARD_BACK = "https://deckofcardsapi.com/static/img/back.png";

export default function GamePage() {
  const [deckId, setDeckId] = useState(null);
  const [playerCards, setPlayerCards] = useState([]);
  const [dealerCards, setDealerCards] = useState([]);
  const [showDealerHole, setShowDealerHole] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState("");

  // Initialize or restart game
  const startGame = async () => {
    setShowDealerHole(false);
    setGameOver(false);
    setResult("");

    const deckRes = await fetch(
      "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
    );
    const { deck_id } = await deckRes.json();
    setDeckId(deck_id);

    const drawRes = await fetch(
      `https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=4`
    );
    const { cards } = await drawRes.json();

    setPlayerCards([cards[0], cards[1]]);
    setDealerCards([cards[2], cards[3]]);
  };

  useEffect(() => {
    startGame();
  }, []);

  const calculateScore = (cards) => {
    let score = 0;
    let aces = 0;
    for (let { value } of cards) {
      if (["KING", "QUEEN", "JACK"].includes(value)) score += 10;
      else if (value === "ACE") {
        score += 11;
        aces += 1;
      } else score += Number(value);
    }
    while (score > 21 && aces > 0) {
      score -= 10;
      aces -= 1;
    }
    return score;
  };

  const handleHit = async () => {
    if (!deckId || gameOver) return;

    const res = await fetch(
      `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
    );
    const { cards } = await res.json();
    const newHand = [...playerCards, cards[0]];
    setPlayerCards(newHand);

    const score = calculateScore(newHand);
    if (score > 21) {
      setResult("Bust");
      setShowDealerHole(true);
      setGameOver(true);
    } else if (score === 21) {
      setResult("Blackjack!");
      setShowDealerHole(true);
      setGameOver(true);
    }
  };

  const handleStand = async () => {
    if (!deckId || gameOver) return;

    setShowDealerHole(true);
    let hand = [...dealerCards];
    let dealerScore = calculateScore(hand);

    while (dealerScore < 17) {
      const res = await fetch(
        `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
      );
      const { cards } = await res.json();
      hand = [...hand, cards[0]];
      setDealerCards(hand);
      dealerScore = calculateScore(hand);
    }

    const playerScore = calculateScore(playerCards);
    if (playerScore > 21) setResult("Dealer wins.");
    else if (dealerScore > 21 || playerScore > dealerScore) setResult("You win!");
    else if (playerScore < dealerScore) setResult("Dealer wins.");
    else setResult("Push.");

    setGameOver(true);
  };

  return (
    <main style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Blackjack</h1>

      <h2>Dealer Karten:</h2>
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "1rem" }}>
        {dealerCards.map((card, idx) => (
          <img
            key={idx}
            src={idx === 1 && !showDealerHole ? CARD_BACK : card.image}
            alt={card.code}
            width={100}
          />
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
          <p>Ergebnis: {result}</p>
          <button onClick={startGame} style={{ marginTop: "1rem" }}>
            Neues Spiel
          </button>
        </>
      )}
    </main>
  );
}
