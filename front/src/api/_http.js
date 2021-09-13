// import { getToken } from '@lib/datahandlers/global';
const API_URL = "http://localhost:5000/admin";


export const request = async (
    method,
    url,
    params,
    data,
    headers = {},
    // showNetworkError = true,
) => {
    const token =  ""; // await getToken();
    
    const response = await fetch(API_URL + url, 
            {
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept-Language': 'fr',
                    Authorization: token ? `Bearer ${token}`: undefined,
                    ...headers
                },
                method,
                body: JSON.stringify(data),
            });
    const json = await response.json();
    return json;
}
