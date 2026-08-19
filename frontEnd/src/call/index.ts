// src/sip.ts
import { UserAgent, Registerer, Inviter, Invitation, SessionState } from 'sip.js';

export class MySip {
    private _agentCode: string = '';
    private _agentPassword: string = '';
    private _userAgent: UserAgent | undefined;
    private _registerer: Registerer | undefined;
    private _inviterIn: Invitation | undefined;
    private _inviterOut: Inviter | undefined;
    private localStream?: MediaStream;

    private _reconnectTimer?: ReturnType<typeof setTimeout>;
    private _reconnectDelay = 1000; // 1s
    private readonly _maxReconnectDelay = 30000; // 30s
    private _stopped = false;

    private _inviterOutStateChange?: (state: SessionState) => void;

    constructor(agentCode: string, agentPassword: string) {
        this._agentCode = agentCode;
        this._agentPassword = agentPassword;
    }

    private scheduleReconnect() {
        if (this._stopped) {
            return;
        }

        if (this._reconnectTimer) {
            clearTimeout(this._reconnectTimer);
        }

        console.log(`Reconnect sau ${this._reconnectDelay / 1000}s`);

        this._reconnectTimer = setTimeout(async () => {
            if (this._stopped) {
                return;
            }

            try {
                if (this._userAgent) {
                    try {
                        await this._userAgent.stop();
                    } catch (error) {
                        console.error(error);
                    }
                }

                this.createUserAgent();
                this.createRegisterer();

                await this.connectSip();
            } catch (err) {
                console.error(err);
            }
        }, this._reconnectDelay);

        this._reconnectDelay = Math.min(this._reconnectDelay * 2, this._maxReconnectDelay);
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

    async handleIncomingCall(
        onRemoteStream: (stream: MediaStream) => void,
        onStateChange?: (state: SessionState) => void,
        onInvitation?: (invitation: Invitation) => void
    ) {
        if (!this._userAgent) {
            console.error('userAgent is undefine');
            return;
        }

        this._userAgent.delegate = {
            onDisconnect: async () => {
                console.log('WebSocket disconnected');

                if (!this._stopped) {
                    this.scheduleReconnect();
                }
            },

            onInvite: (invitation) => {
                this._inviterIn = invitation;

                onInvitation?.(invitation);

                this._inviterIn.stateChange.addListener(async (state) => {
                    onStateChange?.(state);

                    switch (state) {
                        case SessionState.Initial:
                            console.log('Khởi tạo IncomingCall');
                            break;

                        case SessionState.Establishing:
                            console.log('Đang đổ chuông... IncomingCall');
                            if (this.localStream) {
                                console.log('Media chưa được giải phóng !');
                            }

                            // xin quyền microphone
                            this.localStream = await navigator.mediaDevices.getUserMedia({
                                audio: true,
                                video: false,
                            });
                            break;

                        case SessionState.Established: {
                            console.log('Đã kết nối IncomingCall');

                            const pc = (invitation.sessionDescriptionHandler as any)
                                .peerConnection as RTCPeerConnection;

                            const remoteStream = new MediaStream();

                            pc.getReceivers().forEach((receiver) => {
                                if (receiver.track) {
                                    remoteStream.addTrack(receiver.track);
                                }
                            });

                            onRemoteStream(remoteStream);
                            break;
                        }

                        case SessionState.Terminating:
                            console.log('Đang kết thúc IncomingCall');
                            break;

                        case SessionState.Terminated:
                            console.log('Cuộc gọi đã kết thúc IncomingCall');
                            if (this.localStream) {
                                this.localStream.getTracks().forEach((track) => {
                                    track.stop();
                                });

                                this.localStream = undefined;
                            }

                            break;
                    }
                });
            },
        };
    }

    accept() {
        if (!this._inviterIn) return;
        this._inviterIn.accept({
            sessionDescriptionHandlerOptions: {
                constraints: {
                    audio: true,
                    video: false,
                },
            },
        });
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

        this._stopped = false;

        try {
            this._registerer.stateChange.addListener((state) => {
                // console.log('Register state:', state);
            });

            await this._userAgent.start();
            await this._registerer.register();

            this._reconnectDelay = 1000;
        } catch (error) {
            console.error('SIP Error:', error);
            this.scheduleReconnect();
        }
    }

    async callUid(uid: string, isVideo?: boolean, onStateChange?: (state: SessionState) => void) {
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

            this._inviterOut = new Inviter(this._userAgent, UserAgent.makeURI(`sip:${uid}@sip.taokosao.com`)!, {
                sessionDescriptionHandlerOptions: {
                    constraints: {
                        audio: true,
                        video: isVideo ? isVideo : false,
                    },
                },
            });

            if (this.localStream) {
                console.log('Media chưa được giải phóng !');
            }

            this.localStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: isVideo ? isVideo : false,
            });

            // this._inviterOut.stateChange.addListener(async (state) => {
            //     onStateChange?.(state);
            //     switch (state) {
            //         case SessionState.Initial:
            //             console.log('Khởi tạo');
            //             break;

            //         case SessionState.Establishing:
            //             console.log('Đang đổ chuông...');
            //             break;

            //         case SessionState.Established: {
            //             console.log('Đã kết nối');

            //             const pc = (this._inviterOut?.sessionDescriptionHandler as any)
            //                 .peerConnection as RTCPeerConnection;

            //             const remoteStream = new MediaStream();

            //             pc.getReceivers().forEach((receiver) => {
            //                 if (receiver.track) {
            //                     remoteStream.addTrack(receiver.track);
            //                 }
            //             });

            //             const audio = new Audio();

            //             audio.srcObject = remoteStream;

            //             await audio.play();
            //             break;
            //         }

            //         case SessionState.Terminating:
            //             console.log('Đang kết thúc');
            //             break;

            //         case SessionState.Terminated:
            //             console.log('Cuộc gọi đã kết thúc');
            //             if (this.localStream) {
            //                 this.localStream.getTracks().forEach((track) => {
            //                     track.stop();
            //                 });

            //                 this.localStream = undefined;
            //             }
            //             break;
            //     }
            // });

            this._inviterOutStateChange = async (state: SessionState) => {
                onStateChange?.(state);

                switch (state) {
                    case SessionState.Initial:
                        console.log('Khởi tạo');
                        break;

                    case SessionState.Establishing:
                        console.log('Đang đổ chuông...');
                        break;

                    case SessionState.Established: {
                        console.log('Đã kết nối');

                        const pc = (this._inviterOut?.sessionDescriptionHandler as any)
                            .peerConnection as RTCPeerConnection;

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
                        break;
                }
            };

            this._inviterOut.stateChange.addListener(this._inviterOutStateChange);

            await this._inviterOut.invite();
        } catch (error) {
            console.error(error);
        }
    }

    async destroyCallIn() {
        if (this.localStream) {
            this.localStream.getTracks().forEach(async (track) => {
                track.stop();

                // if (this._inviterIn) {
                //     this._inviterIn._bye();
                // }
            });

            this.localStream = undefined;
        }

        if (this._inviterIn) {
            try {
                if (this._inviterIn.state === SessionState.Established) {
                    await this._inviterIn.bye();
                } else {
                    await this._inviterIn.reject();
                }
            } catch (error) {
                console.error(error);
            }

            this._inviterIn = undefined;
        }
    }

    async destroyCallOut() {
        if (this._inviterOut && this._inviterOutStateChange) {
            this._inviterOut.stateChange.removeListener(this._inviterOutStateChange);

            this._inviterOutStateChange = undefined;
        }

        // 1. Dừng microphone
        if (this.localStream) {
            this.localStream.getTracks().forEach((track) => track.stop());
            this.localStream = undefined;
        }

        // 2. Kết thúc cuộc gọi
        if (this._inviterOut) {
            try {
                if (this._inviterOut.state === SessionState.Established) {
                    await this._inviterOut.bye();
                } else {
                    await this._inviterOut.cancel();
                }
            } catch (error) {
                console.error(error);
            }

            this._inviterOut = undefined;
        }
    }

    async disconnectSip() {
        try {
            // Kết thúc cuộc gọi nếu có
            if (this._inviterOut) {
                try {
                    if (this._inviterOut.state === SessionState.Established) {
                        await this._inviterOut.bye();
                    } else {
                        await this._inviterOut.cancel();
                    }
                } catch (error) {
                    console.error(error);
                }

                this._inviterOut = undefined;
            }

            if (this._inviterIn) {
                try {
                    if (this._inviterIn.state === SessionState.Established) {
                        await this._inviterIn.bye();
                    } else {
                        await this._inviterIn.reject();
                    }
                } catch (error) {
                    console.error(error);
                }

                this._inviterIn = undefined;
            }

            // Giải phóng microphone
            if (this.localStream) {
                this.localStream.getTracks().forEach((track) => track.stop());
                this.localStream = undefined;
            }

            // Gửi REGISTER expires=0
            if (this._registerer) {
                try {
                    await this._registerer.unregister();
                } catch (error) {
                    console.error(error);
                }
            }

            // Đóng WebSocket
            if (this._userAgent) {
                try {
                    await this._userAgent.stop();
                } catch (error) {
                    console.error(error);
                }
            }

            this._registerer = undefined;
            this._userAgent = undefined;

            console.log('Disconnected from Asterisk');
        } catch (err) {
            console.error(err);
        }
    }
}
