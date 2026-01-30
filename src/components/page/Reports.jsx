import React, { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { 
  HiPaperAirplane, 
  HiDocumentAdd, 
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlineSparkles,
  HiOutlineCheckCircle
} from "react-icons/hi";

const Reports = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("daily");
  const [priority, setPriority] = useState("medium");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("User not logged in");
        return;
      }

      setLoading(true);

      await addDoc(collection(db, "reports"), {
        title,
        description,
        category,
        priority,
        name: user.name || "",
        employeeId: user.employeeId || "",
        loginEmail: user.loginEmail || "",
        createdAt: serverTimestamp(),
      });

      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setTitle("");
      setDescription("");
      setCategory("daily");
      setPriority("medium");

    } catch (error) {
      console.error("Error saving report:", error);
      alert("Error saving report");
    } finally {
      setLoading(false);
    }
  };

  // Get user info for header
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <HiDocumentAdd className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent">
                Submit New Report
              </h1>
              <p className="text-gray-600 mt-1">Share your daily progress and achievements</p>
            </div>
          </div>

          {/* User Info Card */}
          {user && (
            <div className="bg-gradient-to-r from-white to-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <HiOutlineUser className="text-xl text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{user.name || "User"}</h3>
                  <div className="flex flex-wrap gap-4 mt-1">
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      ID: {user.employeeId || "N/A"}
                    </span>
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <HiOutlineCalendar className="text-blue-500" />
                      {new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Success Message */}
        {submitted && (
          <div className="mb-6 animate-in slide-in-from-top">
            <div className="bg-gradient-to-r from-green-50 to-emerald-100 border border-green-200 rounded-xl p-4 flex items-center gap-3">
              <HiOutlineCheckCircle className="text-2xl text-green-600" />
              <div>
                <h4 className="font-semibold text-green-800">Report Submitted Successfully!</h4>
                <p className="text-green-600 text-sm">Your report has been saved and shared with the team</p>
              </div>
              <div className="ml-auto">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                  <HiOutlineSparkles className="text-white" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <HiDocumentAdd />
              Report Details
            </h2>
            <p className="text-blue-100 text-sm mt-1">Fill in your report details below</p>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Category & Priority */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Report Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["daily", "weekly", "monthly", "special"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-4 py-3 rounded-lg border transition-all ${
                        category === cat
                          ? "bg-blue-50 border-blue-500 text-blue-700 font-medium"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Priority Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "low", label: "Low", color: "bg-green-100 text-green-700 border-green-200" },
                    { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
                    { value: "high", label: "High", color: "bg-red-100 text-red-700 border-red-200" }
                  ].map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => setPriority(level.value)}
                      className={`px-4 py-3 rounded-lg border font-medium transition-all ${
                        priority === level.value ? level.color : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Report Title *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Project Alpha Completion, Client Meeting Summary"
                  className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                  {title.length}/100
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Detailed Description *
              </label>
              <div className="relative">
                <textarea
                  required
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your accomplishments, challenges, and plans for tomorrow..."
                  className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                  {description.length}/500
                </div>
              </div>
            </div>

            {/* Character Counter & Tips */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                <HiOutlineSparkles className="text-blue-600" />
                Tips for a great report:
              </h4>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Be specific about accomplishments and challenges</li>
                <li>• Mention any blockers or assistance needed</li>
                <li>• Include plans for the next day/week</li>
                <li>• Add relevant metrics or data when available</li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting Report...
                  </>
                ) : (
                  <>
                    <HiPaperAirplane className="text-xl group-hover:animate-pulse" />
                    Submit Report
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            {/* Form Footer */}
            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                All reports are timestamped and visible to authorized team members
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Reports;