const config = require('../../config')
const {poolManager, UnitTestFramework} = require('dwij-simple-orm').init(config)
const pool = poolManager.connect()
const Model = require('../../models/user.model')

const testCases = {
    create: [
        {
            input: {
                id: 7654,
                roleId: 1,
                userName: 'TestUser1',
                password: '1234',
                email: 'email@gmail.com',
                name: 'DwiJ',
                phone: '+62123123123',
                address: 'Indonesia',
                nik: '1122334455'
            },
            description: 'Success should returning truthly'
        },{
            input: {
                roleIdX: 1,
                userName: 'TestUser1',
                password: '1234',
                email: 'email@gmail.com',
                name: 'DwiJ',
                phone: '+62123123123',
                address: 'Indonesia',
                nik: '1122334455'
            },
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
            input: 7654,
            output: {data: [{id: 7654, username: 'TestUser1'}]},
            description: 'Success should returning array of objects'
        },{
            input: 999999,
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
            output: {data: [{id: 7654, username: 'TestUser1'}]},
            description: 'Success should returning array of objects'
        },{
            input: undefined,
            output: {code: 'ER_INVALID_BODY'},
            description: 'Invalid input should throwing error code ER_INVALID_BODY'
        }
    ],
    findByKeys: [
        {
            input: {id:7654, username: 'Tes'},
            output: {data:[{id: 7654}]},
            description: 'Success should returning array of objects'
        },{
            input: {id:1, username: 'adm', other: 'unknown key'},
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
            input: {id: 7654, name: 'JuliantDwyne'},
            description: 'Success should return truthly'
        },{
            input: {id: 7654, nameX: 'JuliantDwyne'},
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
            input: 7654,
            description: 'Success should return truthly'
        },{
            input: 9999,
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