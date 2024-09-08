"use client"

import { useState } from 'react';

function toSnakeCase(str) {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

function keysToSnakeCase(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj; // プリミティブ値の場合はそのまま返す
  }

  if (Array.isArray(obj)) {
    return obj.map(keysToSnakeCase);
  }

  return Object.keys(obj).reduce((acc, key) => {
    const snakeKey = toSnakeCase(key);
    acc[snakeKey] = keysToSnakeCase(obj[key]);
    return acc;
  }, {});
}

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      setError('パスワードが一致しません。');
      return;
    }

    const formData = {
      email,
      username,
      password,
      passwordConfirmation,
    };

    const snakeCaseData = keysToSnakeCase(formData);

    try {
      const response = await fetch('http://localhost:3000/sign_up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(snakeCaseData),
      });

      if (response.ok) {
        setSuccess('サインアップが成功しました！');
        setError('');
        setEmail('');
        setUsername('');
        setPassword('');
        setPasswordConfirmation('');
      } else {
        const data = await response.json();
        setError(data.message || 'サインアップに失敗しました。');
      }
    } catch (err) {
      setError('サインアップ中にエラーが発生しました。');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">サインアップ</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
              メールアドレス:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 font-bold mb-2">
              ユーザー名:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
              パスワード:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="passwordConfirmation" className="block text-gray-700 font-bold mb-2">
              パスワード（確認）:
            </label>
            <input
              type="password"
              id="passwordConfirmation"
              name="passwordConfirmation"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            サインアップ
          </button>
        </form>
      </div>
    </div>
  );
}
