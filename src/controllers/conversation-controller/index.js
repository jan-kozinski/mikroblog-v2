import { saveConversation, addMessage } from "../../use-cases/index.js";
import makeCreateConv from "./create-conversation.js";
import makeSendMsg from "./send-message.js";
import { token } from "../../drivers/index.js";

const createConv = makeCreateConv({ saveConversation, token });
const sendMsg = makeSendMsg({ addMessage, token });

const convController = Object.freeze({
  saveConversation,
  sendMsg,
});

export default convController;
export { createConv, sendMsg };
