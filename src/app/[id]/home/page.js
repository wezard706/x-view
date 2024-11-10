"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home({ params }) {
  const [user, setUser] = useState([]);
  const [error, setError] = useState(null);
  const [tweet, setTweet] = useState(''); // ツイート内容の状態
  const [tweetError, setTweetError] = useState(null);
  const router = useRouter();

  // クエリパラメータ 'id' を取得
  const { id } = params;

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`http://localhost:3000/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 401) {
          router.push('/sign_in');
          return;
        }

        if (!response.ok) {
          throw new Error('ユーザー情報の取得に失敗しました。');
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUser();
  }, []);

  const handleTweetSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:3000/tweets`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: tweet }),
      });

      if (!response.ok) {
        throw new Error('ツイートの投稿に失敗しました。');
      }

      setTweet(''); // 投稿後に入力欄をクリア
      setTweetError(null);
    } catch (error) {
      setTweetError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">ユーザー詳細</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <ul>
          <li>ユーザーID: {user.id}</li>
          <li>ユーザー名: {user.name}</li>
        </ul>
      </div>

      <div className="w-full max-w-md mt-6">
        <h2 className="text-xl font-semibold mb-4">ツイート</h2>
        <form onSubmit={handleTweetSubmit}>
          <textarea
            value={tweet}
            onChange={(e) => setTweet(e.target.value)}
            placeholder="ツイート内容を入力"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
          {tweetError && <p className="text-red-500">{tweetError}</p>}
          <button
            type="submit"
            className="mt-4 w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            ツイートを投稿
          </button>
        </form>
      </div>

      <div className="mt-6">
        <Link href="/users" className="text-blue-500 hover:underline">
          ユーザー一覧を見る
        </Link>
      </div>
    </div>
  );
}
