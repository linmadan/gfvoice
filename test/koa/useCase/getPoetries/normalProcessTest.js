const http = require('http')
const expect = require('chai').expect
const request = require('supertest')
const app = require('../../../../lib/koa')
const {
    createDBConnection
} = require('../../../../lib/infrastructure')

describe('获取诗歌列表用例测试', () => {
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
    describe('获取诗歌列表', () => {
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
        it('返回空的诗歌列表，如果分类id不存在', done => {
            request(server)
                .get(`/poetries?poetryTypeID=1`)
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
        it('根据分类id,返回诗歌列表', done => {
            request(server)
                .get(`/poetries?poetryTypeID=${poetryTypeID}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        done(err)
                        return
                    }
                    expect(res.body.code).to.equal(0)
                    expect(res.body.msg).to.equal("ok")
                    expect(res.body.data.count).to.equal(1)
                    done()
                })
        })
        it('根据诗歌名称匹配,返回诗歌列表', done => {
            request(server)
                .get(`/poetries?word=test`)
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
        it('根据诗歌作者匹配,返回诗歌列表', done => {
            request(server)
                .get(`/poetries?word=author`)
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
