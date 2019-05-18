const http = require('http')
const expect = require('chai').expect
const request = require('supertest')
const app = require('../../../../lib/koa')
const {
    createDBConnection
} = require('../../../../lib/infrastructure')

describe('举报用例测试', () => {
    let server
    let dBConnection
    let userID
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
    describe('举报', () => {
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
                    userID = res.body.data.id
                    done()
                })
        })
        it('举报用户成功', done => {
            request(server)
                .post(`/users/1/complain`)
                .send({
                    reason:"低俗色情",
                    fromUserID: userID
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
        it('举报已经举报过的用户时，举报失败', done => {
            request(server)
                .post(`/users/1/complain`)
                .send({
                    reason:"低俗色情",
                    fromUserID: userID
                })
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        done(err)
                        return
                    }
                    expect(res.body.code).to.equal(107)
                    done()
                })
        })
        it('举报用户演唱的诗歌声音成功', done => {
            request(server)
                .post(`/poetry-voices/1/complain`)
                .send({
                    reason:"攻击引战",
                    fromUserID: userID
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
        it('举报已经举报过的用户演唱的诗歌声音时，举报失败', done => {
            request(server)
                .post(`/users/1/complain`)
                .send({
                    reason:"攻击引战",
                    fromUserID: userID
                })
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        done(err)
                        return
                    }
                    expect(res.body.code).to.equal(107)
                    done()
                })
        })
    })
})
