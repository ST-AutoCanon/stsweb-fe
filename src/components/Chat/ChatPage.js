import React, { useState } from "react";
import { SocketProvider } from "./SocketContext";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import GroupModal from "./GroupModal";
import "./ChatPage.css";

export default function ChatPage({ userId }) {
  const [activeRoom, setActiveRoom] = useState(null);
  const [showGroupModal, setShowGroupModal] = useState(false);

  return (
    <SocketProvider userId={userId}>
      <div className={`chat-page${activeRoom ? " chat-active" : ""}`}>
        <ChatList
          onSelect={(room) => {
            if (room.isNew) setShowGroupModal(true);
            else setActiveRoom(room);
          }}
        />

        {activeRoom ? (
          <ChatWindow room={activeRoom} userId={userId} />
        ) : (
          <div className="chat-placeholder">Select or create a chat</div>
        )}

        {showGroupModal && (
          <GroupModal
            onCreate={() => setShowGroupModal(false)}
            onClose={() => setShowGroupModal(false)}
          />
        )}
      </div>
    </SocketProvider>
  );
}
