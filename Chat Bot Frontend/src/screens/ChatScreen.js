import React, { Suspense, useState, useEffect } from "react";
import { Avatar, Button, Drawer, Input, Tabs } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Pusher from "pusher-js";
import "../styles/chatScreen.css";
import "../styles/avatar.css";
import "../styles/badge.css";
import bot from "../assets/images/bot.jpg";
import { config } from "../../constants";
import {
  addMessageToConversation,
  createChannel,
} from "../redux/chat/chat-actions";
import {
  getChannelId,
  getConversation,
  getSubscriptionChannel,
  getUserId,
} from "../redux/chat/chat-selectors";
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
  const [chatOpen, setChatOpen] = useState(false); // controls modal open/close
  const dispatch = useDispatch();
  const conversationData = useSelector((state) => getConversation(state));
  const userId = useSelector((state) => getUserId(state));
  const subscriptionChannel = useSelector((state) =>
    getSubscriptionChannel(state)
  );
  const channelId = useSelector((state) => getChannelId(state));
  const [channel, setChannel] = useState(); // pusher channel instance

  useEffect(() => {
    dispatch(createChannel()); // user id creation / channel id creation
  }, []);

  // when a user id is changed a new instance is created
  useEffect(() => {
    if (userId) {
      const client = new Pusher(config.KEY, {
        authEndpoint: `${config.AUTH_URL}?userid=${userId}`,
        cluster: config.CLUSTER,
        encrypted: true,
      });
      setChannel(client.subscribe(subscriptionChannel));
    }
  }, [userId]);

  useEffect(() => {
    // server event is binded with the client
    if (channel) {
      channel.bind("pusher:subscription_succeeded", () => {
        channel.trigger("client-widget-message", {
          message: { lastMessageTimeStamp: new Date().getTime() },
          senderId: userId,
          channelName: channelId,
        });
      });
      channel.bind("server-message", (data) => {
        const result = modifyData(data);
        dispatch(addMessageToConversation(result));
        result.map((message) => {
          if (message.component === "text") {
            channel.trigger("client-widget-message", {
              message: { lastMessageTimeStamp: new Date().getTime() },
              senderId: userId,
              channelName: channelId,
            });
          }
        });
      });
    }
  }, [channel]);

  // modifies the data to event specific data
  const modifyData = (data) => {
    let result = [];
    data?.messages.map((message) => {
      if (message.buttons) {
        result = message.buttons.states.map((state) => {
          return {
            type: "sent",
            text: state.text,
            component: "button",
            sentAt: new Date().getTime(),
            optionCode: message.buttons.key,
            handleOptionClick,
          };
        });
      } else {
        switch (message.type) {
          case "text":
            result.push({
              type: data.sender.id === "bot" ? "recieved" : "sent",
              text: message.text,
              component: "text",
              sentAt: new Date().getTime(),
            });
            break;
          case "input":
            message.input.map((field) => {
              result.push({
                type: data.sender.id === "bot" ? "recieved" : "sent",
                text: field.name,
                placeHolder: `Enter ${field.name}`,
                key: field.key,
                component: "input",
                sentAt: new Date().getTime(),
                handleInputSubmit,
              });
            });

            break;
        }
      }
    });
    return result;
  };

  // triggers an client event when button is clicked
  const handleOptionClick = (data) => {
    let timeStamp = new Date().getTime();
    let eventData = {
      senderId: userId,
      channelName: channelId,
      message: {
        [data.optionCode]: [data.text],
        lastMessageTimeStamp: timeStamp,
      },
      display: {
        img: "https://staging-uploads.insent.ai/insentstaging/logo-insentstaging-1653120577857?1653120577919",
        name: null,
        lastMessageTimeStamp: timeStamp,
        lead: true,
        time: timeStamp,
        type: "text",
        userId: "bot",
        key: data.optionCode,
        channelId: channelId,
        text: data.text,
      },
    };
    channel.trigger("client-widget-message", eventData);
  };

  // triggers an client event when input is submitted
  const handleInputSubmit = (data) => {
    let timeStamp = new Date().getTime();
    let eventData = {
      senderId: userId,
      channelName: channelId,
      message: {
        [data.type]: data.value,
        lastMessageTimeStamp: timeStamp,
      },
      display: {
        img: "https://staging-uploads.insent.ai/insentstaging/logo-insentstaging-1653120577857?1653120577919",
        name: "Discuter",
        lastMessageTimeStamp: timeStamp,
        lead: false,
        time: timeStamp,
        type: "input",
        userId: "bot",
        input: {
          key: data.type,
          type: data.type,
          text: data.Text,
          validateDomains: true,
          value: data.value,
          disabled: true,
        },
        channelId: channelId,
      },
    };
    channel.trigger("client-widget-message", eventData);
  };

  // handles chat model open and close
  const handleChatOpen = (value, e) => {
    e.preventDefault();
    setChatOpen(value);
  };

  const handleReset = () => {
    let timeStamp = new Date().getTime();
    const eventData = {
      senderId: userId,
      channelName: channelId,
      message: {
        text: "@Discuter",
      },
      display: {
        img: null,
        name: null,
        lead: true,
        text: "@Discuter",
        time: timeStamp,
        type: "text",
      },
    };
    const message = [{ type: "sent", text: "@Discuter" }];
    dispatch(addMessageToConversation(message));
    channel.trigger("client-widget-message", eventData);
  };
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
                <Conversation
                  conversationData={conversationData}
                  selectedUser={selectedUser}
                />
              </CustomScrollbars>

              <div className="gx-chat-main-footer">
                <div className="gx-flex-row gx-align-items-center">
                  <div className="gx-col">
                    <div className="gx-form-group" onClick={handleReset}>
                      Restart conversation
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
