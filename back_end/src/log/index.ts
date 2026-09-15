class My_Log {
    constructor() {}

    withRed(log: unknown) {
        console.log('\x1b[31m%s\x1b[0m', log); // Red
    }

    withGreen(log: unknown) {
        console.log('\x1b[32m%s\x1b[0m', log); // Red
    }

    withYellow(log: unknown) {
        console.log('\x1b[33m%s\x1b[0m', log); // Red
    }

    withBlue(log: unknown) {
        console.log('\x1b[34m%s\x1b[0m', log); // Red
    }

    withMagenta(log: unknown) {
        console.log('\x1b[35m%s\x1b[0m', log); // Red
    }

    withCyan(log: unknown) {
        console.log('\x1b[36m%s\x1b[0m', log); // Red
    }
}

const my_log = new My_Log();

export { my_log };
