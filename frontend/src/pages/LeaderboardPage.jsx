import { useState, useEffect } from 'react';
import { leaderboard } from '../services/api';

export default function LeaderboardPage() {
  const [entries, setEntries] = useState([]);
  const [filter, setFilter] = useState('global');

  useEffect(() => {
    leaderboard.get({ filter }).then(res => setEntries(res.data));
  }, [filter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-10">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold mb-6 text-center">Leaderboard</h1>

        <div className="mb-6 flex justify-center">
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-300 shadow-sm"
          >
            <option value="global">Global</option>
            <option value="age">Age Group</option>
          </select>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-4 text-left">Rank</th>
                <th className="p-4 text-left">User</th>
                <th className="p-4 text-left">Percentile</th>
                <th className="p-4 text-left">Age Group</th>
              </tr>
            </thead>

            <tbody>
              {entries.map((e, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-semibold">{idx + 1}</td>
                  <td className="p-4">{e.anonymized_name}</td>
                  <td className="p-4 text-blue-600 font-semibold">{e.percentile}%</td>
                  <td className="p-4">{e.age_group}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}