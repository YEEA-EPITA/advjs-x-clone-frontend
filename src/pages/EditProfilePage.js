import React, { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";
import axios from "../constants/axios";
import { useNavigate } from "react-router-dom";


const EditProfilePage = () => {
    const [form, setForm] = useState({ name: "", email: "", username: "", bio: "", profilePicture: null });
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [profilePicPreview, setProfilePicPreview] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch current user info to prefill form
        const fetchUser = async () => {
            try {
                const res = await axios.get("/auth/me");
                setForm({
                    name: res.data.name || "",
                    email: res.data.email || "",
                    username: res.data.username || "",
                    bio: res.data.bio || "",
                    profilePicture: null
                });
            } catch (err) {
                setError("Failed to load user info");
            }
        };
        fetchUser();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type and size (max 2MB)
            if (!file.type.startsWith("image/")) {
                setError("Profile picture must be an image file.");
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                setError("Profile picture must be less than 2MB.");
                return;
            }
            setForm({ ...form, profilePicture: file });
            setProfilePicPreview(URL.createObjectURL(file));
            setError("");
        }
    };

    const validate = () => {
        if (!form.name.trim()) return "Name is required.";
        if (!form.email.trim()) return "Email is required.";
        if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Invalid email format.";
        if (password && password.length < 6) return "Password must be at least 6 characters.";
        if (password && password !== confirmPassword) return "Passwords do not match.";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setPasswordError("");
        setPasswordSuccess("");
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }
        setLoading(true);
        try {
            // Profile update (name, email, username, bio, profile picture)
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("email", form.email);
            formData.append("username", form.username);
            formData.append("bio", form.bio);
            if (form.profilePicture) formData.append("profilePicture", form.profilePicture);
            await axios.put("/auth/profile", formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setSuccess("Profile updated successfully!");
            // Password update (if provided)
            if (password) {
                try {
                    await axios.put("/auth/password", { password });
                    setPasswordSuccess("Password updated successfully!");
                } catch (err) {
                    setPasswordError(err.response?.data?.message || "Failed to update password");
                }
            }
            setTimeout(() => navigate("/profile"), 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="feed-header">
                <h2>Edit Profile</h2>
            </div>
            <div className="page-content">
                <form className="edit-profile-form" onSubmit={handleSubmit} encType="multipart/form-data">
                    <label>
                        Name:
                        <input type="text" name="name" value={form.name} onChange={handleChange} />
                    </label>
                    <label>
                        Email:
                        <input type="email" name="email" value={form.email} onChange={handleChange} />
                    </label>
                    <label>
                        Username:
                        <input type="text" name="username" value={form.username} onChange={handleChange} />
                    </label>
                    <label>
                        Bio:
                        <textarea name="bio" value={form.bio} onChange={handleChange} />
                    </label>
                    <label>
                        Profile Picture:
                        <input type="file" accept="image/*" onChange={handleProfilePicChange} />
                        {profilePicPreview && (
                            <img src={profilePicPreview} alt="Preview" style={{ width: 80, height: 80, borderRadius: '50%', marginTop: 8 }} />
                        )}
                    </label>
                    <label>
                        New Password:
                        <input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} />
                    </label>
                    <label>
                        Confirm Password:
                        <input type="password" name="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                    </label>
                    <button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
                    {error && <div className="error-msg">{error}</div>}
                    {success && <div className="success-msg">{success}</div>}
                    {passwordError && <div className="error-msg">{passwordError}</div>}
                    {passwordSuccess && <div className="success-msg">{passwordSuccess}</div>}
                </form>
            </div>
        </MainLayout>
    );
};

export default EditProfilePage;
