const { Op } = require("sequelize")
const Helper = require("../helper/helper")
const {
    User,
    UserProfile,
    Portofolio,
    PortofolioCompany,
    Company
} = require("../models/index")

const bcryptjs = require(`bcryptjs`)

class Controller {
    static async loginPage(req, res) {
        const { error } = req.query
        try {
            res.render(`page-login`, { error })
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    static async postLogin(req, res) {
        const { email, password } = req.body
        try {
            let user = await User.findOne({ where: { email } })
            if (user) {
                const isPasswordValid = bcryptjs.compareSync(password, user.password)

                if (isPasswordValid) {
                    req.session.user = { id: user.id, role: user.role }
                    res.redirect(`/home`)
                } else {
                    const error = `Invalid password`
                    res.redirect(`/login?error=${error}`)
                }
            } else {
                const error = `Invalid email`
                res.redirect(`/login?error=${error}`)
            }
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }


    static async homePage(req, res) {
        const { search } = req.query
        try {
            let q = { include: { model: Company, attributes: ['name', 'sector'] }, attributes: ['id', 'value'], where: { UserId: req.session.user.id }, order: [['value', 'DESC']] }
            if (search) {
                q.include.where = { name: { [Op.iLike]: `%${search}%` } }
            }
            let dataPortofolio = await Portofolio.findAll(q)
            // res.send(dataPortofolio)
            res.render(`home-page`, { dataPortofolio, Helper })
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    static async editPortofolio(req, res) {
        const { id } = req.params
        try {
            let dataPortofolioById = await Portofolio.findByPk(id, { include: { model: Company, attributes: { exclude: ['createdAt', 'updatedAt'] } }, attributes: { exclude: ['createdAt', 'updatedAt'] } })
            res.render(`edit-page`, { dataPortofolioById })
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    static async postEditPortofolio(req, res) {
        const { id } = req.params
        try {
            await Portofolio.update(req.body, { where: { id: id } })
            res.redirect(`/home`)
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    static async deletePortofolio(req, res) {
        const { id } = req.params
        try {
            let dataPortofolioById = await Portofolio.findByPk(id)
            await dataPortofolioById.destroy()
            res.redirect(`/home`)
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    static async adminPage(req, res) {
        try {
            res.send(`admin-page`)
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    static async logout(req, res) {
        try {
            req.session.destroy(err => {
                if (err) {
                    throw err
                } else {
                    res.redirect(`/login`)
                }
            })
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }
}

module.exports = Controller