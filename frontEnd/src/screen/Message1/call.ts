// src/sip.ts
import { UserAgent, Registerer, RegistererState } from 'sip.js';

const userAgent = new UserAgent({
    uri: UserAgent.makeURI('sip:101@sip.taokosao.com')!,
    transportOptions: {
        server: 'wss://sip.taokosao.com:8088/ws',
    },
    authorizationUsername: '101',
    authorizationPassword: 'taokosao201195',
});

const registerer = new Registerer(userAgent);

export async function connectSip() {
    console.log('1. connectSip called');

    try {
        registerer.stateChange.addListener((state) => {
            console.log('Register state:', state);
        });

        console.log('2. before start');
        await userAgent.start();

        console.log('3. WebSocket connected');

        console.log('4. before register');
        await registerer.register();

        console.log('5. REGISTER sent');
    } catch (error) {
        console.error('SIP Error:', error);
    }
}
