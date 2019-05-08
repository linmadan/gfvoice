const http = require('http')
const expect = require('chai').expect
const request = require('supertest')
const app = require('../../../../lib/koa')
const {
    createDBConnection
} = require('../../../../lib/infrastructure')

describe('第三方登陆或者注册用例测试', () => {
    let server
    let dBConnection
    before(done => {
        server = http.createServer(app.callback()).listen(3000, (err) => {
            if (err) {
                done(err)
            }else {
                dBConnection = createDBConnection()
                dBConnection.connect().then(() => {
                    done()
                }).catch(err => {
                    done(err)
                })
            }
        })
    })
    after(done => {
        server.close(err => {
            if (err) {
                done(err)
            }else {
                dBConnection.disconnect().then(() => {
                    done()
                }).catch(err => {
                    done(err)
                })
            }
        })
    })
    describe('第三方登陆或者注册', () => {
        it('第三方平台登陆，成功返回用户对象', done => {
            request(server)
                .post("/users/third-login")
                .send({
                    name: "test-name",
                    platID: "test-plat-id",
                    registerType: 3,
                    gender: "f",
                    location: "测试地址",
                    birthday: "1984-01-01",
                    headImg: "image-url",
                })
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        done(err)
                        return
                    }
                    expect(res.body.code).to.equal(0)
                    expect(res.body.msg).to.equal("ok")
                    expect(res.body.data.user.platID).to.be.equal("test-plat-id")
                    expect(res.body.data.focusUserIDs).to.exist
                    done()
                })
        })
    })
})
