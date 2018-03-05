import Env from './env';

let config = {
    env: Env,
    webSocketUrl: "wss://alpha.otcmaker.com:8080/",
    poundage: 0.005,    //手续费
    wordNumberLimit: 500  //字数限制
};
export default config;