"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home({ params }) {
  const [user, setUser] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  // クエリパラメータ 'id' を取得
  const { id } = params;

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`http://localhost:3000/users/${id}`,{
          headers: {
            'Authorization': `Bearer ${token}`,
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

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">ユーザー一覧</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <ul>
          <li>ユーザーID: {user.id}</li>
          <li>ユーザー名: {user.name}</li>
        </ul>
      </div>
      <div>
        <Link href="/users">
          ユーザー一覧を見る
        </Link>
      </div>
    </div>
  );
}
