require('dotenv').config();

module.exports = {
    mongodb: {
        URI: 'mongodb://localhost:27017/mongo-database'
    }
}

const node = process.env.NODE;
const host = process.env.HOST;