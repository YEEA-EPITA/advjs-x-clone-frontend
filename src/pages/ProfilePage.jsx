// src/pages/ProfilePage.jsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProfileHeader from '../components/ProfileHeader';
import ProfileTabs from '../components/ProfileTabs';
import TweetList from '../components/TweetList';

export default function ProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState('tweets');

  useEffect(() => {
    //  MOCK PROFILE DATA (temporary)
    const mockProfile = {
  username: username,
  name: 'test_username',
  bio: 'Developer | JS Enthusiast',
  tweets_count: 42,
  followers_count: 128,
  following_count: 90,
  profile_image_url: 'https://placekitten.com/100/100',
  banner_url: 'https://placekitten.com/600/200',
};


    // Simulate loading delay
    setTimeout(() => setProfile(mockProfile), 500);
  }, [username]);

  if (!profile) return <div>Loading profile...</div>;

  return (
    <div>
      <ProfileHeader profile={profile} />
      <ProfileTabs tab={tab} setTab={setTab} />
      <TweetList tab={tab} username={username} />
    </div>
  );
}
