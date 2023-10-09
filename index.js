import express from 'express';
import Libp2pNode from './libp2pNode.js';
import RPCService from './rpcService.js';
import { peerIdFromString } from '@libp2p/peer-id';

const app = express();

async function setupLibp2pAndRpc() {
  const node = new Libp2pNode(); // Assuming Libp2pNode starts libp2p internally
  await node.start(); // Ensure Libp2pNode has a start method

  const rpcService = new RPCService(node.libp2p); // Ensure Libp2pNode exposes the libp2p instance
  await rpcService.start();
  return { node, rpcService };
}

async function startServer() {
  const { node, rpcService } = await setupLibp2pAndRpc();

  app.get('/peers', async (req, res) => {
    const peers = Array.from(node.libp2p.peerStore.peers.values());
    res.json({
      peers: peers.map(peer => peer.id.toString())
    });
  });

  app.post('/request', express.json(), async (req, res) => {
    try {
      const { remotePeerId, method, params } = req.body;
      const peerId = peerIdFromString(remotePeerId);

      const response = await rpcService.request(peerId, method, params);
      res.json({ response: response }); // Convert Uint8Array to array for JSON serialization
    } catch (error) {
      res.status(500).json({ error: error.message, code: error.code });
    }
  });

  const server = app.listen(0, () => {
    console.log(`Server running on http://localhost:${server.address().port}`);
  });
}

startServer().catch(console.error);
