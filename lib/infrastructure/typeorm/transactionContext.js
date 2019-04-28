const {
    getConnection
} = require('typeorm')

class TransactionContext {
    constructor() {
        this.queryRunner = getConnection().createQueryRunner()
    }

    async startTransaction() {
        await this.queryRunner.connect()
        await this.queryRunner.startTransaction()
    }

    async commitTransaction() {
        await this.queryRunner.commitTransaction()
    }

    async rollbackTransaction() {
        await this.queryRunner.rollbackTransaction()
    }

    async release() {
        await this.queryRunner.release()
    }
}

function createTransactionContext() {
    return new TransactionContext()
}

module.exports = createTransactionContext
