import { useEffect, useState } from 'react';

interface SnowflakeProps {
  id: number;
}

function Snowflake({ id }: SnowflakeProps) {
  const [style, setStyle] = useState({});

  useEffect(() => {
    // Randomize snowflake properties
    const left = Math.random() * 100;
    const animationDuration = 10 + Math.random() * 20; // 10-30s
    const animationDelay = Math.random() * 5; // 0-5s delay
    const fontSize = 0.5 + Math.random() * 1.5; // 0.5-2em
    const opacity = 0.3 + Math.random() * 0.5; // 0.3-0.8

    setStyle({
      left: `${left}%`,
      animationDuration: `${animationDuration}s`,
      animationDelay: `${animationDelay}s`,
      fontSize: `${fontSize}em`,
      opacity,
    });
  }, []);

  return (
    <div className="snowflake" style={style}>
      ❄
    </div>
  );
}

export default function Snowfall({ count = 30 }: { count?: number }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-40" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <Snowflake key={i} id={i} />
      ))}
    </div>
  );
}
