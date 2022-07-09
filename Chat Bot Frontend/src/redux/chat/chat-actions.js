import * as constants from './chat-constants'
import { getConversation } from './chat-selectors'
import {sendMessage} from '../../socketClient'
export const updateConversation = (data)=>({type:constants.UPDATE_CONVERSATION,data})

export const onOptionSelection = (data)=>{
    return (dispatch,getState)=>{
       let oldConversation = getConversation(getState())
       let newConversation = oldConversation.map((message)=>{
        if(message.questionCode===data.questionCode){
            message.slectedAnswer=data.optionCode
        }
        return message
       })
       data.type='sent'
       delete data['component']
       sendMessage(data)
       dispatch(updateConversation(newConversation))
    }
}

export const addMessageToConversation = (data) =>{
    return (dispatch,getState)=>{
        let oldConversation = getConversation(getState())
        let newConversation = [...oldConversation,...data]
      
        dispatch(updateConversation(newConversation))
     }
}

