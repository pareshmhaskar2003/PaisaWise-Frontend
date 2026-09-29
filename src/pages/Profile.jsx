import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import api from "../services/api";
import "../utils/Profile.css";

function Profile() {
  const [profile, setProfile] = useState(null);

  const [name, setName] = useState("");

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(true);

  const [savingProfile, setSavingProfile] =
    useState(false);

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [profileError, setProfileError] =
    useState("");

  const [profileSuccess, setProfileSuccess] =
    useState("");

  const [passwordError, setPasswordError] =
    useState("");

  const [passwordSuccess, setPasswordSuccess] =
    useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/profile");

        setProfile(response.data);
        setName(response.data.name);
      } catch (err) {
        console.error(err);

        setProfileError(
          err.response?.data?.message ||
            "Unable to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (savingProfile || changingPassword) {
      return;
    }

    setProfileError("");
    setProfileSuccess("");

    const trimmedName = name.trim();

    if (!trimmedName) {
      setProfileError("Name cannot be empty.");
      return;
    }

    if (trimmedName.length < 2) {
      setProfileError(
        "Name must be at least 2 characters."
      );
      return;
    }

    setSavingProfile(true);

    try {
      const response = await api.put("/profile", {
        name: trimmedName,
      });

      setProfile(response.data);
      setName(response.data.name);

      setProfileSuccess(
        "Profile updated successfully."
      );
    } catch (err) {
      console.error(err);

      setProfileError(
        err.response?.data?.message ||
          "Unable to update profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (savingProfile || changingPassword) {
      return;
    }

    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword) {
      setPasswordError(
        "Current password is required."
      );
      return;
    }

    if (!newPassword) {
      setPasswordError(
        "New password is required."
      );
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(
        "New password must be at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        "New passwords do not match."
      );
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError(
        "New password must be different from current password."
      );
      return;
    }

    setChangingPassword(true);

    try {
      await api.put("/profile/password", {
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setPasswordSuccess(
        "Password changed successfully."
      );
    } catch (err) {
      console.error(err);

      setPasswordError(
        err.response?.data?.message ||
          "Unable to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="page-header">
          <div>
            <h1>Profile & Settings</h1>
            <p className="subtitle">
              Manage your account information and password.
            </p>
          </div>
        </div>

        <LoadingSpinner message="Loading your profile..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>Profile & Settings</h1>
          <p className="subtitle">
            Manage your account information and password.
          </p>
        </div>
      </div>

      <div className="profile-grid">

        {/* Profile Information */}

        <div className="form-card profile-card">
          <div className="profile-card-header">
            <div className="profile-avatar">
              {profile?.name
                ?.charAt(0)
                ?.toUpperCase()}
            </div>

            <div>
              <h2>Profile Information</h2>
              <p className="muted">
                Update your personal information.
              </p>
            </div>
          </div>

          {profileError && (
            <div className="profile-message profile-error">
              {profileError}
            </div>
          )}

          {profileSuccess && (
            <div className="profile-message profile-success">
              {profileSuccess}
            </div>
          )}

          <form
            onSubmit={handleProfileSubmit}
            className="profile-form"
          >
            <div className="form-group">
              <label htmlFor="profile-name">
                Full Name
              </label>

              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Enter your name"
                disabled={
                  savingProfile ||
                  changingPassword
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="profile-email">
                Email Address
              </label>

              <input
                id="profile-email"
                type="email"
                value={profile?.email || ""}
                disabled
              />

              <small className="field-help">
                Email address cannot be changed.
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="profile-role">
                Account Role
              </label>

              <input
                id="profile-role"
                type="text"
                value={profile?.role || ""}
                disabled
              />
            </div>

            <button
              type="submit"
              disabled={
                savingProfile ||
                changingPassword
              }
            >
              {savingProfile
                ? "Saving..."
                : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Change Password */}

        <div className="form-card profile-card">
          <div className="profile-card-header">
            <div className="password-icon">
              🔐
            </div>

            <div>
              <h2>Change Password</h2>
              <p className="muted">
                Keep your account secure.
              </p>
            </div>
          </div>

          {passwordError && (
            <div className="profile-message profile-error">
              {passwordError}
            </div>
          )}

          {passwordSuccess && (
            <div className="profile-message profile-success">
              {passwordSuccess}
            </div>
          )}

          <form
            onSubmit={handlePasswordSubmit}
            className="profile-form"
          >
            <div className="form-group">
              <label htmlFor="current-password">
                Current Password
              </label>

              <div className="password-input-wrapper">
                <input
                  id="current-password"
                  type={
                    showCurrentPassword
                      ? "text"
                      : "password"
                  }
                  value={currentPassword}
                  onChange={(e) =>
                    setCurrentPassword(
                      e.target.value
                    )
                  }
                  placeholder="Enter current password"
                  disabled={
                    changingPassword ||
                    savingProfile
                  }
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowCurrentPassword(
                      !showCurrentPassword
                    )
                  }
                  disabled={
                    changingPassword ||
                    savingProfile
                  }
                >
                  {showCurrentPassword
                    ? "🙈"
                    : "👁️"}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="new-password">
                New Password
              </label>

              <div className="password-input-wrapper">
                <input
                  id="new-password"
                  type={
                    showNewPassword
                      ? "text"
                      : "password"
                  }
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  placeholder="Enter new password"
                  disabled={
                    changingPassword ||
                    savingProfile
                  }
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowNewPassword(
                      !showNewPassword
                    )
                  }
                  disabled={
                    changingPassword ||
                    savingProfile
                  }
                >
                  {showNewPassword
                    ? "🙈"
                    : "👁️"}
                </button>
              </div>

              <small className="field-help">
                Minimum 6 characters.
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="confirm-password">
                Confirm New Password
              </label>

              <div className="password-input-wrapper">
                <input
                  id="confirm-password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  placeholder="Confirm new password"
                  disabled={
                    changingPassword ||
                    savingProfile
                  }
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  disabled={
                    changingPassword ||
                    savingProfile
                  }
                >
                  {showConfirmPassword
                    ? "🙈"
                    : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={
                changingPassword ||
                savingProfile
              }
            >
              {changingPassword
                ? "Changing Password..."
                : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default Profile;