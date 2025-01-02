const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://chatbot-server-seoin2744-945239b11b47.herokuapp.com/',
            changeOrigin: true,
        })
    );
};
