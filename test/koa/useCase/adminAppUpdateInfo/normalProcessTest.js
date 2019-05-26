const http = require('http')
const expect = require('chai').expect
const request = require('supertest')
const app = require('../../../../lib/koa')
const {
    createDBConnection
} = require('../../../../lib/infrastructure')

describe('AppUpdateInfo类型管理正常流程，用例测试', () => {
    let server
    let dBConnection
    let appUpdateInfoID
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
    describe('创建新的AppUpdateInfo类型', () => {
        it('创建一个新的AppUpdateInfo类型', done => {
            request(server)
                .post("/admin/app-update-infos")
                .send({
                    vcode: 1,
                    version: "0.0.1",
                    channel: "test-channel",
                    mustUpdate: 1,
                    appUrl: "test-appUrl",
                    desc: "test-desc-1",
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
                    appUpdateInfoID = res.body.data.id
                    done()
                })
        })
    })
    describe('获取指定ID的AppUpdateInfo类型', () => {
        it('返回指定ID的AppUpdateInfo类型', done => {
            request(server)
                .get(`/admin/app-update-infos/${appUpdateInfoID}`)
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
                    expect(res.body.data.id).to.equal(appUpdateInfoID)
                    done()
                })
        })
    })
    describe('更新AppUpdateInfo类型', () => {
        it('更新指定ID的AppUpdateInfo类型', done => {
            request(server)
                .put(`/admin/app-update-infos/${appUpdateInfoID}`)
                .send({
                    desc: "test-desc-update",
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
                    expect(res.body.data.id).to.equal(appUpdateInfoID)
                    expect(res.body.data.desc).to.equal("test-desc-update")
                    done()
                })
        })
        it('返回更新后的AppUpdateInfo类型', done => {
            request(server)
                .get(`/admin/app-update-infos/${appUpdateInfoID}`)
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
                    expect(res.body.data.id).to.equal(appUpdateInfoID)
                    done()
                })
        })
    })
    describe('获取所有AppUpdateInfo类型', () => {
        it('返回所有的AppUpdateInfo类型', done => {
            request(server)
                .get("/admin/app-update-infos")
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
    describe('删除AppUpdateInfo类型', () => {
        it('删除指定ID的AppUpdateInfo类型', done => {
            request(server)
                .delete(`/admin/app-update-infos/${appUpdateInfoID}`)
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
        it('返回所有的AppUpdateInfo类型', done => {
            request(server)
                .get("/admin/app-update-infos")
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
