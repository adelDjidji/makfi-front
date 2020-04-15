import axios from 'axios';

var options
const at = window.localStorage.getItem("at")
if (at!==null){
    options={
        //   'Accept': 'application/json, text/plain, */*',
          'Access-Control-Allow-Origin': '*',
          'authorization':'bearer '+ window.localStorage.getItem("at")
        }
}else 
    options={
          'Access-Control-Allow-Origin': '*',
        }

const Api= axios.create({
    baseURL: 'https://makfi.azurewebsites.net/api/',
    headers: {
        common: options
      }
  });
export const Api2 = axios.create({
    baseURL: 'https://makfi.azurewebsites.net/',
    headers: {
        common: options
      }
  });

export default Api;