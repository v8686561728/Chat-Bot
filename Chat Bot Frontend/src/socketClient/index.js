import io from "socket.io-client";
import {config} from '../../constants'

const socket= io.connect(config.API);

export const sendMessage=(data)=>{
    socket.emit("SEND_MESSAGE", data);
}

export default socket