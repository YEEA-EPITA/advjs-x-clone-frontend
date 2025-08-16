<br>

<div align=center>

<img src="https://upload.wikimedia.org/wikipedia/commons/5/5a/X_icon_2.svg" alt="X Logo" width="120"/>

</div>

<br><br>

# X-Clone-Frontend
### A Twitter(X)-like Social Networking Platform
<br>

<b>1. Feed</b>
- #RealtimeFeed #LiveUpdates  
- Fetches live feed quickly and transforms data into consistent view models.  
- Infinite scroll, pagination, and detailed view on click

<b>2. Realtime</b>
- #Sockets #Notifications  
- Built-in Socket.IO client receives new posts and notifications.  
- Secure connect/disconnect depending on authentication state.

<b>3. Composer</b>
- #Posts #Hashtags #Mentions #Polls  
- React Hook Form + Yup for form validation.  
- Post composer supports text, media upload, automatic, and polls.

<b>4. PWA</b>
- #OfflineFirst #Caching  
- Service Worker caches static assets and API GET responses.  
- Offline fallback page included.
  <br><br><br><br>


# X-Clone Frontend Team
### Contributors and Roles <br>

| Name   | Role |
|--------|------|
| **Huong giang Dinh** | **UI/UX & Feature Development** <br> - Live Feeds <br> - Follow Suggestion & Follow User <br> - Search & Filter tweets and users <br> - Left/Right Sidebar Components <br> - Dark/Light Theme |
| **Yeowon Kim** | **Post Composition & Media** <br> - Post Composer (Text, Image, Video) <br> - Notifications <br> - Detailed post page <br> - Register/Login Page <br> - Comments and retweets |
| **Dogar Muhammad Arbaz** | **Realtime / State / PWA** <br> - Auth State Handling (JWT) <br> - Socket.IO Client & Server Integration <br> - Realtime Feed & Like Events <br> - Poll Functionality (Frontend & Backend) <br> - PWA Support <br> - Landing page |
| **Nandhini Thirulogachandhar Singh** | **Profile & Initialization** <br> - Profile Page <br> - Edit Profile Info/Password <br> |

<br><br>

# Project Details
- ### Demo / Presentation Video  
   [![Demo Video](https://img.youtube.com/vi/g38FARb0Enw/0.jpg)](https://youtu.be/g38FARb0Enw)

- ### Goals
  - **Feed Performance**: Fast live feed loading with consistent transformations  
  - **Post Composition**: Support hashtags, mentions, media, polls, and location  
  - **Realtime**: Sockets for notifications and live events  
  - **Offline-Ready**: PWA with service worker caching  
  - **Reliability**: Unified API layer with Axios interceptors  
- ### Features
  - Infinite scrolling feed, post detail view  
  - Post creation (text, image, video, polls, location)  
  - Notifications, explore, profile, more pages  
  - Authentication with protected routing  
  - Offline PWA support  
- ### Timeline
  - 2025.07 ~ 2025.08 

<br><br>

# Pre-requisites 
- **npm**: v8+
- **Backend API server**: default `http://localhost:8000` (configurable via `.env`)  
- **Environment variables**: Create `.env` in project root  
  ```env
  REACT_APP_API_URL=http://localhost:8080


# Quick Start

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start development server**

   ```bash
   npm start
   ```

   → open [http://localhost:3000](http://localhost:3000) in your browser

3. **Production build**

   ```bash
   npm run build
   ```

⚠️ Note: Project is based on **Create React App (CRA v5)**.
If React 19 is set in `package.json`, downgrade to **React 18.2** or migrate build tooling to **Vite**.

<br><br><br>

# Tech Stack

<br>
<div align=center> 
  <img src="https://img.shields.io/badge/javascript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E">
  <img src="https://img.shields.io/badge/react-20232a?style=for-the-badge&logo=react&logoColor=61DAFB">
  <img src="https://img.shields.io/badge/react%20router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white">
  <img src="https://img.shields.io/badge/redux%20toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white">
  <img src="https://img.shields.io/badge/react%20hook%20form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white">
  <img src="https://img.shields.io/badge/yup-6E7BF2?style=for-the-badge&logoColor=white">
  <br>
  <img src="https://img.shields.io/badge/axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white">
  <img src="https://img.shields.io/badge/socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white">
  <img src="https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white">
  <img src="https://img.shields.io/badge/CSS-1572b6?style=for-the-badge&logo=css3&logoColor=white">
  <br>
  <img src="https://img.shields.io/badge/create%20react%20app-09D3AC?style=for-the-badge&logo=create-react-app&logoColor=white">
  <img src="https://img.shields.io/badge/npm-CB0000?style=for-the-badge&logo=npm&logoColor=white">
</div>

<br><br><br><br>

# Service Architecture

Frontend Architecture Overview:

* **Entry**: `src/index.js` → `<BrowserRouter>` + Redux `<Provider>` + `AppStateProvider` + service worker registration
* **Routing**:

  * Public: `/`, `/auth`
  * Private: `/home`, `/notifications`, `/posts/:id`, `/explore`, `/messages`, `/profile`, `/more`
* **State Management**: Redux Toolkit (`postSlice`) + Context (`AppStateProvider/Reducer`)
* **API Layer**: `axios.js` instance with token interceptor, `requests.js` for endpoints
* **Realtime**: Socket.IO connection lifecycle managed in `AppStateProvider`
* **PWA**: `service-worker.js` caches static + API GET responses, offline fallback page

<br>

# Directory Structure

<details>
<summary> Expand Directory Map </summary>
<div markdown="1">  

```
public/
  index.html
  manifest.json
  offline.html
  service-worker.js
  assets/x-logo.png

src/
  index.js
  App.js
  serviceWorkerRegistration.js
  store.js
  store/postSlice.js
  context/
    AppStateProvider.js
    AppStateReducer.js
  constants/
    axios.js
    requests.js
  utils/generalFunctions.js
  pages/
    HomePage.js
    ExplorePage.js
    NotificationsPage.js
    MessagesPage.js
    ProfilePage.js
    MorePage.js
    AuthPage.js
    LandingPage.js
    PostDetailPage.js
  components/
    Post*, PostCard, PostMedia, PostTags, PostsContainer
    ImageModal, PostComposer
    LandingComponent/{Navbar,HeroSection,FeatureSection,CallToAction,Footer}.js
  styles/*.css
```

</div>
</details>

<br><br>


# Key Features

|                                           Live Feed & Post Detail                                          |                                                          Post Composer (Media, Polls, Location)                                                          |
| :--------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------: |
| ![Live Feed & Post Detail](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FItbFs%2FbtsPVZpsOSo%2FAAAAAAAAAAAAAAAAAAAAAM7GMIPOvc59rL4HcW4MqHBVvn8d4NaQWjC1_PEcrSzJ%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1756652399%26allow_ip%3D%26allow_referer%3D%26signature%3DPc4cReQBcwdPtyP0iFi%252FfCuQ1f8%253D) | ![Post Composer](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fd91m22%2FbtsPWf6EYvx%2FAAAAAAAAAAAAAAAAAAAAACKLwTP9jtb8d-zj9I0fXB_wQK2f3l90qpiZ4h2ZZ6DN%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1756652399%26allow_ip%3D%26allow_referer%3D%26signature%3D4QpomYjw9id3BwSAsq4Xwgm3fTY%253D) |
| - Infinite scroll & pagination <br> - Hashtags/Mentions rendering <br> - Image modal with keyboard support | - RHF + Yup validation <br> - Hashtags/Mentions auto-extraction <br> - Image upload/preview, poll options & expiry <br> - Reverse geocoding for location |

|                                  Notifications & Realtime                                 |                    PWA Offline Mode                   |
| :---------------------------------------------------------------------------------------: | :---------------------------------------------------: |
| ![Notifications & Realtime](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FcUG6DX%2FbtsPVwHRhhv%2FAAAAAAAAAAAAAAAAAAAAAIkkZMvbq33VIiL6j7h-R71QsyzBLKJLdGx9DbWZdE0W%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1756652399%26allow_ip%3D%26allow_referer%3D%26signature%3DLb4P6Dvce5DfImjoy9DrHB3wJCA%253D) | ![PWA Offline Mode](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fd0bGAw%2FbtsPU1g2Crw%2FAAAAAAAAAAAAAAAAAAAAAFh4GAmKHWnx_3tBZDn6sjukUQZ8Ke7Qce-Ti5orXO4b%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1756652399%26allow_ip%3D%26allow_referer%3D%26signature%3D1MOeqs9C3YAN3uAkGl3XwXuDOao%253D) |
| - Socket.IO events for posts & notifications <br> - Auto connect/disconnect on auth state | - Static & API GET cache <br> - Offline fallback page |



<br><br>

# Development Guide

## Environment Variables

```env
REACT_APP_API_URL=http://localhost:8080
```

## Scripts

```bash
npm start   # Run development server
npm run build   # Build production bundle
```

<br><br><br>
