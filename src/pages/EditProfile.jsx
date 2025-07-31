import React, { useState } from 'react';

export default function EditProfile() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    profilePicture: null,
  });

  const [status, setStatus] = useState({ loading: false, message: '', error: false });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePicture') {
      setFormData({ ...formData, profilePicture: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validate = () => {
    const { name, email, password } = formData;
    if (!name || !email || !password) return 'All fields are required';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Invalid email format';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validate();
    if (error) {
      return setStatus({ loading: false, message: error, error: true });
    }

    setStatus({ loading: true, message: '', error: false });

    // 🧪 Mock backend: just log form values
    const debug = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      profilePicture: formData.profilePicture?.name || null,
    };

    console.log('Mock FormData Submitted:', debug);

    // Simulate success after 1 second
    setTimeout(() => {
      setStatus({ loading: false, message: '✅ (Mock) Profile updated!', error: false });
    }, 1000);
  };

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div style={{ marginBottom: '1rem' }}>
          <label>Name:</label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Email:</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Password:</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Profile Picture:</label>
          <input
            name="profilePicture"
            type="file"
            accept="image/*"
            onChange={handleChange}
            style={{ width: '100%', marginTop: '0.25rem' }}
          />
        </div>

        <button
          type="submit"
          disabled={status.loading}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {status.loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>

      {status.message && (
        <div
          style={{
            marginTop: '1rem',
            color: status.error ? 'red' : 'green',
            fontWeight: 'bold',
          }}
        >
          {status.message}
        </div>
      )}
    </div>
  );
}
