const config = require('../../config')
const {poolManager, UnitTestFramework} = require('dwij-simple-orm').init(config)
const pool = poolManager.connect()
const controller = require('../../controllers/role.controller')

const testCases = {
    create: [
        {
            input: {
                body: {
                    id: 9876,
                    name: 'Tester Role',
                    description: 'This is tested from jest'
                }
            },
            output: {httpCode: 201},
            description: 'Success should returning affectedRows = 1'
        },{
            input: {
                body: {
                    id: 9876,
                    nameX: 'Tester Role',
                    description: 'This is tested from jest'
                }
            },
            output: {httpCode: 400, code: 'ER_BAD_FIELD_ERROR'},
            description: 'Invalid keys should returning httpCode 400'
        },{
            input: {},
            output: {httpCode: 400, code: 'ER_INVALID_BODY'},
            description: 'Invalid body should returning httpCode 400'
        }
    ],
    read: [
        {
            input: {params:{id: 9876}},
            output: {httpCode: 200, data: [{id: 9876, name: 'Tester Role'}]},
            description: 'input params.id should run model.findByPk and returning array'
        },{
            input: {query:{id: [9876, 1]}},
            output: {httpCode: 200, data: [{id: 9876, name: 'Tester Role'}, {id: 1}]},
            description: 'input query.id should run model.findByKeys and returning array'
        },{
            input: {body: {id: 9876}},
            output: {httpCode: 400, code: 'ER_GET_REFUSE_BODY'},
            description: 'input body.id should return error code ER_GET_REFUSE_BODY'
        },{
            input: {},
            output: {httpCode: 200, data: [{id: 9876, name: 'Tester Role'}]},
            description: 'input empty request object should run findAll'
        },{
            input: {query: {id: 99999}},
            output: {httpCode: 404, code: 'ER_NOT_FOUND'},
            description: 'Not found should returning httpCode 404'
        }
    ],
    update: [
        {
            input: {
                body: {
                    id: 9876,
                    name: 'Updated Role',
                    description: 'This is tested from jest'
                }
            },
            output: {httpCode: 200},
            description: 'Success should returning truthly'
        },{
            input: {
                body: {
                    id: 9876,
                    nameX: 'Updated Role',
                    description: 'This is tested from jest'
                }
            },
            output: {httpCode: 400, code: 'ER_BAD_FIELD_ERROR'},
            description: 'Invalid keys should returning httpCode 400'
        },{
            input: {},
            output: {httpCode: 400, code: 'ER_INVALID_BODY'},
            description: 'Invalid body should returning httpCode 400'
        }
    ],
    delete: [
        {
            input: {params: {id: 9876}},
            output: {httpCode: 200},
            description: 'Success should returning affectedRows = 1'
        },{
            input: {params: {id: 9999}},
            output: {httpCode: 404, code: 'ER_NOT_FOUND'},
            description: 'Not found should returning httpCode 404'
        },{
            input: {params: {id: 1}},
            output: {httpCode: 400, code: 'ER_ROW_IS_REFERENCED_2'},
            description: 'Foreign Key fails should returning httpCode 400'
        },{
            input: {},
            output: {httpCode: 400, code: 'ER_INVALID_BODY'},
            description: 'Invalid body should returning httpCode 400'
        }
    ]
}

const testModule = () => {
    const res = {}
    const next = (req) => () => req.result
    const test = (method, req) => controller[method](req, res, next(req))

    return {
        create: (req) => test('create', req),
        read: (req) => test('read', req),
        update: (req) => test('update', req),
        delete: (req) => test('destroy', req)
    }
}

const test = new UnitTestFramework(testCases, testModule())

test.setBeforeAll = async () => {
    await require('../../utils/truncator')
    await require('../../migrations')
    await require('../../seeders')
}

test.setAfterAll = async () => {
    await pool.end()
}
test.runTest()