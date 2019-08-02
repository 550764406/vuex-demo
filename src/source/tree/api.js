import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:8888/';

export const getTreeList = ()=>{
    return axios.get('/getTreeList')
};
