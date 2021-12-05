// import { Server } from 'http';
// import { beforeEach, describe } from "mocha";
// import { Message, MessageAction, MessageType } from "../../../src/client/javascript/webrtc-base/models/message";
// import { Socket } from "socket.io";
// import * as TypeMoq from "typemoq";
// import { SocketClient } from '../../../src/server/clients/socket-client';
//
// describe('SocketClient', () => {
//   let socketMock: TypeMoq.IMock<Socket>;
//   let serverMock: TypeMoq.IMock<Server>
//
//   const ID = "id1";
//
//   beforeEach(() => {
//     socketMock = TypeMoq.Mock.ofType<Socket>();
//     socketMock.setup(x => x.to(TypeMoq.It.isAnyString())).returns(() => socketMock.object);
//     socketMock.setup(x => x.id).returns(() => ID);
//
//   });
//
//   it('should relay messages to others in room', async () => {
//     let message = new Message(ID, MessageType.Data, MessageAction.Answer, "content");
//     let rooms = { ID: "socket1", "id2": "socket2" };
//     socketMock.setup((x) => x.rooms).returns(() => rooms);
//
//     socketClient.connection(message);
//     socketMock.verify(x => x.to("id2"), TypeMoq.Times.once());
//     socketMock.verify(x => x.to("id1"), TypeMoq.Times.never());
//
//   })
//
// });
