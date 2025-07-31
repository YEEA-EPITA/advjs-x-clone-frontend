// src/components/TweetList.jsx
export default function TweetList({ tab, username }) {
  return (
    <div>
      <h4>Showing: {tab.toUpperCase()}</h4>
      {/* Placeholder: You can connect this to backend later */}
      <p>Loading {tab} for @{username}...</p>
    </div>
  );
}
