import {
  saveConversation,
  addMessage,
  listUserConvs,
} from "../../use-cases/index.js";
import { token } from "../../drivers/index.js";
import makeCreateConv from "./create-conv.js";
import makeSendMsg from "./send-message.js";
import makeGetUserConvs from "./get-user-convs.js";

const createConv = makeCreateConv({ saveConversation, token });
const sendMsg = makeSendMsg({ addMessage, token });
const getUserConvs = makeGetUserConvs({ listUserConvs, token });

const convController = Object.freeze({
  createConv,
  sendMsg,
  getUserConvs,
});

export default convController;
export { createConv, sendMsg, getUserConvs };
