const http = require('http')
const expect = require('chai').expect
const request = require('supertest')
const app = require('../../../../lib/koa')
const {
    createDBConnection
} = require('../../../../lib/infrastructure')

describe('Word类型管理正常流程，用例测试', () => {
    let server
    let dBConnection
    let wordID
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
    describe('创建新的Word类型', () => {
        it('创建一个新的Word类型', done => {
            request(server)
                .post("/admin/words")
                .send({
                    title: "test-title-1",
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
                    wordID = res.body.data.id
                    done()
                })
        })
    })
    describe('获取指定ID的Word类型', () => {
        it('返回指定ID的Word类型', done => {
            request(server)
                .get(`/admin/words/${wordID}`)
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
                    expect(res.body.data.id).to.equal(wordID)
                    done()
                })
        })
    })
    describe('更新Word类型', () => {
        it('更新指定ID的Word类型', done => {
            request(server)
                .put(`/admin/words/${wordID}`)
                .send({
                    title: "test-title-update",
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
                    expect(res.body.data.id).to.equal(wordID)
                    expect(res.body.data.title).to.equal("test-title-update")
                    done()
                })
        })
        it('返回更新后的Word类型', done => {
            request(server)
                .get(`/admin/words/${wordID}`)
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
                    expect(res.body.data.id).to.equal(wordID)
                    expect(res.body.data.title).to.equal("test-title-update")
                    done()
                })
        })
    })
    describe('获取所有Word类型', () => {
        it('返回所有的Word类型', done => {
            request(server)
                .get("/admin/words")
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
                    expect(res.body.data.count).to.equal(1)
                    done()
                })
        })
    })
    describe('删除Word类型', () => {
        it('删除指定ID的Word类型', done => {
            request(server)
                .delete(`/admin/words/${wordID}`)
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
        it('返回所有的Word类型', done => {
            request(server)
                .get("/admin/words")
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        done(err)
                        return
                    }
                    expect(res.body.code).to.equal(0)
                    expect(res.body.msg).to.equal("ok")
                    expect(res.body.data.count).to.equal(0)
                    done()
                })
        })
    })
})
