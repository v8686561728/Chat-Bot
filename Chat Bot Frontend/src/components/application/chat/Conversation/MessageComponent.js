import React,{useState} from "react";
import PropTypes from "prop-types";
import parse from 'html-react-parser';
import { Button, Input } from "antd";
const Search = Input.Search;

const MessageComponent = ({ conversation }) => {
  const [readOnly,setReadOnly]=useState(false)

  const handleOptionClick = (conversation, e) => {
    e.preventDefault();
    conversation.handleOptionClick(conversation)
  };
  const handleInput = (value)=>{
    setReadOnly(true)
    conversation.value=value
    conversation.handleInputSubmit(conversation)
  }

  // based on the component type message component is choosen
  switch (conversation.component) {
    case "button":
      return (
        <div className="gx-bubble-block">
          <Button
            className="chat-message-button"
            ghost
            onClick={(e) => handleOptionClick(conversation, e)}
          >
            {conversation.text}
          </Button>
        </div>
      );
    case "input":
      return (
        <div className="gx-bubble-block">
          <div className="gx-bubble">
            <div className="gx-input-label">{conversation.text}</div>
            <div
              className="gx-flex-row gx-align-items-center"
              style={{ maxHeight: 51 }}
            >
              <div className="gx-col">
                <div className="gx-form-group">
                 <Search placeholder={conversation.placeHolder||''} enterButton= {readOnly?"Saved":"Send"} size="large" readOnly={readOnly}  onSearch={(value) => handleInput(value)}/>
                </div>
              </div>
            </div>
            <div className="gx-time gx-text-muted gx-text-right gx-mt-2">
              {conversation.sentAt}
            </div>
          </div>
        </div>
      );
    default:
      return (
        <div className="gx-bubble-block">
          <div className="gx-bubble">
            <div className="gx-message">{parse(conversation.text)}</div>
            <div className="gx-time gx-text-muted gx-text-right gx-mt-2">
              {conversation.sentAt}
            </div>
          </div>
        </div>
      );
  }
};

MessageComponent.propTypes = {};

export default MessageComponent;
