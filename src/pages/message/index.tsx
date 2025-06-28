import { useParams } from "react-router-dom";
import MessageChat from "./components/MessageChat";
import MessageList from "./components/MessageList";

const Messages = () => {
  const { conversationId } = useParams();

  return (
    <div className="flex w-full h-full min-h-[100vh] min-w-0 flex-1">
      <div className="w-[360px] border-r min-w-0 max-h-[100vh]">
        <MessageList />
      </div>
      <div className="flex-1 min-w-0 max-h-[100vh]">
        <MessageChat conversationId={conversationId} />
      </div>
    </div>
  );
};

export default Messages;