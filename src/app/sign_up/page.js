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

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [profileImage, setProfileImage] = useState(null); // プロフィール画像の状態
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      setErrors(['パスワードが一致しません。']);
      return;
    }

    // FormDataを使用してファイルと他のデータを含める
    const formData = new FormData();
    formData.append('email', email);
    formData.append('username', username);
    formData.append('password', password);
    formData.append('password_confirmation', passwordConfirmation);
    if (profileImage) {
      formData.append('profile_image', profileImage); // プロフィール画像を追加
    }

    try {
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          // 'Content-Type': 'application/json' は不要、FormDataは自動的に設定する
        },
        body: formData,
      });

      if (response.ok) {
        setSuccess('サインアップが成功しました！');
        setErrors([]);
        setEmail('');
        setUsername('');
        setPassword('');
        setPasswordConfirmation('');
        setProfileImage(null);

        router.push('/sign_in');
      } else {
        const data = await response.json();
        const errors = [].concat(data.errors);
        setErrors(errors || ['サインアップに失敗しました。']);
      }
    } catch (err) {
      setErrors(['サインアップ中にエラーが発生しました。']);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">サインアップ</h1>
        {errors.length > 0 && (
          <div className="error-messages">
            {errors.map((error, index) => (
              <p className="text-red-500 mb-4" key={index}>{error.message}</p>
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

          <div className="mb-4">
            <label htmlFor="profileImage" className="block text-gray-700 font-bold mb-2">
              プロフィール画像:
            </label>
            <input
              type="file"
              id="profileImage"
              name="profileImage"
              onChange={(e) => setProfileImage(e.target.files[0])}
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
