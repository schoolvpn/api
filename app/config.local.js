module.exports = {
    mongodb: `mongodb://localhost:27017/API`, // "mongodb://HOSTNAME:PORT/DATABASE"
    jwt_secret: `SuperSecureSecret`, // SuperSecretSecret
    port: 81 || process.env.API_PORT // 80
};
  