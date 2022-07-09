import React from "react";
import { Avatar } from "antd";
import bot from "../../../../../assets/images/bot.jpg";
import MessageComponent from "../MessageComponent";
import SentMessageCell from "../SentMessageCell";

const ReceivedMessageCell = ({ conversation }) => {
  return (
    <>
    <div className="gx-chat-item">
      <Avatar className="gx-size-40 gx-align-self-end" src={bot} alt="" />
      <MessageComponent conversation={conversation} />
   
    </div>
    {
       !conversation.slectedAnswer && conversation.options && conversation.options.map((option,index)=>{
         return <SentMessageCell key={index} conversation={option}/> 
        })
      }
    </>
  );
};

export default ReceivedMessageCell;
