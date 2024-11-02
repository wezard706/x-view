"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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

function toCamelCase(str) {
  return str.replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''));
}

// レスポンスのオブジェクトのキーをキャメルケースに変換する関数
function keysToCamelCase(obj) {
  if (Array.isArray(obj)) {
    // 配列の場合は再帰的に変換
    return obj.map((v) => keysToCamelCase(v));
  } else if (obj !== null && obj.constructor === Object) {
    // オブジェクトの場合
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = toCamelCase(key);
      acc[camelKey] = keysToCamelCase(obj[key]); // 再帰的にネストされたオブジェクトも変換
      return acc;
    }, {});
  } else {
    // プリミティブな値はそのまま返す
    return obj;
  }
}

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      email,
      password
    };

    const snakeCaseData = keysToSnakeCase(formData);

    try {
      const response = await fetch('http://localhost:3000/sign_in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(snakeCaseData),
      });

      if (response.ok) {
        const snakeCaseData = await response.json();
        const data = keysToCamelCase(snakeCaseData);
        const token = data["token"];
        const userId = data["userId"];
        localStorage.setItem('token', token);

        setSuccess('サインインが成功しました！');
        setErrors([]);
        setEmail('');
        setPassword('');

        router.push(`/${userId}/home`);
      } else {
        setErrors(['サインインに失敗しました。']);
      }
    } catch (err) {
      setErrors(['サインイン中にエラーが発生しました。']);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">サインイン</h1>
        {errors.length > 0 && (
          <div className="error-messages">
            {errors.map((error, index) => (
              <p className="text-red-500 mb-4" key={index}>{error}</p>
            ))}
          </div>
        )}
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

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            サインイン
          </button>
        </form>
      </div>
    </div>
  );
}
