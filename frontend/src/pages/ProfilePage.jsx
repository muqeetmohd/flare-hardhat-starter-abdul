import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserCircleIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import SlabButton from '../components/ui/SlabButton';

const ProfilePage = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    username: user?.username || '',
    bio: user?.bio || '',
    location: user?.location || '',
    socialLinks: {
      twitter: user?.socialLinks?.twitter || '',
      linkedin: user?.socialLinks?.linkedin || '',
      website: user?.socialLinks?.website || ''
    }
  });

  const handleSave = () => {
    // TODO: Implement profile update
    console.log('Save profile:', profileData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setProfileData({
      fullName: user?.fullName || '',
      username: user?.username || '',
      bio: user?.bio || '',
      location: user?.location || '',
      socialLinks: {
        twitter: user?.socialLinks?.twitter || '',
        linkedin: user?.socialLinks?.linkedin || '',
        website: user?.socialLinks?.website || ''
      }
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <UserCircleIcon className="w-16 h-16 text-muted mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-ink mb-2">Login Required</h2>
          <p className="text-muted mb-6">
            Please connect your wallet to view your profile.
          </p>
          <SlabButton
            variant="primary"
            size="lg"
            label="Connect Wallet"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <section className="py-8 px-4 bg-panel border-b-2 border-[rgba(11,13,15,0.06)]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-ink mb-2">Profile</h1>
              <p className="text-muted">Manage your account settings and preferences</p>
            </div>
            
            {!isEditing ? (
              <SlabButton
                variant="secondary"
                size="md"
                icon={<PencilIcon className="w-4 h-4" />}
                label="Edit Profile"
                onClick={() => setIsEditing(true)}
              />
            ) : (
              <div className="flex gap-2">
                <SlabButton
                  variant="ghost"
                  size="md"
                  icon={<XMarkIcon className="w-4 h-4" />}
                  label="Cancel"
                  onClick={handleCancel}
                />
                <SlabButton
                  variant="primary"
                  size="md"
                  icon={<CheckIcon className="w-4 h-4" />}
                  label="Save"
                  onClick={handleSave}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="slab-container"
            >
              <h2 className="text-xl font-bold text-ink mb-6">Basic Information</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                      className="form-input"
                    />
                  ) : (
                    <div className="p-3 bg-white rounded border border-[rgba(11,13,15,0.06)]">
                      {user.fullName}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-2">
                    Username
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.username}
                      onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                      className="form-input"
                    />
                  ) : (
                    <div className="p-3 bg-white rounded border border-[rgba(11,13,15,0.06)]">
                      @{user.username}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-ink mb-2">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    className="form-input h-24"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <div className="p-3 bg-white rounded border border-[rgba(11,13,15,0.06)] min-h-[6rem]">
                    {user.bio || 'No bio provided'}
                  </div>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-ink mb-2">
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                    className="form-input"
                    placeholder="City, Country"
                  />
                ) : (
                  <div className="p-3 bg-white rounded border border-[rgba(11,13,15,0.06)]">
                    {user.location || 'Not specified'}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="slab-container"
            >
              <h2 className="text-xl font-bold text-ink mb-6">Social Links</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">
                    Twitter
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={profileData.socialLinks.twitter}
                      onChange={(e) => setProfileData({
                        ...profileData, 
                        socialLinks: {...profileData.socialLinks, twitter: e.target.value}
                      })}
                      className="form-input"
                      placeholder="https://twitter.com/username"
                    />
                  ) : (
                    <div className="p-3 bg-white rounded border border-[rgba(11,13,15,0.06)]">
                      {user.socialLinks?.twitter || 'Not provided'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-2">
                    LinkedIn
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={profileData.socialLinks.linkedin}
                      onChange={(e) => setProfileData({
                        ...profileData, 
                        socialLinks: {...profileData.socialLinks, linkedin: e.target.value}
                      })}
                      className="form-input"
                      placeholder="https://linkedin.com/in/username"
                    />
                  ) : (
                    <div className="p-3 bg-white rounded border border-[rgba(11,13,15,0.06)]">
                      {user.socialLinks?.linkedin || 'Not provided'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-2">
                    Website
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={profileData.socialLinks.website}
                      onChange={(e) => setProfileData({
                        ...profileData, 
                        socialLinks: {...profileData.socialLinks, website: e.target.value}
                      })}
                      className="form-input"
                      placeholder="https://yourwebsite.com"
                    />
                  ) : (
                    <div className="p-3 bg-white rounded border border-[rgba(11,13,15,0.06)]">
                      {user.socialLinks?.website || 'Not provided'}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="slab-container"
            >
              <h3 className="text-lg font-bold text-ink mb-4">Profile Summary</h3>
              <div className="text-center mb-4">
                <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-3">
                  <UserCircleIcon className="w-10 h-10 text-white" />
                </div>
                <div className="font-bold text-ink">{user.fullName}</div>
                <div className="text-sm text-muted">@{user.username}</div>
                <div className="text-xs text-muted">{user.role}</div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Member since</span>
                  <span className="font-medium">March 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Total donated</span>
                  <span className="font-medium text-accent-2">$125</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Lives helped</span>
                  <span className="font-medium text-accent">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Badges earned</span>
                  <span className="font-medium text-accent-3">3</span>
                </div>
              </div>
            </motion.div>

            {/* Account Settings */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="slab-container"
            >
              <h3 className="text-lg font-bold text-ink mb-4">Account Settings</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-ink">Email notifications</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-ink">SMS notifications</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-ink">Public profile</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                  </label>
                </div>
              </div>
            </motion.div>

            {/* Wallet Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="slab-container"
            >
              <h3 className="text-lg font-bold text-ink mb-4">Wallet</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-muted mb-1">Connected Address</div>
                  <div className="text-sm font-mono bg-white p-2 rounded border border-[rgba(11,13,15,0.06)] break-all">
                    {user.walletAddress}
                  </div>
                </div>
                <SlabButton
                  variant="ghost"
                  size="sm"
                  label="Disconnect Wallet"
                  className="w-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
