// TODO: Delete file because it is already tested on socket-room.service

/* eslint-disable max-lines */ // we want to make sure that we did not forget any valuable tests
/* eslint-disable dot-notation */ // we want to access private attribute to test
// import { Player } from '@app/classes/player';
// import { Room } from '@app/classes/room-model/room';
// import { SocketMock } from '@app/classes/socket-mock';
// import { WordFetcher } from '@app/classes/virtual-placement-logic/word-fetcher';
// import { VirtualPlayer } from '@app/classes/virtual-player/virtual-player';
// import { Server } from 'app/server';
// import { assert, expect } from 'chai';
// import * as sinon from 'sinon';
// import { io as ioClient, Socket } from 'socket.io-client';
// import { Container } from 'typedi';
// // import { SocketManager } from './socket-manager.service';
// import { SocketRoomService } from './socket-room.service';

// const RESPONSE_DELAY = 200;

// describe.only('socketRoomService service tests', () => {
//     let socketRoomService: SocketRoomService;
//     // let socketManager: SocketManager;
//     // let server: Server;
//     let clientSocket: Socket;
//     let clientSocket2: Socket;
//     let roomMock: Room;
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any -- we need to mock io.Socket and use it to call socketRoomService methods
//     let socketMock: any;
//     let firstPlayer: Player;
//     let secondPlayer: Player;

//     const urlString = 'http://localhost:3000';

//     let isRoomNameValidStub: sinon.SinonStub;
//     let getRoomStub: sinon.SinonStub;
//     let getPlayerStub: sinon.SinonStub;
//     let removePlayerStub: sinon.SinonStub;

//     const server = Container.get(Server);

//     beforeEach(() => {
//         // Accessing the (private) method that connects to the DB is necessary
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any -- We don't want to connect to the DB for no reason
//         // sinon.stub(server, 'connectToDatabase' as any).resolves();
//         // server.init();
//         // sinon.stub(server.socketManager, 'elaborateMap').resolves();

//         // socketManager = server.socketManager;
//         socketRoomService = server.socketManager['socketRoomService'];
//         clientSocket = ioClient(urlString);
//         clientSocket2 = ioClient(urlString);
//         firstPlayer = new Player('socketId1', 'pseudo1', true);
//         secondPlayer = new Player('socketId2', 'pseudo2', false);
//         roomMock = new Room();
//         roomMock.roomInfo.name = 'Room0';
//         roomMock.bot = {
//             playTurn: () => {
//                 // eslint-disable-next-line @typescript-eslint/no-explicit-any -- we want to mock the virtual player to only have this method
//                 return '' as any;
//             },
//         } as VirtualPlayer;
//         socketMock = new SocketMock();
//     });

//     beforeEach(() => {
//         isRoomNameValidStub = sinon.stub(socketRoomService.roomService, 'isRoomNameValid').callsFake(() => {
//             return true;
//         });
//         getRoomStub = sinon.stub(socketRoomService.roomService, 'getRoom').callsFake(() => {
//             return roomMock;
//         });
//         sinon.stub(roomMock, 'changePlayerTurn').callsFake(() => {
//             return true;
//         });
//         sinon.stub(roomMock, 'getCurrentPlayerTurn').callsFake(() => {
//             return firstPlayer;
//         });
//         sinon.stub(socketRoomService, 'getSocketRoom').callsFake(() => {
//             return roomMock.roomInfo.name;
//         });
//         sinon.stub(socketRoomService.commandController, 'hasCommandSyntax').callsFake(() => {
//             return true;
//         });
//         sinon.stub(socketRoomService.commandController, 'executeCommand').callsFake(() => {
//             return undefined;
//         });
//         getPlayerStub = sinon.stub(roomMock, 'getPlayer').callsFake(() => {
//             return firstPlayer;
//         });
//         removePlayerStub = sinon.stub(roomMock, 'removePlayer').callsFake(() => {
//             return;
//         });
//     });

//     afterEach(() => {
//         clientSocket.close();
//         clientSocket2.close();
//         // socketManager.sio.close();
//         sinon.restore();
//     });

//     describe('Bot tests', () => {
//         let createRoomSpy: sinon.SinonSpy;
//         let socketJoinSpy: sinon.SinonSpy;
//         let sendToEveryoneInRoomSpy: sinon.SinonSpy;

//         beforeEach(() => {
//             createRoomSpy = sinon.spy(socketRoomService.roomService, 'createRoom');
//             socketJoinSpy = sinon.spy(socketRoomService, 'socketJoin');
//             sendToEveryoneInRoomSpy = sinon.spy(socketRoomService, 'sendToEveryoneInRoom');

//             // getRoomStub = sinon.stub(socketRoomService.roomService, 'getRoom');
//         });
//         describe('handleJoinRoomSolo tests', () => {
//             it('should call the correct methods on handleJoinRoomSolo', () => {
//                 roomMock.roomInfo.isSolo = true;
//                 socketRoomService.handleJoinRoomSolo(socketMock, roomMock);
//                 assert(createRoomSpy.called, 'did not call roomService.createRoom on handleJoinRoomSolo');
//                 assert(socketJoinSpy.called, 'did not call socketRoomService.socketJoin on handleJoinRoomSolo');
//                 assert(sendToEveryoneInRoomSpy.called, 'did not call socketRoomService.sendToEveryoneInRoom on handleJoinRoomSolo');
//             });

//             it('should not call socketJoin on handleJoinRoomSolo if there are no room', () => {
//                 // eslint-disable-next-line @typescript-eslint/no-explicit-any -- want to set an undefined room
//                 const undefinedRoom: any = undefined;
//                 socketRoomService.handleJoinRoomSolo(socketMock, undefinedRoom);
//                 assert(socketJoinSpy.notCalled, 'called socketRoomService.socketJoin on handleJoinRoomSolo with empty room');
//             });

//             it('should not call socketJoin on handleJoinRoomSolo if the room is not a solo room', () => {
//                 roomMock.roomInfo.isSolo = false;
//                 socketRoomService.handleJoinRoomSolo(socketMock, roomMock);
//                 assert(socketJoinSpy.notCalled, 'called socketRoomService.socketJoin on handleJoinRoomSolo with a room that is not solo');
//             });
//         });

//         describe('handleJoinRoomSoloBot tests', () => {
//             it('should call the correct methods on handleJoinRoomSoloBot', () => {
//                 const wordFetcherMock = {} as WordFetcher;
//                 const createPlayerVirtualSpy = sinon.spy(roomMock, 'createPlayerVirtual');
//                 const setUnavailableSpy = sinon.spy(socketRoomService.roomService, 'setUnavailable');
//                 const sendToEveryoneSpy = sinon.spy(socketRoomService, 'sendToEveryone');

//                 getRoomStub.callsFake(() => {
//                     return roomMock;
//                 });

//                 socketRoomService.handleJoinRoomSoloBot(
//                     socketMock,
//                     { roomName: roomMock.roomInfo.name, botName: 'bot', isExpertLevel: false },
//                     wordFetcherMock,
//                 );
//                 assert(createPlayerVirtualSpy.called, 'did not call room.createPlayerVirtual on handleJoinRoomSoloBot');
//                 assert(socketJoinSpy.called, 'did not call socketRoomService.socketJoin on handleJoinRoomSoloBot');
//                 assert(sendToEveryoneInRoomSpy.called, 'did not call socketRoomService.sendToEveryoneInRoom on handleJoinRoomSoloBot');
//                 assert(setUnavailableSpy.called, 'did not call roomService.setUnavailable on handleJoinRoomSoloBot');
//                 assert(sendToEveryoneSpy.called, 'did not call socketRoomService.sendToEveryone on handleJoinRoomSoloBot');
//             });

//             it('should not call createPlayerVirtual on handleJoinRoomSoloBot if there is no roomName', () => {
//                 const wordFetcherMock = {} as WordFetcher;
//                 // eslint-disable-next-line @typescript-eslint/no-explicit-any -- want to set an undefined room
//                 const undefinedRoomName: any = undefined;
//                 const createPlayerVirtualSpy = sinon.spy(roomMock, 'createPlayerVirtual');

//                 socketRoomService.handleJoinRoomSoloBot(
//                     socketMock,
//                     { roomName: undefinedRoomName, botName: 'bot', isExpertLevel: false },
//                     wordFetcherMock,
//                 );
//                 assert(createPlayerVirtualSpy.notCalled, 'called room.createPlayerVirtual on handleJoinRoomSoloBot with an undefined roomName');
//             });
//             it('should not call createPlayerVirtual on handleJoinRoomSoloBot if there is no room', () => {
//                 const wordFetcherMock = {} as WordFetcher;
//                 const createPlayerVirtualSpy = sinon.spy(roomMock, 'createPlayerVirtual');
//                 getRoomStub.callsFake(() => {
//                     return undefined;
//                 });
//                 socketRoomService.handleJoinRoomSoloBot(
//                     socketMock,
//                     { roomName: roomMock.roomInfo.name, botName: 'bot', isExpertLevel: false },
//                     wordFetcherMock,
//                 );
//                 assert(createPlayerVirtualSpy.notCalled, 'called room.createPlayerVirtual on handleJoinRoomSoloBot with an undefined room');
//             });
//         });
//     });
//     describe('JoinRoom event tests', () => {
//         it('Should handle room creation correctly on joinRoom', (done) => {
//             const spy1 = sinon.spy(socketRoomService.roomService, 'createRoom');
//             const spy2 = sinon.spy(socketRoomService, 'socketJoin');
//             const spy3 = sinon.spy(socketRoomService, 'sendToEveryoneInRoom');
//             const spy4 = sinon.spy(socketRoomService, 'sendToEveryone');
//             socketRoomService.handleJoinRoom(socketMock, roomMock);
//             setTimeout(() => {
//                 assert(spy1.called, 'did not call roomService.createRoom on joinRoom');
//                 assert(spy2.called, 'did not call socketRoomService.socketJoin on joinRoom');
//                 assert(spy3.called, 'did not call socketRoomService.sendToEveryoneInRoom on joinRoom');
//                 assert(spy4.called, 'did not call socketRoomService.sendToEveryone on joinRoom');
//                 done();
//             }, RESPONSE_DELAY);
//         });

//         it('Should not call createRoom on joinRoom if room does not exist', (done) => {
//             const spy = sinon.spy(socketRoomService.roomService, 'createRoom');
//             // eslint-disable-next-line @typescript-eslint/no-explicit-any -- we want to test undefined as parameter
//             socketRoomService.handleJoinRoom(socketMock, undefined as any);
//             setTimeout(() => {
//                 assert(spy.notCalled, 'called roomService.createRoom on joinRoom with an empty room');
//                 done();
//             }, RESPONSE_DELAY);
//         });
//     });

//     describe('leaveRoomCreator tests', () => {
//         it('Should remove the room on leaveRoomCreator', (done) => {
//             socketRoomService.roomService.roomsAvailable = [roomMock];
//             const roomSize = socketRoomService.roomService.getNumberOfRooms();
//             socketRoomService.handleLeaveRoomCreator(socketMock, roomMock.roomInfo.name);
//             setTimeout(() => {
//                 expect(socketRoomService.roomService.getNumberOfRooms()).to.equal(roomSize - 1);
//                 done();
//             }, RESPONSE_DELAY);
//         });

//         it('Should not remove a room on leaveRoomCreator with an invalid room name', (done) => {
//             socketRoomService.roomService.roomsAvailable = [roomMock];
//             const roomSize = socketRoomService.roomService.getNumberOfRooms();
//             socketRoomService.handleLeaveRoomCreator(socketMock, 'invalidName');
//             setTimeout(() => {
//                 expect(socketRoomService.roomService.getNumberOfRooms()).to.equal(roomSize);
//                 done();
//             }, RESPONSE_DELAY);
//         });
//     });

//     describe('leaveRoomOther tests', () => {
//         it('Should remove the room from the socket on leaveRoomOther', (done) => {
//             const spy = sinon.spy(socketRoomService, 'socketLeaveRoom');
//             socketRoomService.handleLeaveRoomOther(socketMock, roomMock.roomInfo.name);
//             setTimeout(() => {
//                 assert(spy.called, 'did not call socketLeaveRoom');
//                 done();
//             }, RESPONSE_DELAY);
//         });

//         it('Should not remove the room of roomService on leaveRoomOther', (done) => {
//             socketRoomService.roomService.roomsAvailable = [roomMock];
//             const roomSize = socketRoomService.roomService.getNumberOfRooms();
//             socketRoomService.handleLeaveRoomOther(socketMock, roomMock.roomInfo.name);
//             setTimeout(() => {
//                 expect(socketRoomService.roomService.getNumberOfRooms()).to.equal(roomSize);
//                 done();
//             }, RESPONSE_DELAY);
//         });
//     });

//     describe('askToJoin tests', () => {
//         beforeEach(() => {
//             roomMock.players = [firstPlayer];
//         });

//         it('Should add the socket a room on askToJoin', (done) => {
//             // sinon.stub(socketRoomService.roomService, 'getRoom').callsFake(() => {
//             //     return roomMock;
//             // });
//             const spy1 = sinon.spy(socketRoomService, 'socketJoin');
//             const spy2 = sinon.spy(roomMock, 'addPlayer');
//             socketRoomService.handleAskToJoin(socketMock, roomMock);
//             setTimeout(() => {
//                 assert(spy1.called, 'did not call socketJoin on askToJoin');
//                 assert(spy2.called, 'did not call roomMock.addPlayer on askToJoin');
//                 done();
//             }, RESPONSE_DELAY);
//         });

//         it('Should not add the socket a room on askToJoin if the room is undefined', (done) => {
//             const spy = sinon.spy(socketRoomService.roomService, 'setUnavailable');
//             // eslint-disable-next-line @typescript-eslint/no-explicit-any -- We must test behavior on undefined
//             socketRoomService.handleAskToJoin(socketMock, undefined as any);
//             setTimeout(() => {
//                 const newRoomSize = socketRoomService.sio.sockets.adapter.rooms.get(roomMock.roomInfo.name)?.size;
//                 expect(newRoomSize).to.equal(undefined);
//                 assert(spy.notCalled, 'Called roomService.setUnavailable on askToJoin even if the room was undefined');
//                 done();
//             }, RESPONSE_DELAY);
//         });

//         it('should increase the number of unavailableRoom and decrease the number of AvailableRooms on askToJoin', (done) => {
//             socketRoomService.roomService.roomsAvailable = [roomMock];
//             const numberOfUnavailableRooms = socketRoomService.roomService.getRoomsUnavailable().length;
//             const numberOfAvailableRooms = socketRoomService.roomService.getRoomsAvailable().length;
//             roomMock.players = [firstPlayer];

//             socketRoomService.handleAskToJoin(socketMock, roomMock);
//             setTimeout(() => {
//                 expect(socketRoomService.roomService.getRoomsUnavailable().length).to.equal(numberOfUnavailableRooms + 1);
//                 expect(socketRoomService.roomService.getRoomsAvailable().length).to.equal(numberOfAvailableRooms - 1);
//                 done();
//             }, RESPONSE_DELAY);
//         });
//     });

//     describe('rejectPlayer', () => {
//         it('Should emit playerRejected to the room on rejectPlayer', (done) => {
//             const spy = sinon.spy(socketRoomService, 'socketEmitRoom');
//             socketRoomService.handleRejectPlayer(socketMock, roomMock);
//             setTimeout(() => {
//                 assert(spy.called, 'did not call socketEmitRoom on rejectPlayer');
//                 done();
//             }, RESPONSE_DELAY);
//         });

//         it('Should not emit playerRejected on rejectPlayer if the room is undefined', (done) => {
//             const spy = sinon.spy(socketRoomService, 'socketEmitRoom');
//             // eslint-disable-next-line @typescript-eslint/no-explicit-any -- We must test behavior on undefined
//             socketRoomService.handleRejectPlayer(socketMock, undefined as any);
//             setTimeout(() => {
//                 assert(spy.notCalled, 'Called socketEmitRoom on rejectPlayer even if the room was undefined');
//                 done();
//             }, RESPONSE_DELAY);
//         });
//     });

//     describe('SetRoomAvailable tests', () => {
//         it('should call the correct methods on setRoomAvailable', (done) => {
//             const spy1 = sinon.spy(socketRoomService.roomService, 'setAvailable');
//             const spy2 = sinon.spy(socketRoomService.sio.sockets, 'emit');
//             socketRoomService.handleSetRoomAvailable(socketMock, roomMock.roomInfo.name);
//             setTimeout(() => {
//                 assert(spy1.called, 'did not call socketRoomService.roomService.setAvailable on setAvailable');
//                 assert(spy2.called, 'did not call sio.sockets.emits on setAvailable');
//                 done();
//             }, RESPONSE_DELAY);
//         });
//     });

//     describe('availableRooms tests', () => {
//         it('Should call socketRoomService.sio.to on availableRooms', (done) => {
//             const spy = sinon.spy(socketRoomService.sio, 'to');
//             socketRoomService.handleAvailableRooms(socketMock);
//             setTimeout(() => {
//                 assert(spy.called, 'did not call socketRoomService.sio.to on joinRoom');
//                 done();
//             }, RESPONSE_DELAY);
//         });
//     });

//     describe('leaveRoomOther tests', () => {
//         it('Should call the correct methods on leaveRoomOther', (done) => {
//             roomMock.players = [firstPlayer, secondPlayer];
//             const socketsEmitStub = sinon.stub(socketRoomService.sio.sockets, 'emit').callsFake(() => {
//                 return false;
//             });
//             socketRoomService.handleLeaveRoomOther(socketMock, roomMock.roomInfo.name);
//             setTimeout(() => {
//                 assert(isRoomNameValidStub.called, 'did not call socketRoomService.isRoomNameValid on leaveRoomOther');
//                 assert(getRoomStub.called, 'did not call socketRoomService.roomService.getRoom on leaveRoomOther');
//                 assert(getPlayerStub.called, 'did not call roomMock.getPlayer on leaveRoomOther');
//                 assert(removePlayerStub.called, 'did not call roomMock.removePlayer on leaveRoomOther');
//                 assert(socketsEmitStub.called, 'did not call sio.sockets.emit on leaveRoomOther');
//                 done();
//             }, RESPONSE_DELAY);
//         });
//     });

//     describe('askToJoin tests', () => {
//         beforeEach(() => {
//             roomMock.players = [firstPlayer];
//         });
//         it('Should call setUnavailable on askToJoin', (done) => {
//             roomMock.players = [firstPlayer];

//             const spy1 = sinon.spy(socketRoomService.roomService, 'setUnavailable');
//             const spy2 = sinon.spy(socketRoomService.roomService, 'getRoomsAvailable');
//             socketRoomService.handleAskToJoin(socketMock, roomMock);
//             setTimeout(() => {
//                 assert(spy1.called, 'did not call roomService.setUnavailable on askToJoin');
//                 assert(spy2.called, 'did not call roomService.getRoomsAvailable on askToJoin');
//                 done();
//             }, RESPONSE_DELAY);
//         });
//     });

//     describe('acceptPlayer test', () => {
//         it('should emit to the room if the roomName is valid ', (done) => {
//             const spy = sinon.spy(socketRoomService, 'socketEmitRoom');
//             socketRoomService.handleAcceptPlayer(socketMock, roomMock);
//             setTimeout(() => {
//                 assert(isRoomNameValidStub.called, 'did not call socketRoomService.isRoomNameValid on acceptPlayer');
//                 assert(spy.called, 'did not call socketEmitROom on acceptPlayer');
//                 done();
//             }, RESPONSE_DELAY);
//         });
//         it('should not emit to the room if the roomName is not valid', (done) => {
//             isRoomNameValidStub.callsFake(() => {
//                 return false;
//             });
//             const spy = sinon.spy(socketRoomService, 'socketEmitRoom');
//             socketRoomService.handleAcceptPlayer(socketMock, roomMock);
//             setTimeout(() => {
//                 assert(isRoomNameValidStub.called, 'did not call socketRoomService.isRoomNameValid on acceptPlayer');
//                 assert(spy.notCalled, 'called socketEmitROom on acceptPlayer when roomName was not valid');
//                 done();
//             }, RESPONSE_DELAY);
//         });
//     });
// });
