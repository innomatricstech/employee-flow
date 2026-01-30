import React, { useState } from "react";

const Settings = () => {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");
  const [password, setPassword] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();

    // 👉 Later send data to backend
    console.log({
      name,
      email,
      password,
      notifications,
    });

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Settings
        </h1>
        <p className="text-gray-500">
          Manage your account settings
        </p>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg">
          Settings saved successfully ✅
        </div>
      )}

      {/* Settings Form */}
      <form
        onSubmit={handleSave}
        className="bg-white rounded-xl shadow p-6 space-y-6"
      >

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Change Password
          </label>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800">
              Email Notifications
            </p>
            <p className="text-sm text-gray-500">
              Receive updates and alerts
            </p>
          </div>

          <button
            type="button"
            onClick={() => setNotifications(!notifications)}
            className={`w-14 h-7 flex items-center rounded-full p-1 transition ${
              notifications ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white w-5 h-5 rounded-full shadow transform transition ${
                notifications ? "translate-x-7" : ""
              }`}
            />
          </button>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Save Settings
        </button>

      </form>
    </div>
  );
};

export default Settings;
