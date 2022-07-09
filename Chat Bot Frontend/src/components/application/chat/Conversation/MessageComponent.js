import React from "react";
import PropTypes from "prop-types";
import { Button, Input } from "antd";
import { useDispatch } from "react-redux";
import { onOptionSelection } from "../../../../redux/chat/chat-actions";
const Search = Input.Search;

const MessageComponent = ({ conversation }) => {
  const dispatch = useDispatch();

  const handleOptionClick = (conversation, e) => {
    e.preventDefault();
    dispatch(onOptionSelection(conversation));
  };
  switch (conversation.component) {
    case "button":
      return (
        <div className="gx-bubble-block">
          <Button
            className="chat-message-button"
            ghost
            onClick={(e) => handleOptionClick(conversation, e)}
          >
            {conversation.message}
          </Button>
        </div>
      );
    case "input":
      return (
        <div className="gx-bubble-block">
          <div className="gx-bubble">
            <div className="gx-input-label">{conversation.message}</div>
            <div
              className="gx-flex-row gx-align-items-center"
              style={{ maxHeight: 51 }}
            >
              <div className="gx-col">
                <div className="gx-form-group">
                {/* <Input size="large" placeholder={conversation.placeHolder||''}/>
                 */}
                 <Search placeholder={conversation.placeHolder||''} enterButton="Send" size="large"/>
                </div>
              </div>
              <i
                className="gx-icon-btn icon icon-sent"
                // onClick={this.submitComment.bind(this)}
              />
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
            <div className="gx-message">{conversation.message}</div>
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
