import axios from "axios";
import { getURL } from './base_url'

const metricsBaseURL = (path = '') => getURL(`/metrics${path}`)

export const getMetrics = async ({onSuccess, onError} = {}, queryParams = '') => {
  try {
    const result = await axios(`${metricsBaseURL()}${queryParams}`)
    if(onSuccess) onSuccess(result);
    return result;
  } catch (err) {
    if(onError) onError(err);
  }
}
