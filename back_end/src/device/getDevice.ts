import { Request } from 'express';
import { DeviceType, DeviceEnum } from './type';

function getDevice(req: Request): DeviceType {
    const device = req.headers['x-device-type'] as DeviceType;

    return device;

    // // WEB
    // if (req.cookies) {
    //     return DeviceEnum.WEB;
    // }

    // return DeviceEnum.MOBILE;

    // // MOBILE
    // const accessToken = req.headers.authorization?.replace('Bearer ', '');
    // const refreshToken = req.headers['x-refresh-token'] as string;
    // const id = req.headers['x-device-id'] as string;
    // if (accessToken && refreshToken && id) {
    //     return Device.MOBILE;
    // }
}

function getAccessToken(req: Request): string | undefined {
    const device = getDevice(req);

    switch (device) {
        case DeviceEnum.WEB: {
            const { accessToken } = req.cookies;
            return accessToken;
        }
        case DeviceEnum.MOBILE: {
            const accessToken = req.headers['x-access-token'] as string;
            return accessToken;
        }
        default: {
            return undefined;
        }
    }
}

function getRefreshToken(req: Request): string | undefined {
    const device = getDevice(req);

    switch (device) {
        case DeviceEnum.WEB: {
            const { refreshToken } = req.cookies;
            return refreshToken;
        }
        case DeviceEnum.MOBILE: {
            const refreshToken = req.headers['x-refresh-token'] as string;
            return refreshToken;
        }
        default: {
            return undefined;
        }
    }
}

export { getDevice, getAccessToken, getRefreshToken };
