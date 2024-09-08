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

    // オブジェクトのキーをスネークケースに変換
    const snakeCaseData = keysToSnakeCase(formData);
    console.log(formData)
    console.log(snakeCaseData)

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
    <div>
      <h1>サインアップ</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">メールアドレス:</label><br />
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          /><br /><br />
        </div>

        <div>
          <label htmlFor="username">ユーザー名:</label><br />
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          /><br /><br />
        </div>

        <div>
          <label htmlFor="password">パスワード:</label><br />
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          /><br /><br />
        </div>

        <div>
          <label htmlFor="passwordConfirmation">パスワード（確認）:</label><br />
          <input
            type="password"
            id="passwordConfirmation"
            name="passwordConfirmation"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          /><br /><br />
        </div>

        <button type="submit">サインアップ</button>
      </form>
    </div>
  );
}
