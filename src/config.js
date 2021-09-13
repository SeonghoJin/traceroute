import dotenv from 'dotenv'

console.log(dotenv.config())
const config = dotenv.config().parsed
const ipstack_api_key = config.REACT_APP_IPSTACK_API_KEY;

if (ipstack_api_key == null) {
    throw new Error('not imported ipstack_api_key. please import ipstack_api_key at .env.development file. .env.development file can be made envTemplate');
}

export {
    ipstack_api_key,
}

