import { RPCException } from "@organicdesign/libp2p-rpc";
import { fromString as uint8ArrayFromString, toString as uint8ArrayToString } from 'uint8arrays';

const add = (params, peerId) => {
  console.log(`Addition request from ${peerId.toString()}`);
  const strParams = JSON.parse(uint8ArrayToString(params))[0];
  const [a, b] = strParams;
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new RPCException("Parameters must be numbers", 2);
  }

  const result = a + b;

  const response = {
    data: result,
    dataType: typeof result
  };

  return uint8ArrayFromString(JSON.stringify(response));
};

export default add;
