const config = require('../../config')
const {poolManager, UnitTestFramework} = require('dwij-simple-orm').init(config)
const pool = poolManager.connect()
const Model = require('../../models/role.model')

const testCases = {
    create: [
        {
            input: {id: 54321, name: 'Tester Role', description: 'This is tested from jest'},
            description: 'Success should returning affectedRows = 1'
        },{
            input: {nameX: 'Tester Role', description: 'This is tested from jest'},
            output: {code: 'ER_BAD_FIELD_ERROR'},
            description: 'Invalid input should throwing error code ER_BAD_FIELD_ERROR'
        },{
            input: undefined,
            output: {code: 'ER_INVALID_BODY'},
            description: 'Invalid input should throwing error code ER_INVALID_BODY'
        }
    ],
    findByPk: [
        {
            input: 54321,
            output: {data: [{id: 54321, name: 'Tester Role'}]},
            description: 'Success should returning array of objects'
        },{
            input: 99999,
            output: {code: 'ER_NOT_FOUND'},
            description: 'Empty result should throwing error code ER_NOT_FOUND'
        },{
            input: undefined,
            output: {code: 'ER_INVALID_BODY'},
            description: 'Invalid input should throwing error code ER_INVALID_BODY'
        }
    ],
    findAll: [
        {
            input: {},
            output: {data: [{id: 54321, name: 'Tester Role'}]},
            description: 'Success should returning array of objects'
        },{
            input: undefined,
            output: {code: 'ER_INVALID_BODY'},
            description: 'Invalid input should throwing error code ER_INVALID_BODY'
        }
    ],
    findByKeys: [
        {
            input: {id: 54321, name: 'Tes'},
            output: {data: [{id: 54321, name: 'Tester Role'}]},
            description: 'Success should returning array of objects'
        },{
            input: {id: 54321, nameX: 'Tes', unknownKey: 'Unknown'},
            output: {code: 'ER_NOT_FOUND'},
            description: 'Empty result should throwing error code ER_NOT_FOUND'
        },{
            input: undefined,
            output: {code: 'ER_INVALID_BODY'},
            description: 'Invalid input should throwing error code ER_INVALID_BODY'
        }
    ],
    update: [
        {
            input: {id: 54321, name: 'New Role'},
            description: 'Success should retunr truthly'
        },{
            input: {id: 54321, nameX: 'New Role'},
            output: {code: 'ER_BAD_FIELD_ERROR'},
            description: 'Invalid input should throwing error code ER_BAD_FIELD_ERROR'
        },{
            input: undefined,
            output: {code: 'ER_INVALID_BODY'},
            description: 'Invalid input should throwing error code ER_INVALID_BODY'
        }
    ],
    delete: [
        {
            input: 54321,
            description: 'Success should return truthly'
        },{
            input: 99999,
            output: {code: 'ER_NOT_FOUND'},
            description: 'Empty result should throwing error code ER_NOT_FOUND'
        },{
            input: undefined,
            output: {code: 'ER_INVALID_BODY'},
            description: 'Invalid input should throwing error code ER_INVALID_BODY'
        }
    ]
}

const testModule = new Model()

const test = new UnitTestFramework(testCases, testModule)

test.setBeforeAll = async () => {
    await require('../../utils/truncator')
    await require('../../migrations')
    await require('../../seeders')
}

test.setAfterAll = async () => {
    await pool.end()
}
test.runTest()