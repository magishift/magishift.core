"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const platform_express_1 = require("@nestjs/platform-express");
const aws_serverless_express_1 = require("aws-serverless-express");
const middleware_1 = require("aws-serverless-express/middleware");
const keycloak_module_1 = require("./keycloak.module");
// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
// due to a compressed response (e.g. gzip) which has not been handled correctly
// by aws-serverless-express and/or API Gateway. Add the necessary MIME types to
// binaryMimeTypes below
const binaryMimeTypes = [];
let cachedServer;
process.on('unhandledRejection', reason => {
    console.error(reason);
});
process.on('uncaughtException', reason => {
    console.error(reason);
});
async function bootstrapServer() {
    if (!cachedServer) {
        try {
            const expressApp = require('express')();
            const adapter = new platform_express_1.ExpressAdapter(expressApp);
            const nestApp = await core_1.NestFactory.create(keycloak_module_1.KeycloakModule, adapter);
            nestApp.use(middleware_1.eventContext());
            await nestApp.init();
            cachedServer = aws_serverless_express_1.createServer(expressApp, undefined, binaryMimeTypes);
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    return Promise.resolve(cachedServer);
}
exports.handler = async (event, context) => {
    if (!cachedServer) {
        cachedServer = await bootstrapServer();
    }
    return aws_serverless_express_1.proxy(cachedServer, event, context, 'PROMISE').promise;
};
