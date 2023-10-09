import { createRPC, RPCException } from "@organicdesign/libp2p-rpc";
import fs from 'fs/promises';
import path from 'path';
import { fromString as uint8ArrayFromString, toString as uint8ArrayToString } from 'uint8arrays';
import { fileURLToPath } from 'url';

// Get directory name in ESM.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class RPCService {
  constructor(libp2p) {
    this.libp2p = libp2p;
    this.rpc = createRPC()(libp2p);

    // Load and add RPC methods.
    this._loadMethods();
  }

  async _loadMethods() {
    try {
      // Path to methods directory
      const methodsDir = path.resolve(__dirname, 'methods');

      // List all files in methods directory
      const methodFiles = await fs.readdir(methodsDir);

      // Load and add each method
      for (const file of methodFiles) {
        // Avoid trying to import non-JavaScript files
        if (path.extname(file) !== '.js') continue;

        const methodModule = await import(path.join('file://', methodsDir, file));
        const methodName = path.parse(file).name; // File name without extension as method name

        this.rpc.addMethod(methodName, methodModule.default);
        console.log(`Method [${methodName}] has been loaded.`);
      }
    } catch (error) {
      console.error('Error loading methods:', error);
    }
  }

  async start() {
    await this.rpc.start();
  }

  async stop() {
    await this.rpc.stop();
  }

  async request(peerId, method, ...params) {
    try {
      const response = await this.rpc.request(peerId, method, uint8ArrayFromString(JSON.stringify(params)));
      console.log("Response:", uint8ArrayToString(response));
      return JSON.parse(uint8ArrayToString(response));
    } catch (error) {
      console.error('Error in request method:', error);
      throw error;
    }
  }

  notify(peerId, method, ...params) {
    try {
      this.rpc.notify(peerId, method, uint8ArrayFromString(JSON.stringify(params)));
    } catch (error) {
      console.error('Error in notify method:', error);
      throw error;
    }
  }
}

export default RPCService;
