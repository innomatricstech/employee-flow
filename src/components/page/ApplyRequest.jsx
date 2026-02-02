import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  onSnapshot
} from "firebase/firestore";

const ApplyRequest = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [type, setType] = useState("leave");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const [history, setHistory] = useState([]);

  /* ================= SUBMIT REQUEST ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return alert("User not found");
    if (!reason.trim()) return alert("Please enter reason");

    setLoading(true);

    try {
      await addDoc(collection(db, "requests"), {
        employeeId: user.employeeId,
        employeeName: user.name,
        employeeEmail: user.loginEmail,

        type,
        fromDate: type === "leave" ? fromDate : null,
        toDate: type === "leave" ? toDate : null,
        date: type !== "leave" ? date : null,

        reason,
        status: "pending",
        appliedAt: serverTimestamp()
      });

     

      setFromDate("");
      setToDate("");
      setDate("");
      setReason("");
      setType("leave");
    } catch (error) {
      console.error("Submit error:", error);
      alert("Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FETCH HISTORY ================= */
  useEffect(() => {
    if (!user?.loginEmail) return;

    const q = query(
      collection(db, "requests"),
      where("employeeEmail", "==", user.loginEmail)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = [];

        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });

        // ✅ Client-side sort (latest first)
        list.sort((a, b) => {
          const t1 = a.appliedAt?.seconds || 0;
          const t2 = b.appliedAt?.seconds || 0;
          return t2 - t1;
        });

        setHistory(list);
      },
      (error) => {
        console.error("Firestore fetch error:", error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const statusColor = (status) => {
    if (status === "approved") return "bg-green-100 text-green-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">

      {/* ================= APPLY FORM ================= */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
          <h1 className="text-2xl font-bold text-white">Apply Request</h1>
          <p className="text-white/80 text-sm mt-1">
            Leave • Work From Home • Permission
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Type */}
          <div>
            <label className="font-medium">Request Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full mt-1 border rounded-xl p-3"
            >
              <option value="leave">Leave</option>
              <option value="wfh">Work From Home</option>
              <option value="permission">Permission</option>
            </select>
          </div>

          {/* Dates */}
          {type === "leave" ? (
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="border rounded-xl p-3"
                required
              />
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="border rounded-xl p-3"
                required
              />
            </div>
          ) : (
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border rounded-xl p-3 w-full"
              required
            />
          )}

          {/* Reason */}
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            placeholder="Enter reason..."
            className="w-full border rounded-xl p-3"
            required
          />

          {/* Submit */}
          <button
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium"
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>

      {/* ================= HISTORY ================= */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gray-800 p-5">
          <h2 className="text-xl font-semibold text-white">
            My Request History
          </h2>
        </div>

        {history.length === 0 ? (
          <p className="text-center py-10 text-gray-400">
            No requests found
          </p>
        ) : (
          <div className="overflow-x-auto p-6">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-600 text-sm border-b">
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Reason</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((r) => (
                  <tr key={r.id} className="border-b last:border-none">
                    <td className="py-3 capitalize">{r.type}</td>
                    <td className="py-3">
                      {r.type === "leave"
                        ? `${r.fromDate} → ${r.toDate}`
                        : r.date}
                    </td>
                    <td className="py-3 text-gray-600">{r.reason}</td>
                    <td className="py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(
                          r.status
                        )}`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default ApplyRequest;
