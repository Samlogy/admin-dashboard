import { api_url } from '../app.json';
// import axios from 'axios';
// import { getToken } from '@lib/datahandlers/global';

export const api = axios.create({ baseURL: api_url });

export const request = async (
    method,
    url,
    params,
    data,
    headers = {},
    showNetworkError = true,
) => {
    const token = await getToken();

    const response = await axios({
        url: api_url + url,
        method: method,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Accept-Language': 'fr',
            Authorization: token ? `Bearer ${token}`: undefined,
            ...headers,
        },
        data: data,
        params: params,
    })

    return response.data;
};