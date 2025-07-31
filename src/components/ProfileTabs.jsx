// src/components/ProfileTabs.jsx
export default function ProfileTabs({ tab, setTab }) {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      {['tweets', 'media', 'likes'].map((t) => (
        <button
          key={t}
          onClick={() => setTab(t)}
          style={{ fontWeight: tab === t ? 'bold' : 'normal' }}
        >
          {t.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
