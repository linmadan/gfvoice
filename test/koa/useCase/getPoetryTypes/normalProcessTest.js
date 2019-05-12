const http = require('http')
const expect = require('chai').expect
const request = require('supertest')
const app = require('../../../../lib/koa')
const {
    createDBConnection
} = require('../../../../lib/infrastructure')

describe('获取诗歌分类数据用例测试', () => {
    let server
    let dBConnection
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
    describe('获取诗歌分类数据', () => {
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
        it('返回诗歌分类数据', done => {
            request(server)
                .get("/poetries/types")
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
                    expect(res.body.data.list).to.exist
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
