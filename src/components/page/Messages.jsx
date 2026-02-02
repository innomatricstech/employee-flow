import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collectionGroup,
  query,
  orderBy,
  onSnapshot
} from "firebase/firestore";

const EmployeeMessages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const q = query(
      collectionGroup(db, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMessages(list);
      },
      (error) => {
        console.error("Employee Firestore error:", error);
      }
    );

    return () => unsub();
  }, []);

  return (
    <div>
      <h2>Employee Messages</h2>
      {messages.map(m => (
        <div key={m.id}>
          <b>{m.senderName}</b>: {m.text}
        </div>
      ))}
    </div>
  );
};

export default EmployeeMessages;
