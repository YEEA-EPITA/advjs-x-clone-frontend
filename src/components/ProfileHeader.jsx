// src/components/ProfileHeader.jsx
export default function ProfileHeader({ profile }) {
  return (
    <div>
      <img src={profile.banner_url} alt="Banner" style={{ width: '100%' }} />
      <img
        src={profile.profile_image_url}
        alt="Profile"
        style={{ width: 100, borderRadius: '50%', marginTop: -50 }}
      />
      <h2>{profile.name}</h2>
      <p>@{profile.username}</p>
      <p>{profile.bio}</p>
      <p>
        {profile.tweets_count} Tweets • {profile.followers_count} Followers •{' '}
        {profile.following_count} Following
      </p>
    </div>
  );
}
