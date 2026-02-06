import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import {
  collection,
  addDoc,
  setDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  getDoc
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { getChatId } from "../../utils/chatId";

export default function EmployeeChat() {
  const [employeeId, setEmployeeId] = useState(null);
  const [adminId, setAdminId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      setEmployeeId(user.uid);

      // 🔥 THIS MUST EXIST
      const empDoc = await getDoc(doc(db, "team", user.uid));
      if (!empDoc.exists()) {
        alert("Employee not linked to admin");
        return;
      }

      setAdminId(empDoc.data().adminId);
    });
  }, []);

  const chatId = getChatId(employeeId, adminId);

  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp")
    );

    return onSnapshot(q, snap => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, [chatId]);

  const send = async () => {
    if (!text.trim() || !chatId) return;

    await setDoc(
      doc(db, "chats", chatId),
      {
        adminId,
        employeeId,
        lastMessage: text,
        lastUpdated: serverTimestamp(),
      },
      { merge: true }
    );

    await addDoc(collection(db, "chats", chatId, "messages"), {
      text,
      senderRole: "employee",
      senderId: employeeId,
      timestamp: serverTimestamp(),
    });

    setText("");
  };

  return (
    <div>
      <h3>Employee Chat</h3>

      {messages.map(m => (
        <div key={m.id}>{m.text}</div>
      ))}

      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={send}>Send</button>
    </div>
  );
}
