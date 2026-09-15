// import { mssql_server } from '@src/connect';
import { Request, Response } from 'express';
import { parameter_options } from '../../type';
import path from 'path';
import fs from 'fs';
// import my_interface from '@src/interface';
import { MyResponse } from '@src/dataStruct/response';

const root_path = process.cwd();

class Handle_Watch {
    constructor() {}

    main_segment = (req: Request<Record<string, never>, unknown, unknown, parameter_options>, res: Response) => {
        // const resData: my_interface['router_res_type'] = {
        //     message: 'middle_upload have a error',
        //     status: '',
        //     error: '',
        //     data: '',
        // };
        const myResponse: MyResponse<unknown> = {
            message: 'middle_upload have a error',
            isSuccess: false,
        };

        try {
            const id = req.query.id;
            const filePath = path.join(root_path, 'data', 'video', 'output', id, req.path);
            const stat = fs.statSync(filePath);
            // myResponse.isSuccess = true;
            res.setHeader('Content-Type', 'video/MP2T');
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            res.setHeader('Content-Length', stat.size);
            fs.createReadStream(filePath).pipe(res);
        } catch (err) {
            myResponse.message = 'Segment not found !';
            myResponse.err = err;
            res.status(404).send(myResponse);
            return;
        }
    };

    main_playlist = (req: Request<Record<string, never>, unknown, unknown, parameter_options>, res: Response) => {
        // const resData: my_interface['router_res_type'] = {
        //     message: 'middle_upload have a error',
        //     status: '',
        //     error: '',
        //     data: '',
        // };
        const myResponse: MyResponse<unknown> = {
            message: 'middle_upload have a error',
            isSuccess: false,
        };

        try {
            const id = req.query.id;
            const filePath = path.join(root_path, 'data', 'video', 'output', id, req.path);
            const stat = fs.statSync(filePath);
            //  myResponse.isSuccess = true;
            res.setHeader('Content-Type', 'video/MP2T');
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            res.setHeader('Content-Length', stat.size);
            fs.createReadStream(filePath).pipe(res);
        } catch (err) {
            myResponse.message = `Playlist (${req.path}) not found !`;
            myResponse.err = err;
            res.status(404).send(myResponse);
            return;
        }
    };

    main = async (req: Request<Record<string, never>, unknown, unknown, parameter_options>, res: Response) => {
        // const resData: my_interface['router_res_type'] = {
        //     message: 'middle_upload have a error',
        //     status: '',
        //     error: '',
        //     data: '',
        // };
        const myResponse: MyResponse<unknown> = {
            message: 'middle_upload have a error',
            isSuccess: false,
        };

        try {
            const id = req.query.id;
            const filePath = path.join(root_path, 'data', 'video', 'output', id, `master.m3u8`);
            const stat = fs.statSync(filePath);
            res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            res.setHeader('Content-Length', stat.size);
            res.sendFile(filePath);
        } catch (err) {
            myResponse.message = `Master.m3u8 (${req.path}) not found !`;
            myResponse.err = err;
            res.status(404).send(myResponse);
            return;
        }
    };
}

export default Handle_Watch;
