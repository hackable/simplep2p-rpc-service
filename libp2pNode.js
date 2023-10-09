// ESM syntax imports
import { createLibp2p } from 'libp2p';
import { tcp } from '@libp2p/tcp';
import { webSockets } from '@libp2p/websockets';
import { noise } from '@chainsafe/libp2p-noise';
import { mplex } from '@libp2p/mplex';
import { yamux } from '@chainsafe/libp2p-yamux'

import { multiaddr } from 'multiaddr';
// Note: Verify the correct import path for pingService in your project.
import { pingService } from 'libp2p/ping';
import { mdns } from '@libp2p/mdns'

class Libp2pNode {
  constructor() {
    this._node = null;
  }

  get libp2p() {
    return this._node;
  }

  async start() {
    this._node = await createLibp2p({
      addresses: {
        listen: ['/ip4/0.0.0.0/tcp/0'],
      },
      transports: [tcp(), webSockets()],
      connectionEncryption: [noise()],
      peerDiscovery: [mdns({ interval: 20e3 })],
      streamMuxers: [mplex(), yamux()],
      services: {
        ping: pingService({
          protocolPrefix: 'ipfs',
        }),
      },
    });

    this._node.addEventListener('peer:discovery', (evt) => {
      const peerInfo = evt.detail;
      console.log(`Found peer ${peerInfo.id.toString()}`);
    });

    this._node.addEventListener('peer:connect', (evt) => {
      console.log('Connection established to:', evt.detail.toString())
    })

    await this._node.start();

    console.log(`Node started with id ${this._node.peerId}`);
    console.log(`Listening on ${this._node.getMultiaddrs().map(ma => ma.toString()).join(' ')}`);
  }
}

export default Libp2pNode;
