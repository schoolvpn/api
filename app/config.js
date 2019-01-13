module.exports = {
    mongodb: process.env.API_MONGODB, // "mongodb://HOSTNAME:PORT/DATABASE"
    jwt_secret: process.env.API_JWT_SECRET, // SuperSecretSecret
    port: 80 || process.env.API_PORT // 80
};
  