const http = require('http')
const expect = require('chai').expect
const request = require('supertest')
const app = require('../../../../lib/koa')
const {
    createDBConnection
} = require('../../../../lib/infrastructure')

describe('Poetry类型管理正常流程，用例测试', () => {
    let server
    let dBConnection
    let poetryID
    let poetryTypeID
    before(done => {
        server = http.createServer(app.callback()).listen(3000, (err) => {
            if (err) {
                done(err)
            } else {
                dBConnection = createDBConnection()
                dBConnection.connect().then(() => {
                    request(server)
                        .post("/admin/poetry-types")
                        .send({
                            name: "test-name-1",
                            pic: "test-pic-1"
                        })
                        .set('Accept', 'application/json')
                        .end((err, res) => {
                            if (err) {
                                done(err)
                                return
                            }
                            poetryTypeID = res.body.data.id
                            done()
                        })
                }).catch(err => {
                    done(err)
                })
            }
        })
    })
    after(done => {
        request(server)
            .delete(`/admin/poetry-types/${poetryTypeID}`)
            .end((err, res) => {
                if (err) {
                    done(err)
                    return
                }
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
    })
    describe('创建新的Poetry类型', () => {
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
                    expect(res.body.msg).to.equal("ok")
                    expect(res.body.data).to.be.exist
                    poetryID = res.body.data.id
                    done()
                })
        })
    })
    describe('获取指定ID的Poetry类型', () => {
        it('返回指定ID的Poetry类型', done => {
            request(server)
                .get(`/admin/poetries/${poetryID}`)
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
                    expect(res.body.data.id).to.be.equal(poetryID)
                    done()
                })
        })
    })
    describe('更新Poetry类型', () => {
        it('更新指定ID的Poetry类型', done => {
            request(server)
                .put(`/admin/poetries/${poetryID}`)
                .send({
                    name: "test-name-update",
                    word: "test-word-update",
                    author: "test-author-update",
                    accompany: "test-accompany-update",
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
                    expect(res.body.msg).to.equal("ok")
                    expect(res.body.data.id).to.be.equal(poetryID)
                    expect(res.body.data.name).to.be.equal("test-name-update")
                    done()
                })
        })
        it('返回更新后的Poetry类型', done => {
            request(server)
                .get(`/admin/poetries/${poetryID}`)
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
                    expect(res.body.data.id).to.be.equal(poetryID)
                    expect(res.body.data.name).to.be.equal("test-name-update")
                    done()
                })
        })
    })
    describe('获取所有Poetry类型', () => {
        it('返回所有的Poetry类型', done => {
            request(server)
                .get("/admin/poetries")
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
                    expect(res.body.data.count).to.be.equal(1)
                    done()
                })
        })
    })
    describe('删除Poetry类型', () => {
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
                    expect(res.body.msg).to.equal("ok")
                    expect(res.body.data).to.be.exist
                    done()
                })
        })
        it('返回所有的Poetry类型', done => {
            request(server)
                .get("/admin/poetries")
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        done(err)
                        return
                    }
                    expect(res.body.code).to.equal(0)
                    expect(res.body.msg).to.equal("ok")
                    expect(res.body.data.count).to.be.equal(0)
                    done()
                })
        })
    })
})
