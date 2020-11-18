import express, { Express } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { createWorker } from "mediasoup";
import { Router, Producer, Transport, Consumer } from "mediasoup/lib/types";
import { createServer } from "http";
import socketIO, { Socket } from "socket.io";
import { mediaSoupConfig } from "./config/MediaSoupConfig";
import { Assert as assert } from "./core/lib/assert";
import { Logger } from "./core/lib/Logger";
​
export class Server {
  logger: Logger;
  app: Express;
  port: number;
  mediasoupRouter: Router;
  producers: Map<string, Producer>;
​
  constructor({ port, logger }) {
    assert.integer(port, { required: true, positive: true });
    assert.instanceOf(logger, Logger);
    this.port = port;
    this.logger = logger;
​
    this.producers = new Map();
​
    this.app = express();
​
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }
​
  async start() {
    return new Promise(async (resolve, reject) => {
      process.on("unhandledRejection", (reason, promise) => {
        this.logger.error("unhandledRejection", reason);
      });
​
      process.on("rejectionHandled", (promise) => {
        this.logger.warn("rejectionHandled", promise);
      });
​
      process.on("multipleResolves", (type, promise, reason) => {
        this.logger.error("multipleResolves", { type, promise, reason });
      });
​
      process.on("uncaughtException", (error) => {
        this.logger.fatal("uncaughtException", error.stack);
        process.exit(1);
      });
​
      const server = createServer(this.app);
​
      const io = socketIO(server, {
        serveClient: false,
        path: "/server",
      });
​
      this.mediasoupRouter = await this.runMediasoupWorker();
​
      io.on("connection", (socket: Socket) => {
        this.logger.info("client connected");
​
        let roomId: string;
​
        let producerTransport: Transport;
        let consumerTransport: Transport;
        let consumer: Consumer;
​
        socket.on("joinRoom", ({ roomId: currentRoomId }, callback) => {
          roomId = currentRoomId;
          socket.join(roomId);
​
          io.to(socket.client.id).emit("joined");
        });
​
        socket.on("getRooms", (data, callback) => {
          const rooms = [...this.producers.entries()];
          callback(
            rooms.map(([roomId, producer]) => {
              return {
                _id: roomId,
                consumersCount: io.sockets.adapter.rooms[roomId].length - 1,
              };
            })
          );
        });
​
        socket.on("disconnect", () => {
          socket.leave(roomId);
​
          if (roomId && !io.sockets.adapter.rooms[roomId]) {
            this.producers.delete(roomId);
          }
​
          this.logger.info("client disconnected");
        });
​
        socket.on("connect_error", (err) => {
          this.logger.error("client connection error", err);
        });
​
        socket.on("getRouterRtpCapabilities", (data, callback) => {
          callback(this.mediasoupRouter.rtpCapabilities);
        });
​
        socket.on("createProducerTransport", async (data, callback) => {
          try {
            const { transport, params } = await this.createWebRtcTransport();
​
            producerTransport = transport;
​
            callback(params);
          } catch (err) {
            this.logger.error(err.message, err);
            callback({ error: err.message });
          }
        });
​
        socket.on("createConsumerTransport", async (data, callback) => {
          try {
            const { transport, params } = await this.createWebRtcTransport();
​
            consumerTransport = transport;
​
            callback(params);
          } catch (err) {
            this.logger.error(err.message, err);
            callback({ error: err.message });
          }
        });
​
        socket.on("connectProducerTransport", async (data, callback) => {
          await producerTransport.connect({
            dtlsParameters: data.dtlsParameters,
          });
​
          callback();
        });
​
        socket.on("connectConsumerTransport", async (data, callback) => {
          await consumerTransport.connect({
            dtlsParameters: data.dtlsParameters,
          });
​
          callback();
        });
​
        socket.on("produce", async (data, callback) => {
          const { kind, rtpParameters } = data;
          const producer = await producerTransport.produce({
            kind,
            rtpParameters,
          });
​
          this.producers.set(roomId, producer);
          callback({ id: producer.id });
        });
​
        socket.on("consume", async (data, callback) => {
          const producer = this.producers.get(roomId);
​
          consumer = await this.createConsumer({
            producer,
            rtpCapabilities: data.rtpCapabilities,
            consumerTransport,
          });
​
          callback({
            producerId: producer.id,
            id: consumer.id,
            kind: consumer.kind,
            rtpParameters: consumer.rtpParameters,
            type: consumer.type,
            producerPaused: consumer.producerPaused,
          });
        });
​
        socket.on("resume", async (data, callback) => {
          consumer.resume();
​
          callback();
        });
      });
​
      server.listen(this.port, () => resolve({ port: this.port }));
    });
  }
​
  private async runMediasoupWorker() {
    const worker = await createWorker({
      logLevel: mediaSoupConfig.worker.logLevel,
      logTags: mediaSoupConfig.worker.logTags,
      rtcMinPort: mediaSoupConfig.worker.rtcMinPort,
      rtcMaxPort: mediaSoupConfig.worker.rtcMaxPort,
    });
​
    worker.on("died", () => {
      this.logger.error(
        "mediasoup worker died, exiting in 2 seconds... [pid:%d]",
        worker.pid
      );
      setTimeout(() => process.exit(1), 2000);
    });
​
    const mediaCodecs = mediaSoupConfig.router.mediaCodecs;
    return worker.createRouter({ mediaCodecs });
  }
​
  private async createWebRtcTransport() {
    const {
      maxIncomingBitrate,
      initialAvailableOutgoingBitrate,
    } = mediaSoupConfig.webRtcTransport;
​
    const transport = await this.mediasoupRouter.createWebRtcTransport({
      listenIps: mediaSoupConfig.webRtcTransport.listenIps,
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
      initialAvailableOutgoingBitrate,
    });
    if (maxIncomingBitrate) {
      try {
        await transport.setMaxIncomingBitrate(maxIncomingBitrate);
      } catch (error) {}
    }
    return {
      transport,
      params: {
        id: transport.id,
        iceParameters: transport.iceParameters,
        iceCandidates: transport.iceCandidates,
        dtlsParameters: transport.dtlsParameters,
      },
    };
  }
​
  private async createConsumer({
    producer,
    rtpCapabilities,
    consumerTransport,
  }) {
    if (
      !this.mediasoupRouter.canConsume({
        producerId: producer.id,
        rtpCapabilities,
      })
    ) {
      this.logger.info("can not consume");
      return;
    }
    const consumer = await consumerTransport.consume({
      producerId: producer.id,
      rtpCapabilities,
      paused: producer.kind === "video",
    });
​
    if (consumer.type === "simulcast") {
      await consumer.setPreferredLayers({
        spatialLayer: 2,
        temporalLayer: 2,
      });
    }
​
    return consumer;
  }
}
