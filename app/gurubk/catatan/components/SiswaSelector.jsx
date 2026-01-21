"use client";
import { useState } from "react";

export default function SiswaSelector({ onSelect }) {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);

  async function searchSiswa(text) {
    setKeyword(text);

    if (text.length < 2) {
      setResults([]);
      return;
    }

    try {
      const res = await fetch(`/api/siswa/search?search=${text}`);

      // Jika API error → kasih array kosong
      if (!res.ok) {
        console.error("API Error:", res.status, res.statusText);
        setResults([]);
        return;
      }

      let data = [];
      try {
        data = await res.json();
      } catch (err) {
        // Jika JSON tidak valid
        console.error("JSON Parse Error:", err);
        setResults([]);
        return;
      }

      setResults(Array.isArray(data) ? data : []);
      
    } catch (error) {
      console.error("Network Error:", error);
      setResults([]);
    }
  }

  return (
    <div className="w-full">
      <label className="font-semibold">Cari Siswa (Nama / NIS)</label>

      <input
        type="text"
        value={keyword}
        onChange={(e) => searchSiswa(e.target.value)}
        placeholder="Ketik nama atau NIS..."
        className="border rounded-lg p-2 w-full mt-1"
      />

      {results.length > 0 && (
        <div className="border rounded-lg mt-2 bg-white shadow p-2 max-h-56 overflow-y-auto">
          {results.map((siswa) => (
            <div
              key={siswa.id}
              onClick={() => {
                onSelect(siswa);
                setResults([]);
                setKeyword(`${siswa.name} - ${siswa.nis}`);
              }}
              className="p-2 hover:bg-gray-200 cursor-pointer rounded"
            >
              <p className="font-bold">{siswa.name}</p>
              <p className="text-sm text-gray-600">NIS: {siswa.nis}</p>
              <p className="text-sm text-gray-600">Kelas: {siswa.kelas}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
