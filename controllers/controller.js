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

    static async home(req, res) {
        const { search } = req.query
        try {
            let q = { include: { model: Company, attributes: ['name', 'address', 'sector'] }, attributes: ['id', 'value'], where: { UserId: req.session.user.id }, order: [['value', 'DESC']] }
            if (search) {
                q.include.where = { name: { [Op.iLike]: `%${search}%` } }
            }
            let dataPortofolio = await Portofolio.findAll(q)
            let dataProfile = await UserProfile.findOne({ where: { UserId: req.session.user.id } })
            // res.send(dataPortofolio)
            res.render(`page-home`, { dataPortofolio, dataProfile, Helper })
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    static async addPortofolio(req, res) {
        try {
            let dataCompanies = await Company.findAll({ attributes: ['id', 'name', 'sector'], order: [['name', 'ASC']] })
            res.render(`page-add-portofolio`, { dataCompanies })
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    static async postAddPortofolio(req, res) {
        const { CompanyId, value } = req.body
        try {
            const transaction = await Portofolio.sequelize.transaction(async t => {
                const newPortofolio = await Portofolio.create({ UserId: req.session.user.id, value: value }, { transaction: t })
                const newPortofolioCompany = await PortofolioCompany.create({ PortofolioId: newPortofolio.id, CompanyId: CompanyId }, { transaction: t })
                return { newPortofolio, newPortofolioCompany }
            })
            res.redirect(`/home`)
        } catch (error) {
            console.log(error)
            if (error.name === `SequelizeValidationError`) {
                res.redirect(`/add/portofolio?error=${error.errors.map(el => el.message)}`)
            } else {
                res.send(error)
            }
        }
    }

    static async getRegister(req, res) {
        const { error } = req.query
        try {
            res.render(`page-register`, { error })

        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    static async postRegister(req, res) {
        try {
            const {
                name,
                email,
                password,
                confirmPassword,
                agree
            } = req.body

            const newUser = await User.create({
                email,
                password,
                role: 'user',
                confirmPassword,
                agree: agree === 'on'
            })

            await UserProfile.create({
                UserId: newUser.id,
                name
            })

            res.redirect('/login')

        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                const message = error.errors[0].message

                return res.redirect(`/register?error=${encodeURIComponent(message)}`)
            }

            console.log(error)
            res.send(error)
        }
    }


    static async getProfile(req, res) {
        try {
            if (!req.session.user) {
                return res.redirect('/login?error=Please login first')
            }

            const userId = req.session.user.id

            const data = await UserProfile.findOne({
                where: {
                    UserId: userId
                },
                include: {
                    model: User
                }
            })

            res.render('page-profile', { data })

        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    static async getEditProfile(req, res) {
        try {
            if (!req.session.user) {
                return res.redirect('/login?error=Please login first')
            }

            const userId = req.session.user.id

            const data = await UserProfile.findOne({
                where: {
                    UserId: userId
                }
            })

            res.render('page-edit-profile', { data })

        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    static async postEditProfile(req, res) {
        try {
            if (!req.session.user) {
                return res.redirect('/login?error=Please login first')
            }

            const userId = req.session.user.id

            await UserProfile.update(
                {
                    name: req.body.name
                },
                {
                    where: {
                        UserId: userId
                    }
                }
            )

            res.redirect('/profile')

        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    static async editPortofolio(req, res) {
        const { id } = req.params
        try {
            let dataPortofolioById = await Portofolio.fetchDataToEdit(id)
            res.render(`page-edit-portofolio`, { dataPortofolioById })
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
            res.send(`page-admin`)
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

    static async getCompany(req, res) {
        try {
            let data = await Company.findAll()

            res.render(`page-company`, { data })
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }
}

module.exports = Controller