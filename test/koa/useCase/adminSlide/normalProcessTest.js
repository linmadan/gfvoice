const http = require('http')
const expect = require('chai').expect
const request = require('supertest')
const app = require('../../../../lib/koa')
const {
    createDBConnection
} = require('../../../../lib/infrastructure')

describe('Slide类型管理正常流程，用例测试', () => {
    let server
    let dBConnection
    let slideID
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
    describe('创建新的Slide类型', () => {
        it('创建一个新的Slide类型', done => {
            request(server)
                .post("/admin/slides")
                .send({
                    type: 1,
                    pic: "test-pic-1",
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
                    slideID = res.body.data.id
                    done()
                })
        })
    })
    describe('获取指定ID的Slide类型', () => {
        it('返回指定ID的Slide类型', done => {
            request(server)
                .get(`/admin/slides/${slideID}`)
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
                    expect(res.body.data.id).to.be.equal(slideID)
                    done()
                })
        })
    })
    describe('更新Slide类型', () => {
        it('更新指定ID的Slide类型', done => {
            request(server)
                .put(`/admin/slides/${slideID}`)
                .send({
                    type: 1,
                    pic: "test-pic-update",
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
                    expect(res.body.data.id).to.be.equal(slideID)
                    expect(res.body.data.pic).to.be.equal("test-pic-update")
                    done()
                })
        })
        it('返回更新后的Slide类型', done => {
            request(server)
                .get(`/admin/slides/${slideID}`)
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
                    expect(res.body.data.id).to.be.equal(slideID)
                    expect(res.body.data.pic).to.be.equal("test-pic-update")
                    done()
                })
        })
    })
    describe('获取所有Slide类型', () => {
        it('返回所有的Slide类型', done => {
            request(server)
                .get("/admin/slides")
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
    })
    describe('删除Slide类型', () => {
        it('删除指定ID的Slide类型', done => {
            request(server)
                .delete(`/admin/slides/${slideID}`)
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
        it('返回所有的Slide类型', done => {
            request(server)
                .get("/admin/slides")
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
