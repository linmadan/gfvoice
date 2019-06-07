const http = require('http')
const expect = require('chai').expect
const request = require('supertest')
const app = require('../../../../lib/koa')
const {
    createDBConnection
} = require('../../../../lib/infrastructure')

describe('Image类型管理正常流程，用例测试', () => {
    let server
    let dBConnection
    let imageID
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
    describe('创建新的Image类型', () => {
        it('创建一个新的Image类型', done => {
            request(server)
                .post("/admin/images")
                .send({
                    url: "test-url-1",
                    type:"1"
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
                    imageID = res.body.data.id
                    done()
                })
        })
    })
    describe('获取指定ID的Image类型', () => {
        it('返回指定ID的Image类型', done => {
            request(server)
                .get(`/admin/images/${imageID}`)
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
                    expect(res.body.data.id).to.equal(imageID)
                    done()
                })
        })
    })
    describe('更新Image类型', () => {
        it('更新指定ID的Image类型', done => {
            request(server)
                .put(`/admin/images/${imageID}`)
                .send({
                    url: "test-url-update",
                    type:"1"
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
                    expect(res.body.data.id).to.equal(imageID)
                    expect(res.body.data.url).to.equal("test-url-update")
                    done()
                })
        })
        it('返回更新后的Image类型', done => {
            request(server)
                .get(`/admin/images/${imageID}`)
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
                    expect(res.body.data.id).to.equal(imageID)
                    expect(res.body.data.url).to.equal("test-url-update")
                    done()
                })
        })
    })
    describe('获取所有Image类型', () => {
        it('返回所有的Image类型', done => {
            request(server)
                .get("/admin/images")
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
    })
    describe('删除Image类型', () => {
        it('删除指定ID的Image类型', done => {
            request(server)
                .delete(`/admin/images/${imageID}`)
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
        it('返回所有的Image类型', done => {
            request(server)
                .get("/admin/images")
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
    })
})
