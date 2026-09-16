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


    static async getRegister(req, res){
        const { error } = req.query
        try {
            res.render(`page-register`, {error})

        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }


    static async postRegister(req, res){
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



    static async home(req, res) {
        try {
            res.send(`home`)
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }


    static async getCompany(req, res) {
        try {
            let data = await Company.findAll ()

            res.render(`page-company`, {data})
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }
}

module.exports = LoginController