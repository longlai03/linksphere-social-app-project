import React from "react";
import MessageList from "./components/MessageList";
import MessageChat from "./components/MessageChat";

const Messages = () => {
  return (
    <div className="flex w-full h-full min-h-[100vh] min-w-0 flex-1">
      <div className="w-[360px] border-r min-w-0">
        <MessageList />
      </div>
      <div className="flex-1 min-w-0">
        <MessageChat />
      </div>
    </div>
  );
};

export default Messages;