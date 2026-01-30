import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase";

import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  onSnapshot
} from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";

const Messages = () => {

  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState(null);

  // ✅ Logged User
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setUserData(user);
    });
    return unsub;
  }, []);

  // ✅ Fetch ALL Teams
  useEffect(() => {
    const fetchTeams = async () => {
      const snapshot = await getDocs(collection(db, "team"));

      const teamList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setTeams(teamList);
    };

    fetchTeams();
  }, []);

  // ✅ Real-time Chat Fetch
  useEffect(() => {
    if (!selectedTeam) return;

    const q = query(
      collection(db, "team_chats", selectedTeam.id, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setChat(msgs);
    });

    return unsub;

  }, [selectedTeam]);

  // ✅ Send Message
  const sendMessage = async () => {
    if (!message.trim() || !selectedTeam) return;

    await addDoc(
      collection(db, "team_chats", selectedTeam.id, "messages"),
      {
        text: message,
        sender: userData.email,
        createdAt: new Date()
      }
    );

    setMessage("");
  };

  return (
    <div className="p-6 flex gap-6 h-[calc(100vh-80px)]">

      {/* ⭐ TEAM LIST */}
      <div className="w-72 bg-white rounded-xl shadow p-4 overflow-y-auto">
        <h2 className="font-bold mb-4">Teams</h2>

        {teams.map(team => (
          <div
            key={team.id}
            onClick={() => setSelectedTeam(team)}
            className="p-3 rounded-lg cursor-pointer hover:bg-gray-100"
          >
            {team.name || team.id}
          </div>
        ))}
      </div>

      {/* ⭐ CHAT AREA */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow p-4">

        {/* Header */}
        <div className="border-b pb-3 mb-3 font-semibold">
          {selectedTeam ? selectedTeam.name || selectedTeam.id : "Select Team"}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {chat.map(msg => (
            <div key={msg.id}>
              <b>{msg.sender}</b>: {msg.text}
            </div>
          ))}
        </div>

        {/* Input */}
        {selectedTeam && (
          <div className="flex gap-3 mt-4">
            <input
              className="flex-1 border rounded-lg px-3 py-2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type message"
            />

            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-6 rounded-lg"
            >
              Send
            </button>
          </div>
        )}

      </div>

    </div>
  );
};

export default Messages;
