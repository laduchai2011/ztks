// src/sip.ts
import { UserAgent, Registerer, Inviter, SessionState } from 'sip.js';

// const userAgent = (agentCode: string, agentPassword: string) => {
//     const config = new UserAgent({
//         uri: UserAgent.makeURI(`sip:${agentCode}@sip.taokosao.com`)!,
//         transportOptions: {
//             server: 'wss://sip.taokosao.com/ws',
//         },
//         authorizationUsername: agentCode,
//         authorizationPassword: agentPassword,
//         sessionDescriptionHandlerFactoryOptions: {
//             peerConnectionConfiguration: {
//                 iceServers: [
//                     {
//                         urls: 'stun:stun.l.google.com:19302',
//                     },
//                 ],
//             },
//         },
//     });

//     return config;
// };

// const registerer = new Registerer(userAgent);

// export async function connectSip(registerer: Registerer) {
//     // console.log('1. connectSip called');

//     try {
//         registerer.stateChange.addListener((state) => {
//             // console.log('Register state:', state);
//         });

//         // console.log('2. before start');
//         await userAgent.start();

//         // console.log('3. WebSocket connected');

//         // console.log('4. before register');
//         await registerer.register();

//         // console.log('5. REGISTER sent');
//     } catch (error) {
//         console.error('SIP Error:', error);
//     }
// }

// export async function callUid(uid: string) {
//     try {
//         console.log('micro phone', window.isSecureContext);

//         await navigator.mediaDevices.getUserMedia({
//             audio: true,
//         });

//         const inviter = new Inviter(userAgent, UserAgent.makeURI(`sip:${uid}@sip.taokosao.com`)!, {
//             sessionDescriptionHandlerOptions: {
//                 constraints: {
//                     audio: true,
//                     video: false,
//                 },
//             },
//         });

//         inviter.stateChange.addListener(async (state) => {
//             switch (state) {
//                 case SessionState.Initial:
//                     console.log('Khởi tạo');
//                     break;

//                 case SessionState.Establishing:
//                     console.log('Đang đổ chuông...');
//                     break;

//                 case SessionState.Established: {
//                     console.log('Đã kết nối');
//                     const pc = (inviter.sessionDescriptionHandler as any).peerConnection as RTCPeerConnection;

//                     const remoteStream = new MediaStream();

//                     pc.getReceivers().forEach((receiver) => {
//                         if (receiver.track) {
//                             remoteStream.addTrack(receiver.track);
//                         }
//                     });

//                     const audio = new Audio();

//                     audio.srcObject = remoteStream;

//                     await audio.play();
//                     break;
//                 }

//                 case SessionState.Terminating:
//                     console.log('Đang kết thúc');
//                     break;

//                 case SessionState.Terminated:
//                     console.log('Cuộc gọi đã kết thúc');
//                     // Cleanup
//                     break;
//             }
//         });

//         await inviter.invite();
//     } catch (error) {
//         console.error(error);
//     }
// }

export class MySip {
    private _agentCode: string = '';
    private _agentPassword: string = '';
    private _userAgent: UserAgent | undefined;
    private _registerer: Registerer | undefined;

    constructor(agentCode: string, agentPassword: string) {
        this._agentCode = agentCode;
        this._agentPassword = agentPassword;
    }

    createUserAgent() {
        this._userAgent = new UserAgent({
            uri: UserAgent.makeURI(`sip:${this._agentCode}@sip.taokosao.com`)!,
            transportOptions: {
                server: 'wss://sip.taokosao.com/ws',
            },
            authorizationUsername: this._agentCode,
            authorizationPassword: this._agentPassword,
            sessionDescriptionHandlerFactoryOptions: {
                peerConnectionConfiguration: {
                    iceServers: [
                        {
                            urls: 'stun:stun.l.google.com:19302',
                        },
                    ],
                },
            },
        });
    }

    createRegisterer() {
        if (!this._userAgent) {
            console.error('userAgent is undefine');
            return;
        }
        this._registerer = new Registerer(this._userAgent);
    }

    async connectSip() {
        if (!this._userAgent) {
            console.error('userAgent is undefine');
            return;
        }
        if (!this._registerer) {
            console.error('registerer is undefine');
            return;
        }
        // console.log('1. connectSip called');

        try {
            this._registerer.stateChange.addListener((state) => {
                // console.log('Register state:', state);
            });

            // console.log('2. before start');
            await this._userAgent.start();

            // console.log('3. WebSocket connected');

            // console.log('4. before register');
            await this._registerer.register();

            // console.log('5. REGISTER sent');
        } catch (error) {
            console.error('SIP Error:', error);
        }
    }

    async callUid(uid: string, isVideo?: boolean) {
        if (!this._userAgent) {
            console.error('userAgent is undefine');
            return;
        }
        if (!this._registerer) {
            console.error('registerer is undefine');
            return;
        }

        try {
            console.log('micro phone', window.isSecureContext);

            await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: isVideo ? isVideo : false,
            });

            const inviter = new Inviter(this._userAgent, UserAgent.makeURI(`sip:${uid}@sip.taokosao.com`)!, {
                sessionDescriptionHandlerOptions: {
                    constraints: {
                        audio: true,
                        video: isVideo ? isVideo : false,
                    },
                },
            });

            inviter.stateChange.addListener(async (state) => {
                switch (state) {
                    case SessionState.Initial:
                        console.log('Khởi tạo');
                        break;

                    case SessionState.Establishing:
                        console.log('Đang đổ chuông...');
                        break;

                    case SessionState.Established: {
                        console.log('Đã kết nối');
                        const pc = (inviter.sessionDescriptionHandler as any).peerConnection as RTCPeerConnection;

                        const remoteStream = new MediaStream();

                        pc.getReceivers().forEach((receiver) => {
                            if (receiver.track) {
                                remoteStream.addTrack(receiver.track);
                            }
                        });

                        const audio = new Audio();

                        audio.srcObject = remoteStream;

                        await audio.play();
                        break;
                    }

                    case SessionState.Terminating:
                        console.log('Đang kết thúc');
                        break;

                    case SessionState.Terminated:
                        console.log('Cuộc gọi đã kết thúc');
                        // Cleanup
                        break;
                }
            });

            await inviter.invite();
        } catch (error) {
            console.error(error);
        }
    }
}
