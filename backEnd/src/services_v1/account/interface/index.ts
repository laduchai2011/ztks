import sql from 'mssql';

export abstract class QueryDB {
    constructor() {}

    /* eslint-disable @typescript-eslint/no-unused-vars */
    set_connection_pool(connectionPool: sql.ConnectionPool): void {}

    run(): void {}
}

export abstract class MutateDB {
    constructor() {}

    /* eslint-disable @typescript-eslint/no-unused-vars */
    set_connection_pool(connectionPool: sql.ConnectionPool): void {}

    run(): void {}
}
