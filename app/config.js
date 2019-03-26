module.exports = {
    mongodb: `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DATABASE}`, // "mongodb://HOSTNAME:PORT/DATABASE"
    jwt_secret: process.env.API_JWT_SECRET, // SuperSecretSecret
    port: 80 || process.env.API_PORT, // 80
    sendgrid: process.env.SENDGRID_API_KEY
};