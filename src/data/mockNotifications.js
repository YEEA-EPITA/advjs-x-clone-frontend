// TODO: This will be replaced with real data from the backend.
const mockData = [
  {
    id: '1',
    type: 'mention',
    user: 'David',
    message: 'mentioned you in a comment.',
    time: 'Just now',
  },
  {
    id: '2',
    type: 'mention',
    user: 'Antony',
    message: 'tagged you in a post.',
    time: '3m',
  },
  {
    id: '3',
    type: 'mention',
    user: 'David',
    message: 'replied with @you in a thread.',
    time: '5h',
  },

  {
    id: '4',
    type: 'system',
    user: 'System',
    message: 'New login from Chrome on macOS.',
    time: '1d',
  },
  {
    id: '5',
    type: 'system',
    user: 'System',
    message: 'Your password was changed successfully.',
    time: '2d',
  },

  {
    id: '6',
    type: 'engagement',
    user: 'JaneDoe',
    message: 'liked your post.',
    time: '10m',
  },
  {
    id: '7',
    type: 'engagement',
    user: 'ReactFan',
    message: 'retweeted your post.',
    time: '30m',
  },

  {
    id: '8',
    type: 'follow',
    user: 'dev_guy',
    message: 'started following you.',
    time: '2h',
  },
  {
    id: '9',
    type: 'follow',
    user: 'CodeQueen',
    message: 'followed you back.',
    time: '4h',
  },

  {
    id: '10',
    type: 'mention',
    user: 'TestBot',
    message: 'mentioned you in test run logs.',
    time: '6h',
  },
];

export default mockData;
