import React, { Suspense, useState, useEffect } from "react";
import { Avatar, Button, Drawer, Input, Tabs } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/common/CircularProgress";
import "../styles/chatScreen.css";
import "../styles/avatar.css";
import "../styles/badge.css";
import bot from "../assets/images/bot.jpg";
import { updateConversation,addMessageToConversation } from "../redux/chat/chat-actions";
import { getConversation } from "../redux/chat/chat-selectors";
import socket from '../socketClient'
const CustomScrollbars = React.lazy(() =>
  import("../components/common/CustomScrollbars")
);
const Conversation = React.lazy(() =>
  import("../components/application/chat/Conversation/index")
);

const selectedUser = {
  name: "Chat Bot",
  thumb: bot,
};

const ChatScreen = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const dispatch = useDispatch();
  const conversationData = useSelector((state)=>getConversation(state))
  useEffect(() => {
    socket.emit("WELCOME_MESSAGE", "welcome");
  }, []);
  useEffect(() => {
    socket.on("RECEIVE_MESSAGE", (data) => {
      dispatch(addMessageToConversation(data))
    });
  }, [socket]);

  const handleChatOpen = (value, e) => {
    e.preventDefault();
    setChatOpen(value);
  };

  // const sendMessage = (e) => {
  //   e.preventDefault();
  //   socket.emit("SEND_MESSAGE", {
  //     type: "sent",
  //     message: "English versions from the 1914 translation by H. Rackham",
  //     sentAt: new Date().getTime(),
  //   });
  // };

  const onOptionClick = () =>{

  }
  const onInputChange = ()=>{

  }
  return (
    <div className={chatOpen ? "gx-chat-main" : "gx-right-corner"}>
      {chatOpen && (
        <span className="gx-close" onClick={(e) => handleChatOpen(false, e)}>
          X
        </span>
      )}
      {chatOpen ? (
        <div className="container">
          <Suspense fallback={<>Loading...</>}>
            <div className="gx-chat-container">
              <div className="gx-chat-main-header">
                <span className="gx-d-block gx-d-lg-none gx-chat-btn">
                  <i
                    className="gx-icon-btn icon icon-chat"
                    //  onClick={this.onToggleDrawer.bind(this)}
                  />
                </span>
                <div className="gx-chat-main-header-info">
                  <div className="gx-chat-avatar gx-mr-2">
                    <div className="gx-status-pos">
                      <Avatar
                        src={selectedUser.thumb}
                        className="gx-rounded-circle gx-size-60"
                        alt=""
                      />
                      <span className={`gx-status gx-active`} />
                    </div>
                  </div>

                  <div className="gx-chat-contact-name">
                    {selectedUser.name}
                  </div>
                </div>
              </div>

              <CustomScrollbars className="gx-chat-list-scroll">
                {console.log(conversationData,"chat")}
                <Conversation
                  conversationData={conversationData}
                  selectedUser={selectedUser}
                />
              </CustomScrollbars>

              <div className="gx-chat-main-footer">
                <div className="gx-flex-row gx-align-items-center">
                  <div className="gx-col">
                    <div className="gx-form-group">
                      <input
                        id="required"
                        className="gx-border-0 ant-input gx-chat-textarea"
                        //   onKeyUp={this._handleKeyPress.bind(this)}
                        //   onChange={this.updateMessageValue.bind(this)}
                        //   value={message}
                        placeholder="Type and hit enter to send message"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Suspense>
        </div>
      ) : (
        <div onClick={(e) => handleChatOpen(true, e)}>
          <Avatar
            src={selectedUser.thumb}
            className="gx-rounded-circle gx-size-60 "
            alt=""
          />
        </div>
      )}
    </div>
  );
};

export default ChatScreen;
