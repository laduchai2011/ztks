// import { mssql_server } from '@src/connect';
// import { Request, Response, NextFunction } from 'express';
// import { MyResponse } from '@src/dataStruct/response';
// import { CreateMedicationBodyField, MedicationField } from '@src/dataStruct/myCustom';
// import { verifyRefreshToken } from '@src/token';
// import MutateDB_CreateMedication from '../../mutateDB/CreateMedication';
// // import { produceTask } from '@src/queueRedis/producer';

// class Handle_CreateMedication {
//     private _mssql_server = mssql_server;

//     constructor() {}

//     setup = async (
//         req: Request<Record<string, never>, unknown, CreateMedicationBodyField>,
//         res: Response,
//         next: NextFunction
//     ) => {
//         const myResponse: MyResponse<MedicationField> = {
//             isSuccess: false,
//         };

//         await this._mssql_server.init();

//         const createMedicationBody = req.body;
//         const { refreshToken } = req.cookies;

//         if (typeof refreshToken === 'string') {
//             const verify_refreshToken = verifyRefreshToken(refreshToken);

//             if (verify_refreshToken === 'invalid') {
//                 myResponse.message = 'Refresh-Token không hợp lệ, hãy đăng nhập lại !';
//                 res.status(500).json(myResponse);
//                 return;
//             }

//             if (verify_refreshToken === 'expired') {
//                 myResponse.message = 'Refresh-Token hết hạn, hãy đăng nhập lại !';
//                 res.status(500).json(myResponse);
//                 return;
//             }

//             const { id } = verify_refreshToken;
//             const newMedication_cp = { ...createMedicationBody.medication };
//             newMedication_cp.userId = id;
//             createMedicationBody.medication = newMedication_cp;
//             res.locals.createMedicationBody = createMedicationBody;

//             next();
//         } else {
//             myResponse.message = 'Vui lòng đăng nhập lại !';
//             res.status(500).json(myResponse);
//             return;
//         }
//     };

//     main = async (_: Request, res: Response) => {
//         const createMedicationBody = res.locals.createMedicationBody as CreateMedicationBodyField;

//         const myResponse: MyResponse<MedicationField> = {
//             isSuccess: false,
//         };

//         const mutateDB_createMedication = new MutateDB_CreateMedication();
//         mutateDB_createMedication.set_createMedicationBody(createMedicationBody);

//         const connection_pool = this._mssql_server.get_connectionPool();
//         if (connection_pool) {
//             mutateDB_createMedication.set_connection_pool(connection_pool);
//         } else {
//             myResponse.message = 'Kết nối cơ sở dữ liệu không thành công !';
//             res.status(500).json(myResponse);
//             return;
//         }

//         try {
//             const result = await mutateDB_createMedication.run();
//             if (result?.recordset.length && result?.recordset.length > 0) {
//                 const data = result.recordset[0];
//                 // produceTask<OrderField>('addOrder-to-provider', data);
//                 myResponse.message = 'Tạo sản phẩm thành công !';
//                 myResponse.isSuccess = true;
//                 myResponse.data = data;
//                 res.status(200).json(myResponse);
//                 return;
//             } else {
//                 myResponse.message = 'Tạo sản phẩm KHÔNG thành công !';
//                 res.status(204).json(myResponse);
//                 return;
//             }
//         } catch (error) {
//             myResponse.message = 'Tạo sản phẩm KHÔNG thành công !';
//             myResponse.err = error;
//             res.status(500).json(myResponse);
//             return;
//         }
//     };
// }

// export default Handle_CreateMedication;
