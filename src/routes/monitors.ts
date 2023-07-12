import express, { Router, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { secret } from "../utils/Util";
import { Logger } from "../utils/Logger";
import { httpWebPing, httpsWebPing } from "../WebPing";
import { MonitorModel, findIdByUrl } from "../schemas/MonitorSchema";

const logger: any = new Logger({
  info: true,
  error: true,
  warn: true,
  debug: true,
});

const router: Router = express.Router();

router.get("/new", async (req: Request, res: Response, next: NextFunction) => {
  const { url, interval } = req.body;
  const http: boolean = url.startsWith("http://");

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  } else if (!url || !interval) {
    return res.status(400).json({ message: "Bad request" });
  } else if (interval < 1 || interval > 30) {
    return res.status(400).json({ message: "Bad request" });
  } else if (http && !url.startsWith("http://")) {
    return res.status(400).json({ message: "Bad request" });
  } else if (await MonitorModel.findOne({ url })) {
    return res.status(409).json({ message: "Conflict" });
  }

  try {
    const decoded: any = jwt.verify(token, secret);

    if (decoded) {
      if (http) {
        const httpWebPings = new httpWebPing(url, interval);
        httpWebPings.start();

        const monitor = new MonitorModel({
          url,
          interval,
        });

        await monitor.save();
      } else {
        const httpsWebPings = new httpsWebPing(url, interval);
        httpsWebPings.start();

        const monitor = new MonitorModel({
          url,
          interval,
        });

        await monitor.save();
      }

      const id = await findIdByUrl(url);

      res
        .status(200)
        .json({ message: "Successfully created a new Instance!", id });
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get(
  "/delete",
  async (req: Request, res: Response, next: NextFunction) => {
    const { url } = req.body;

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const decoded: any = jwt.verify(token, secret);

      if (decoded) {
        await MonitorModel.findOneAndDelete({ url });

        res.status(200).json({ message: "Successfully deleted the Instance!" });
      } else {
        return res.status(401).json({ message: "Unauthorized" });
      }
    } catch (err) {
      logger.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

router.get("/list", async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded: any = jwt.verify(token, secret);

    if (decoded) {
      const monitors = await MonitorModel.find({})
        .select("url interval")
        .exec();

      res
        .status(200)
        .json({ message: "Successfully retrieved the Instances!", monitors });
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get(
  "/check/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const decoded: any = jwt.verify(token, secret);

      if (decoded) {
        const monitor = await MonitorModel.findById(id)
          .select("url interval")
          .exec();

        if (!monitor) {
          return res.status(404).json({ message: "Not found" });
        }

        res
          .status(200)
          .json({ message: "Successfully retrieved the Instance!", monitor });
      } else {
        return res.status(401).json({ message: "Unauthorized" });
      }
    } catch (err) {
      logger.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

router.get(
  "/update/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { url, interval } = req.body;

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const decoded: any = jwt.verify(token, secret);

      if (decoded) {
        const monitor = await MonitorModel.findById(id)
          .select("url interval")
          .exec();

        if (!monitor) {
          return res.status(404).json({ message: "Not found" });
        }

        await MonitorModel.findByIdAndUpdate(id, { url, interval });

        res.status(200).json({ message: "Successfully updated the Instance!" });
      } else {
        return res.status(401).json({ message: "Unauthorized" });
      }
    } catch (err) {
      logger.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

export default router;
