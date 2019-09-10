export const DEV = process.env.NODE_ENV === 'development' ? true : false;
export const URL = DEV === true ? "http://51.38.187.216:9090" : "http://51.38.187.216:9000/api/v1"
