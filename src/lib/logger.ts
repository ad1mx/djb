class Logger {
  private chalkTemplate: any;

  constructor() {
    this.loadChalkTemplate();
  }

  private async loadChalkTemplate() {
    this.chalkTemplate = (await import("chalk-template")).default;
  }

  private formatTimestamp(time: Date) {
    return time
      .toLocaleTimeString("en", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .concat(`.${String(time.getMilliseconds()).padStart(3, "0")}`);
  }

  private async log(color: string, title?: string, message?: any) {
    const now = new Date();
    const timestamp = this.formatTimestamp(now);

    if (!this.chalkTemplate) await this.loadChalkTemplate();

    const templateString = this
      .chalkTemplate`{grey ${timestamp}} {${color} [${title}]}: ${message}`;

    console.log(templateString);
  }

  public async info(title?: string, message?: any) {
    await this.log("blue", title, message);
  }
  public async success(title?: string, message?: any) {
    await this.log("green", title, message);
  }
  public async warn(title?: string, message?: any) {
    await this.log("yellow", title, message);
  }
  public async error(title?: string, message?: any) {
    await this.log("red", title, message);
  }
}

export const log = new Logger();
