import * as http from "http";
import * as https from "https";
import axios, { AxiosResponse } from "axios";

import { Logger } from "./utils/Logger";

const logger: any = new Logger({
  info: true,
  error: true,
  warn: true,
  debug: true,
});

export class httpWebPing {
  private timerId: NodeJS.Timeout | null;
  private websiteUrl: string;
  private interval: number;
  private id: number;

  constructor(websiteUrl: string, interval: number) {
    this.timerId = null;
    this.websiteUrl = websiteUrl;
    this.interval = Math.max(1, Math.min(30, interval));
    this.id = 0;
  }

  start(): void {
    if (this.timerId) {
      logger.warn("Timer already started");
      return;
    }

    logger.info("WebPing started");

    this.timerId = setInterval(() => {
      this.pingWebsite();
      this.id++;
    }, this.interval * 1000);
  }

  stop(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
      logger.info("WebPing stopped");
      logger.info(`WebPing ran ${this.id} times`);
    } else {
      logger.warn("WebPing is not started");
    }
  }

  private pingWebsite(): void {
    http
      .get(this.websiteUrl, (res: http.IncomingMessage) => {
        const isWebsiteUp: boolean = res.statusCode === 200;

        if (isWebsiteUp) {
          logger.info(`Website ${this.websiteUrl} is up`);
        } else {
          logger.error(`Website ${this.websiteUrl} is down`);
        }
      })

      .on("error", (err: Error) => {
        logger.error(`An error occurred \n ${err.message}`);
      });
  }
}

export class httpsWebPing {
  private timerId: NodeJS.Timeout | null;
  private websiteUrl: string;
  private interval: number;
  private id: number;

  constructor(websiteUrl: string, interval: number) {
    this.timerId = null;
    this.websiteUrl = websiteUrl;
    this.interval = Math.max(1, Math.min(5, interval));
    this.id = 0;
  }

  start(): void {
    if (this.timerId) {
      logger.warn("Timer already started");
      return;
    }

    logger.info("WebPing started");

    this.timerId = setInterval(() => {
      this.pingWebsite();
      this.id++;
    }, this.interval * 1000);
  }

  stop(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
      logger.info("WebPing stopped");
      logger.info(`WebPing ran ${this.id} times`);
    } else {
      logger.warn("WebPing is not started");
    }
  }

  private pingWebsite(): void {
    https
      .get(this.websiteUrl, (res: http.IncomingMessage) => {
        const isWebsiteUp: boolean = res.statusCode === 200;

        if (isWebsiteUp) {
          logger.info(`Website ${this.websiteUrl} is up`);
        } else {
          logger.error(`Website ${this.websiteUrl} is down`);
        }
      })

      .on("error", (err: Error) => {
        logger.error(`An error occurred \n ${err.message}`);
      });
  }
}

class MonitorWebPing {
  private websiteUrl: string;
  private checkInterval: number;

  constructor(websiteUrl: string, checkInterval: number) {
    this.websiteUrl = websiteUrl;
    this.checkInterval = checkInterval;
  }

  private checkWebsiteAvailability = async (): Promise<void> => {
    try {
      const response: AxiosResponse = await axios.get(this.websiteUrl);
      if (response.status === 200) {
        console.log(`Website ${this.websiteUrl} is available.`);
      }
    } catch (error: any) {
      console.error(
        `Website ${this.websiteUrl} is down. Error: ${error.message}`,
      );
    }
  };

  public startMonitoring = (): void => {
    setInterval(this.checkWebsiteAvailability, this.checkInterval);
  };
}
