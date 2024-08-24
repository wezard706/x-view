"use client";

import { useEffect, useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/hello')
        .then((response) => response.json())
        .then((data) => setMessage(data.message))
        .catch((error) => console.error('Error fetching message:', error));
  }, []);

  return (
      <div>
        <h1>Hello from Next.js!</h1>
        <p>{message}</p>
      </div>
  );
}
