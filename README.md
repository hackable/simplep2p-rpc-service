# Simple P2P RPC Service Documentation

### Overview

**Simple P2P RPC Service**, implemented through the `RPCService` class, affords a framework to implement Remote Procedure Call (RPC) operations within a decentralized network using the `libp2p` protocol stack. With the capability of dynamically loading methods from a specified directory, this service maintains a modular codebase, presenting a scalable utility in applications that necessitate distributed data processing or sharing across a peer-to-peer network.

### Initialization Steps

Ensure all requisite dependencies are installed in your project:

```shell
npm install
```

Ensure that methods are defined as separate ES modules, housed within a `methods` directory, co-located with the `RPCService` class file.

### Inclusion in Project

Ensure the `RPCService` class is imported into your project file:

```javascript
import RPCService from './path-to-RPCService';
```

### Class Method Descriptions

#### Constructor Method

```javascript
constructor(libp2p)
```
- `libp2p`: An instance of libp2p used to create the RPC object.

#### start()

An asynchronous method to commence the RPC service.

```javascript
await rpcService.start();
```

#### stop()

An asynchronous method to cease the RPC service.

```javascript
await rpcService.stop();
```

#### request(peerId, method, ...params)

Transmit a request to a peer invoking a particular method with parameters.

- `peerId`: The peer's ID to which the request is being sent.
- `method`: The method name being invoked.
- `...params`: Parameters to be passed to the invoked method.

```javascript
try {
    const response = await rpcService.request(peerId, 'methodName', param1, param2);
    console.log("Response:", response);
} catch (error) {
    console.error('Request Error:', error);
}
```

#### notify(peerId, method, ...params)

Transmit a notification to a peer, invoking a method without awaiting a response.

- `peerId`: The peer's ID being notified.
- `method`: The method name being invoked.
- `...params`: Parameters to be passed to the invoked method.

```javascript
rpcService.notify(peerId, 'methodName', param1, param2);
```

### Method Creation Guidelines

Ensure RPC methods are defined as separate ES modules in a directory named `methods`.

#### Method Module Architecture

1. **Dependency Importation**

   Import the `RPCException` class and necessary utilities at the top of your method file.

   ```javascript
   import { RPCException } from "@organicdesign/libp2p-rpc";
   import { fromString as uint8ArrayFromString, toString as uint8ArrayToString } from 'uint8arrays';
   ```

2. **Method Definition**

   Establish a default export function that adheres to the `(params, peerId) => {}` signature, ensuring it returns a `Uint8Array`.

   ```javascript
   export default function myMethod(params, peerId) {
       const strParams = JSON.parse(uint8ArrayToString(params));
       // logic here
       return uint8ArrayFromString(JSON.stringify(resultObject));
   }
   ```

   Where `resultObject` should contain:

   - `data`: The resultant data, maintaining type integrity.
   - `dataType`: A string indicating the JavaScript data type of `data`.

Example:

```javascript
// methods/add.js

export default function add(params, peerId) {
    console.log(`Addition request from ${peerId.toString()}`);
    const strParams = JSON.parse(uint8ArrayToString(params));
    const [a, b] = strParams;
    if (typeof a !== 'number' || typeof b !== 'number') {
        throw new RPCException("Parameters must be numbers", 2);
    }
    const result = a + b;
    return uint8ArrayFromString(JSON.stringify({
        data: result,
        dataType: typeof result
    }));
}
```

### Managing Data in Responses

Upon receiving data in a response, utilize the `data` and `dataType` attributes for effective data management and type-checking.

```javascript
const { data, dataType } = JSON.parse(response);
if (dataType !== 'number') {
    throw new Error(`Unexpected data type received: ${dataType}`);
}
```

### Error Management Strategies

Ensure rigorous error handling is in place to manage unanticipated scenarios or method invocation failures. Utilize `try/catch` blocks or alternative error-handling mechanisms to gracefully manage both expected and unforeseen issues.

### Final Thoughts

Developers, by comprehending and harnessing the modular design and communication capabilities of the `RPCService` class, can architect scalable, decentralized applications that exploit the benefits of peer-to-peer communication and distributed computation. Ensure methods are thoroughly vetted and validated to preserve network integrity and accurate data management.
