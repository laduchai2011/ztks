// src/sip.ts
import { UserAgent, Registerer, RegistererState, Inviter, SessionState } from 'sip.js';

const userAgent = new UserAgent({
    uri: UserAgent.makeURI('sip:101@sip.taokosao.com')!,
    transportOptions: {
        server: 'wss://sip.taokosao.com/ws',
    },
    authorizationUsername: '101',
    authorizationPassword: 'taokosao201195',
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

const registerer = new Registerer(userAgent);

export async function connectSip() {
    // console.log('1. connectSip called');

    try {
        registerer.stateChange.addListener((state) => {
            // console.log('Register state:', state);
        });

        // console.log('2. before start');
        await userAgent.start();

        // console.log('3. WebSocket connected');

        // console.log('4. before register');
        await registerer.register();

        // console.log('5. REGISTER sent');
    } catch (error) {
        console.error('SIP Error:', error);
    }
}

export async function callUid(uid: string) {
    try {
        console.log('micro phone', window.isSecureContext);

        await navigator.mediaDevices.getUserMedia({
            audio: true,
        });

        const inviter = new Inviter(userAgent, UserAgent.makeURI(`sip:${uid}@sip.taokosao.com`)!, {
            sessionDescriptionHandlerOptions: {
                constraints: {
                    audio: true,
                    video: false,
                },
            },
        });

        inviter.stateChange.addListener(async (state) => {
            // if (state === SessionState.Established) {
            //     const pc = (inviter.sessionDescriptionHandler as any).peerConnection as RTCPeerConnection;

            //     const remoteStream = new MediaStream();

            //     pc.getReceivers().forEach((receiver) => {
            //         if (receiver.track) {
            //             remoteStream.addTrack(receiver.track);
            //         }
            //     });

            //     const audio = new Audio();

            //     audio.srcObject = remoteStream;

            //     await audio.play();
            // }

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
