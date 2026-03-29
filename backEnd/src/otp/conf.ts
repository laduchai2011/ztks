import admin from 'firebase-admin';

const serviceAccount = {
    type: 'service_account',
    project_id: 'ztksoptsms',
    private_key_id: 'd5a96b33ba61a36e9393deb6bb7ce9888e899218',
    private_key:
        '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDUsyvqSbGkyJDw\ncFW+o8NvgLCE4O5RJw8J7DO5AVpWE3AgSeq97V7upG6TRRFMXGRL7Lxe1EcmbUbB\nvnOiqJEH9PAPQ9U9+WB/XSamK/VVPX5UQRfpfrpdKZ8o9fUSpERkc9DKFuCAkNnR\nJcefRBx12wL+cvnQvqZXWVoSFGaj44VgCLguZ+W6TtQH7FobDePHqLWfqJi7ZTrQ\n6SKVWBul13z6RBd6EqUyi0r/3Httt7LJy2mtNmSSHivdWq4I7ys7/tZDfVB+KFfl\nn1j8XKmg9XxLoj0YBgv6zYTeBHK9Mcln+eXu5OOeSDdvLBnalVy3lAYdYpmHDecV\nSDgRw3vXAgMBAAECggEALv3SsvVLEPvawbQfzXmCwQyucvz6yeUWNnv/xVzeJ2wt\n9oQ+H23k7lZXs6OrubIj2n5X8590hLHZ0w4PoB0bxaVAsC6tWv7QafMbidTmY8mt\nMlIbRVPhOpnqdvM4DMFL9uF7fFpniR/3b3SoULCMlSEo3SxrssmcGGo+MwZc0tIX\nVq4uzWdHG44qmZvSxicWb7OsqebnarwU1zApAfGADjuRNuqFhIv9+HcTTbQS7Q/H\nBmzUSw4kt6gZK0C6WC63LDQNKnoKU3cwKAwivnsuu3Y/5AOiHp9t7dteJDSyApHo\nLavdI9+uYCOTmceCKRfaIt6HFaUiphCec0bGTGjJaQKBgQDp+4vrEu9LQD+hvaIK\nf57VcIzzKEGmbCJQYARQwo4IEFaOaOP8ydKt5p+BE4iRAfDiVUf5RvsMgzASo3WL\nCtRWPRgVBq5f5+KVhRYGxM2GOO78AqLXnaMOcDLZdbMSLiq1TlsY78WVBQpjsqLN\nl2wj3KiwvSJUScBpMFY2DEsWrQKBgQDotvECKC6ivJZYd4urh6tNPAmGN8JMJuw3\nfTMbTYm8dTUgYj485kp+nf6R4QXqJ0TS2yutOSfhp1d2HWC2+3glF1CIS8xKibE/\nVzamRznBCWp2Re36fLX5Ziip9xfSisAYOib2ulRc1bXrZ50VcPjBSPPkTemF+6Gt\ntHp1PmahEwKBgQDCUE7giDcGDXNKxQt/IIEtzGyhuvraVM8iZLrwvsHpXHgliGJe\nGtXF6dLpBOnTUwNTU3OURyhSOdiAghMpx3KTs+T+ATBrIU4A0id6s5HjOADwdNf7\nrEQvx2nTQnXWUVTSgSISUX2KxkbciQu/JVN/bM8DB+8shJswQB44gHkTeQKBgQCQ\nWrLjoKNVJWCpnfZQv8aeEUjjLgFjlZ1fylUCcbWn5pi+7tImmr/JDR6VxR0TI6rI\nlVXhjRvVGSXiydRtjU34zB6TfVlLP2BopyPqPzJvMPUOStCVWfjTrPA6hmELpDAG\nl0QGNo0QTS0cylghrcNQun03uLDMAMxI4TQ5OC0XawKBgCMK1CG7GsZKO7T8ywuA\ngSIfTkEqRznDQMuU8AU01ZIzdV/XAe1dunIkKqrehPHvZWpy4lOEP+JPY1ywQbpx\nS4NZv0TvO31D2rjk54Ek+mMdDRoFXD8L+eKDQhc/QnYLMCTDac19Ga3yDQU+Oy5Z\nAsJEwkoy8gDSoVNa7aw1soQK\n-----END PRIVATE KEY-----\n',
    client_email: 'firebase-adminsdk-fbsvc@ztksoptsms.iam.gserviceaccount.com',
    client_id: '116484400061761104533',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url:
        'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40ztksoptsms.iam.gserviceaccount.com',
    universe_domain: 'googleapis.com',
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export default admin;
