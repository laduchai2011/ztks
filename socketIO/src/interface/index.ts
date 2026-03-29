import { config as mssql_config } from './mssql';
import { config as redis_config } from './redis';
import { config as rabbitmq_config } from './rabbitmq';
import { infor as video_infor } from './video';

interface mssql_interface {
    config?: mssql_config;
}

interface redis_interface {
    config?: redis_config;
}

interface rabbitmq_interface {
    config?: rabbitmq_config;
}

interface video_interface {
    infor: video_infor;
}

interface my_interface {
    mssql: mssql_interface;
    redis: redis_interface;
    rabbitmq: rabbitmq_interface;
    video: video_interface;
}

export default my_interface;
