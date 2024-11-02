"use client";

import React, { useEffect, useState } from 'react';

export default function Home({ params }) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState({}); // 各ユーザーのフォロー状態を管理

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`http://localhost:3000/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('ユーザー情報の取得に失敗しました。');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleFollowToggle = async (userId, isFollowing) => {
    const token = localStorage.getItem('token');
    const url = isFollowing ? 'http://localhost:3000/unfollow' : 'http://localhost:3000/follows';
    const requestOptions = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ followed_id: userId }),
    };

    try {
      const response = await fetch(url, requestOptions);
      if (response.ok) {
        // フォロー状態をトグルする
        setFollowing((prevFollowing) => ({
          ...prevFollowing,
          [userId]: !isFollowing,
        }));
      } else {
        throw new Error(isFollowing ? 'フォロー解除に失敗しました' : 'フォローに失敗しました');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">ユーザー一覧</h1>

        {loading && <p className="text-center text-gray-500">読み込み中...</p>}

        {error && (
          <div className="text-red-500 mb-4 text-center">
            <p>{error}</p>
          </div>
        )}

        <ul className="space-y-4">
          {users.map((user) => (
            <li
              key={user.id}
              className="p-4 border rounded-lg shadow-sm flex items-center justify-between hover:bg-blue-50 transition"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
                <p className="text-gray-600">{user.email}</p>
              </div>
              <button
                onClick={() => handleFollowToggle(user.id, following[user.id])}
                className={`px-4 py-2 rounded ${
                  following[user.id] ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                } hover:opacity-90 transition`}
              >
                {following[user.id] ? 'Following' : 'Follow'}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
