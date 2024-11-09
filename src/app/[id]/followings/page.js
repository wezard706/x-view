"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home({ params }) {
  const [followings, setFollowings] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  // クエリパラメータ 'id' を取得
  const { id } = params;

  useEffect(() => {
    const fetchFollowers = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`http://localhost:3000/users/${id}/followings`,{
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.status === 401) {
          router.push('/sign_in');
          return;
        }

        if (!response.ok) {
          throw new Error('フォロー中のユーザーの取得に失敗しました。');
        }
        const data = await response.json();
        setFollowings(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchFollowers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">フォロー中のユーザー</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <ul className="space-y-4">
          {followings.map((following) => (
            <li key={following.id}>
              <Link href={`/${following.id}`} className="block p-4 border rounded-lg shadow-sm hover:bg-blue-50 transition">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">{following.name}</h3>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
