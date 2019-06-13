import serverApiAjax from '@/libs/serverApiCloudAjax'
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.serverPath.dev : config.serverPath.pro

let baseUrlOption = {
    baseUrl
} 
const axios = new serverApiAjax(baseUrlOption)
export default axios
