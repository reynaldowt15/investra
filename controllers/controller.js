const {
    User,
    UserProfile,
    Portofolio,
    PortofolioCompany,
    Company
} = require("../models/index")

const bcryptjs = require(`bcryptjs`)

class LoginController {
    static async login(req, res) {
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
            // res.send(req.body)

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
        try {
            res.send(`home`)
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }
}

module.exports = LoginController