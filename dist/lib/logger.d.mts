declare class Logger {
    private chalkTemplate;
    constructor();
    private loadChalkTemplate;
    private formatTimestamp;
    private log;
    info(title?: string, message?: any): Promise<void>;
    success(title?: string, message?: any): Promise<void>;
    warn(title?: string, message?: any): Promise<void>;
    error(title?: string, message?: any): Promise<void>;
}
declare const log: Logger;

export { log };
