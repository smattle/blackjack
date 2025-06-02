"use client";
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const startGame = () => {
    router.push('/game');
  };

  return (
    <main style={{ textAlign: 'center', padding: '0 20px' }}>
      <h1>Welcome to Blackjack</h1>
      <p>Test your luck and strategy!</p>
      <button
        onClick={startGame}
        style={{
          marginTop: '1rem',
          padding: '1rem 2rem',
          fontSize: '1.2rem',
          border: 'none',
          borderRadius: '5px',
          backgroundColor: '#e63946',
          color: '#fff',
          cursor: 'pointer'
        }}
      >
        Start Game
      </button>
    </main>
  );
}
