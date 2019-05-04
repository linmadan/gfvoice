const http = require('http')
const expect = require('chai').expect
const request = require('supertest')
const app = require('../../../../lib/koa')
const {
    createDBConnection
} = require('../../../../lib/infrastructure')

describe('用户登入用例测试', () => {
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
    describe('用户登入', () => {
        it('手机号码登入成功，返回用户对象与已关注用户id列表', done => {
            request(server)
                .post("/users/login")
                .send({
                    phone:"123456789101"
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
                    expect(res.body.data).to.exist
                    expect(res.body.data.user.phone).to.equal("123456789101")
                    expect(res.body.data.focusUserIDs).to.exist
                    done()
                })
        })
    })
})
