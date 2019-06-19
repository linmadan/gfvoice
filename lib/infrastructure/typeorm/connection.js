const _ = require('lodash')
const {
    createConnection
} = require('typeorm')
const constant = require('../../util/constant')

class Connection {
    constructor() {
        this._connection = null
    }

    async connect() {
        this._connection = await createConnection({
            type: "mysql",
            host: constant.MYSQL.HOST,
            port: constant.MYSQL.PORT,
            username: constant.MYSQL.USER,
            password: constant.MYSQL.PASSWORD,
            database: constant.MYSQL.DB_NAME,
            synchronize: constant.MYSQL.FORBID_SYNCHRONIZE,
            dropSchema: false,
            entities: [
                `${__dirname}/entitySchemas/*.js`,
            ]
        })
    }

    async disconnect() {
        if (_.isNull(this._connection)) {
            return
        }
        await this._connection.close()
    }
}

function createDBConnection() {
    return new Connection()
}

module.exports = createDBConnection;
