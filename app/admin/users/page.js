"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "cashier",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("/api/users");
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await axios.post("/api/users", formData);
      setMessage(`User ${res.data.user.email} created successfully!`);
      setFormData({ name: "", email: "", password: "", role: "cashier" });
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create user");
    }
  };

  const inputClass =
    "w-full bg-slate-50/50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#4988C4] focus:ring-1 focus:ring-[#4988C4] outline-none transition-all";
  const labelClass =
    "block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2";

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            User Management
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage system access and roles
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#4988C4] hover:bg-[#3a75ad] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-md shadow-[#4988C4]/20"
        >
          {showForm ? "Cancel" : "+ Add User"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm mb-8 max-w-2xl">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">
            Create New Account
          </h3>
          {message && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-700 text-sm border border-green-200">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Assign Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="cashier">Cashier</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-[#4988C4] hover:bg-[#3a75ad] text-white py-3 rounded-lg text-sm font-medium transition-all"
            >
              Create User
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              {["Name", "Email", "Role", "Created"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-slate-500">
                  Loading...
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === "admin" ? "bg-purple-50 text-purple-700 border border-purple-200" : "bg-blue-50 text-blue-700 border border-blue-200"}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
