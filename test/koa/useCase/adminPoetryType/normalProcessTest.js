const http = require('http')
const expect = require('chai').expect
const request = require('supertest')
const app = require('../../../../lib/koa')
const {
    createDBConnection
} = require('../../../../lib/infrastructure')

describe('诗歌类型管理正常流程，用例测试', () => {
    let server
    let dBConnection
    let poetryTypeID
    before(done => {
        server = http.createServer(app.callback()).listen(3000, (err) => {
            if (err) {
                done(err)
            }
            else {
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
            }
            else {
                dBConnection.disconnect().then(() => {
                    done()
                }).catch(err => {
                    done(err)
                })
            }
        })
    })
    describe('创建新的诗歌类型', () => {
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
                    expect(res.body.msg).to.equal("ok")
                    expect(res.body.data).to.be.exist
                    poetryTypeID = res.body.data.id
                    done()
                })
        })
    })
    describe('获取指定ID的诗歌类型', () => {
        it('返回指定ID的诗歌类型', done => {
            request(server)
                .get(`/admin/poetry-types/${poetryTypeID}`)
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
                    expect(res.body.data.id).to.be.equal(poetryTypeID)
                    done()
                })
        })
    })
    describe('更新诗歌类型', () => {
        it('更新指定ID的诗歌类型', done => {
            request(server)
                .put(`/admin/poetry-types/${poetryTypeID}`)
                .send({
                    name: "test-name-update",
                    pic: "test-pic-update"
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
                    expect(res.body.data.id).to.be.equal(poetryTypeID)
                    expect(res.body.data.name).to.be.equal("test-name-update")
                    expect(res.body.data.pic).to.be.equal("test-pic-update")
                    done()
                })
        })
        it('返回更新后的诗歌类型', done => {
            request(server)
                .get(`/admin/poetry-types/${poetryTypeID}`)
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
                    expect(res.body.data.id).to.be.equal(poetryTypeID)
                    expect(res.body.data.name).to.be.equal("test-name-update")
                    expect(res.body.data.pic).to.be.equal("test-pic-update")
                    done()
                })
        })
    })
    describe('获取所有诗歌类型', () => {
        it('返回所有的诗歌类型', done => {
            request(server)
                .get("/admin/poetry-types")
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
    describe('删除诗歌类型', () => {
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
                    expect(res.body.msg).to.equal("ok")
                    expect(res.body.data).to.be.exist
                    done()
                })
        })
        it('返回所有的诗歌类型', done => {
            request(server)
                .get("/admin/poetry-types")
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
