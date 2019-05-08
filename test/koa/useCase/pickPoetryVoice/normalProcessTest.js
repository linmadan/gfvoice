const http = require('http')
const expect = require('chai').expect
const request = require('supertest')
const app = require('../../../../lib/koa')
const {
    createDBConnection
} = require('../../../../lib/infrastructure')

describe('用户pick诗歌演唱声音用例测试', () => {
    let server
    let dBConnection
    let poetryID
    let poetryTypeID
    let poetryVoiceID
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
    describe('用户pick诗歌演唱声音', () => {
        it('创建一个新的诗歌类型', done => {
            request(server)
                .post("/admin/poetry-types")
                .send({
                    name: "test-name-1",
                    pic: "test-pic-1"
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
                    poetryTypeID = res.body.data.id
                    done()
                })
        })
        it('创建一个新的Poetry类型', done => {
            request(server)
                .post("/admin/poetries")
                .send({
                    name: "test-name-1",
                    word: "test-word-1",
                    author: "test-author-1",
                    accompany: "test-accompany-1",
                    poetryTypeID: poetryTypeID,
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
                    poetryID = res.body.data.id
                    done()
                })
        })
        it('提交演唱声音', done => {
            request(server)
                .post("/poetry-voices/submit")
                .send({
                    av: "test-av",
                    bgState: 1,
                    userID: 1,
                    poetryID: poetryID,
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
                    poetryVoiceID = res.body.data.id
                    done()
                })
        })
        it('用户pick诗歌演唱声音成功', done => {
            request(server)
                .post(`/poetry-voices/${poetryVoiceID}/pick`)
                .send({
                    userID: 1
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
                    done()
                })
        })
        it('重复pick诗歌演唱声音返回失败对象', done => {
            request(server)
                .post(`/poetry-voices/${poetryVoiceID}/pick`)
                .send({
                    userID: 1
                })
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        done(err)
                        return
                    }
                    expect(res.body.code).to.equal(1106)
                    done()
                })
        })
        it('删除指定ID的Poetry类型', done => {
            request(server)
                .delete(`/admin/poetries/${poetryID}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        done(err)
                        return
                    }
                    expect(res.body.code).to.equal(0)
                    done()
                })
        })
        it('删除指定ID的诗歌类型', done => {
            request(server)
                .delete(`/admin/poetry-types/${poetryTypeID}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        done(err)
                        return
                    }
                    expect(res.body.code).to.equal(0)
                    done()
                })
        })
    })
})
