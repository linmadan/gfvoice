const http = require('http')
const expect = require('chai').expect
const request = require('supertest')
const app = require('../../../../lib/koa')
const {
    createDBConnection
} = require('../../../../lib/infrastructure')

describe('更新用户信息用例测试', () => {
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
    describe('更新用户信息', () => {
        it('手机号注册一个新用户', done => {
            request(server)
                .post("/users/register")
                .send({
                    name: "test-name",
                    phone: "123456789101",
                    registerType: 1,
                    gender: "f",
                    location: "测试地址",
                    birthday: "1984-01-01",
                    headImg: "image-url"
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
                    expect(res.body.data.name).to.be.equal("test-name")
                    userID = res.body.data.id
                    done()
                })
        })
        it('更新用户信息，成功返回更新后的用户对象', done => {
            request(server)
                .post(`/users/${userID}/update-info`)
                .send({
                    name: "update-name",
                    gender: "m",
                    location: "更新地址",
                    birthday: "1984-01-01",
                    headImg: "image-url",
                    pics: ["pic-url-1", "pic-url-2", "pic-url-3"]
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
                    expect(res.body.data.id).to.equal(userID)
                    expect(res.body.data.name).to.equal("update-name")
                    expect(res.body.data.info.gender).to.equal("m")
                    expect(res.body.data.info.location).to.equal("更新地址")
                    expect(res.body.data.info.pics.length).to.equal(3)
                    done()
                })
        })
    })
})
