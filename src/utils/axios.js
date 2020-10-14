const axios = require('axios');

class Axios {
    constructor(baseUrl) {
        this.axios = axios.default.create({ baseURL });
    };

    /**
     * send request automaticlly and return data
     * @param {Object} req axios object
     * @return {Promise<Object>} data
     */
    async sendRequest(req) {
        let data = await axios(req);

        if (401 || 403) {
            return await this._lockRequest(req);
        } else {
            return data;
        };
    };
    
    async _lockReqeust(req) {
        await this.getAccessToken(this.reqAccessToken);
        return await this.sendRequest(req);
    };

    async getAccessToken(req) {
        let data = await axios(req);

        this.reqAccessToken = req;
        console.log(data.response); // find accessToken
        this.accessToken = accessToken;
    };
};

module.exports = Axios;