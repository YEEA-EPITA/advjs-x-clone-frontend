## 🧾 Profile Page View (TC-8)

### Description
Implements the profile page UI and routing.

### Features
- Route: `/profile/:username` using `react-router-dom`
- Mocked user profile data (can be connected to backend later)
- Components:
  - `ProfileHeader`: Banner, profile image, name, username, bio, tweet/follow counts
  - `ProfileTabs`: Tabs to switch between Tweets, Media, Likes
  - `TweetList`: Shows placeholder content based on selected tab
- React hooks:
  - `useParams()` to extract username from route
  - `useState()` for selected tab
  - `useEffect()` to simulate profile fetch

### How to Run
```bash
git checkout feature/TC-8-profile-page-view
npm install
npm run dev
