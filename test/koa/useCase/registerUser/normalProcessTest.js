const http = require('http')
const expect = require('chai').expect
const request = require('supertest')
const app = require('../../../../lib/koa')
const {
    createDBConnection
} = require('../../../../lib/infrastructure')

describe('用户注册用例测试', () => {
    let server
    let dBConnection
    before(done => {
        server = http.createServer(app.callback()).listen(3000, (err) => {
            if (err) {
                done(err)
            } else {
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
            } else {
                dBConnection.disconnect().then(() => {
                    done()
                }).catch(err => {
                    done(err)
                })
            }
        })
    })
    describe('用户注册', () => {
        it('手机号注册，成功返回用户对象', done => {
            request(server)
                .post("/users/register")
                .send({
                    name: "test-name",
                    phone: "123456789101",
                    registerType: 1,
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
                    expect(res.body.data).to.be.exist
                    expect(res.body.data.name).to.be.equal("test-name")
                    done()
                })
        })
        it('第三方平台注册，成功返回用户对象', done => {
            request(server)
                .post("/users/register")
                .send({
                    name: "test-name",
                    platID: "openid",
                    registerType: 2,
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
                    expect(res.body.data).to.be.exist
                    expect(res.body.data.name).to.be.equal("test-name")
                    done()
                })
        })
    })
})
