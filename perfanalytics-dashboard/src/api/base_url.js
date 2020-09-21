export const API_BASE = process.env.REACT_APP_SERVICE_URL
export function getURL(path){
  return API_BASE + path
}
