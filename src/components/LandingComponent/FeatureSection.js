const FeatureSection = () => {
  return (
    <section className="features" id="features">
      <div className="features-container">
        <h3 className="features-title">What makes X special?</h3>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">�</div>
            <h4>Real-time Polls</h4>
            <p>
              Create interactive polls and see results instantly. Engage your
              audience with live voting on any topic
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">❤️</div>
            <h4>Likes & Engagement</h4>
            <p>
              Show appreciation with likes, retweets, and replies. Build
              meaningful connections through engagement
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✍️</div>
            <h4>Share Posts</h4>
            <p>
              Express yourself with text, images, and media. Share your thoughts
              with the world in real-time
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔔</div>
            <h4>Live Notifications</h4>
            <p>
              Never miss a moment with instant notifications for mentions,
              likes, and follower activity
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">�</div>
            <h4>Follow & Connect</h4>
            <p>
              Build your network by following friends, influencers, and topics
              that matter to you
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h4>Discover Trends</h4>
            <p>
              Stay updated with trending topics, hashtags, and conversations
              happening around the world
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
