// src/lib/logger.ts
var Logger = class {
  chalkTemplate;
  constructor() {
    this.loadChalkTemplate();
  }
  async loadChalkTemplate() {
    this.chalkTemplate = (await import("chalk-template")).default;
  }
  formatTimestamp(time) {
    return time.toLocaleTimeString("en", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).concat(`.${String(time.getMilliseconds()).padStart(3, "0")}`);
  }
  async log(color, title, message) {
    const now = /* @__PURE__ */ new Date();
    const timestamp = this.formatTimestamp(now);
    if (!this.chalkTemplate) await this.loadChalkTemplate();
    const templateString = this.chalkTemplate`{grey ${timestamp}} {${color} [${title}]}: ${message}`;
    console.log(templateString);
  }
  async info(title, message) {
    await this.log("blue", title, message);
  }
  async success(title, message) {
    await this.log("green", title, message);
  }
  async warn(title, message) {
    await this.log("yellow", title, message);
  }
  async error(title, message) {
    await this.log("red", title, message);
  }
};
var log = new Logger();

export {
  log
};
