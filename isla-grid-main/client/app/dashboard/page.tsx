"use client";

import { useAuth } from "@/providers/authentication";

const DashboardPage = () => {
  const { user, state, logout } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome to your Dashboard
          </h1>
          <p className="text-gray-600">
            {user?.email ? `Logged in as ${user.email}` : "Loading..."}
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            User Information
          </h2>
          <div className="bg-gray-50 rounded-md p-4 overflow-auto">
            <pre className="text-sm text-gray-700">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        </div>

        {/* Actions */}
        {state === "authenticated" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Quick Actions
            </h2>
            <button
              onClick={logout}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
