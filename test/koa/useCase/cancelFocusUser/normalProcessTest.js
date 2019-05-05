const http = require('http')
const expect = require('chai').expect
const request = require('supertest')
const app = require('../../../../lib/koa')
const {
    createDBConnection
} = require('../../../../lib/infrastructure')

describe('取消关注用户用例测试', () => {
    let server
    let dBConnection
    let focuserID
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
    describe('', () => {
        it('手机号注册一个用户', done => {
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
                    focuserID = res.body.data.id
                    done()
                })
        })
        it('成功关注', done => {
            request(server)
                .post(`/users/1/focus`)
                .send({
                    focuserID: focuserID
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
                    done()
                })
        })
        it('取消关注用户', done => {
            request(server)
                .post("/users/1/cancel-focus")
                .send({
                    focuserID: focuserID
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
                    done()
                })
        })
        it('关注关系不存在，取消关注用户失败', done => {
            request(server)
                .post("/users/1/cancel-focus")
                .send({
                    focuserID: focuserID
                })
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        done(err)
                        return
                    }
                    expect(res.body.code).to.equal(1105)
                    done()
                })
        })
    })
})
