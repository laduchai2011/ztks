import dotenv from 'dotenv';
import my_interface from '@src/interface';

dotenv.config();

const isProduct = process.env.NODE_ENV === 'production';

// const mssql_config: my_interface['mssql']['config'] = isProduct
//     ? {
//           host: process.env.MSSQL_SERVER_HOST,
//           port: Number(process.env.MSSQL_SERVER_PORT),
//           database: process.env.MSSQL_SERVER_DATABASE,
//           username: process.env.MSSQL_SERVER_USERNAME,
//           password: process.env.MSSQL_SERVER_PASSWORD,
//       }
//     : {
//           host: '103.249.200.80',
//           port: 1433,
//           database: 'zalo5kdev',
//           username: 'sa',
//           password: '201195laducHai',
//       };

// const mssql_change_history_config: my_interface['mssql']['config'] = isProduct
//     ? {
//           host: process.env.MSSQL_CHANGE_HISTORY_SERVER_HOST,
//           port: Number(process.env.MSSQL_CHANGE_HISTORY_SERVER_PORT),
//           database: process.env.MSSQL_CHANGE_HISTORY_SERVER_DATABASE,
//           username: process.env.MSSQL_CHANGE_HISTORY_SERVER_USERNAME,
//           password: process.env.MSSQL_CHANGE_HISTORY_SERVER_PASSWORD,
//       }
//     : {
//           host: '127.0.0.1',
//           port: 1433,
//           database: 'zalo5k_change_history',
//           username: 'sa',
//           password: '201195laducHai',
//       };

// const redis_config: my_interface['redis']['config'] = isProduct
//     ? {
//           host: process.env.REDIS_SERVER_HOST,
//           port: Number(process.env.REDIS_SERVER_PORT),
//           username: process.env.REDIS_SERVER_USERNAME,
//           password: process.env.REDIS_SERVER_PASSWORD,
//       }
//     : {
//           host: '103.249.200.80',
//           port: 6379,
//           username: 'zalo5k',
//           password: 'hai20111995',
//       };

const rabbitmq_config: my_interface['rabbitmq']['config'] = isProduct
    ? {
          host: process.env.RABBITMQ_SERVER_HOST,
          port: Number(process.env.RABBITMQ_SERVER_PORT),
          username: process.env.RABBITMQ_SERVER_USERNAME,
          password: process.env.RABBITMQ_SERVER_PASSWORD,
      }
    : {
          host: '103.249.200.80',
          port: 5672,
          username: 'admin',
          password: 'admin123',
      };

export { rabbitmq_config };
