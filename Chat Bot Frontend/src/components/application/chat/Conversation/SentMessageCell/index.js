import React from "react";
import MessageComponent from "../MessageComponent";
const SentMessageCell = ({ conversation }) => {
  return (
    <div className="gx-chat-item gx-flex-row-reverse">
      <MessageComponent conversation={conversation} />
    </div>
  );
};

export default SentMessageCell;
