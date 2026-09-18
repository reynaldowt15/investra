require('dotenv').config()

const express = require('express');
const session = require(`express-session`)
const Controller = require(`./controllers/controller`);
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }))

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    sameSite: true
  }
}))

const isLogin = (req, res, next) => {
  // console.log(req.session)
  if (!req.session.user) {
    const msg = `Please login first!`
    res.redirect(`/login?error=${msg}`)
  } else {
    next()
  }
}

const isAdmin = (req, res, next) => {
  // console.log(req.session)
  if (req.session.user.role !== `admin`) {
    const msg = `Only admin can access!`
    res.redirect(`/home?error=${msg}`)
  } else {
    next()
  }
}

app.get(`/`, (req, res) => {
  res.redirect(`/login`)
})

app.get(`/register`, Controller.getRegister)
app.post(`/register`, Controller.postRegister)

app.get(`/login`, Controller.loginPage)
app.post(`/login`, Controller.postLogin)

app.get(`/home`, isLogin, Controller.home)

app.get(`/add/portofolio`, isLogin, Controller.addPortofolio)
app.post(`/add/portofolio`, isLogin, Controller.postAddPortofolio)

app.get(`/add/portofolio/:id/companies`, isLogin, Controller.addCompany)
app.post(`/add/portofolio/:id/companies`, isLogin, Controller.postAddCompany)

app.get(`/profile`, isLogin, Controller.getProfile)
app.get('/profile/edit', isLogin, Controller.getEditProfile)
app.post('/profile/edit', isLogin, Controller.postEditProfile)

app.get(`/companies`, isLogin, Controller.getCompany)

app.get(`/delete/portofolio/:id`, isLogin, Controller.deletePortofolio)
app.get(`/delete/portofolio/:id/:companyId`, isLogin, Controller.deleteCompanyPortofolio)

app.get(`/edit/portofolio/:id`, isLogin, Controller.editPortofolio)
app.post(`/edit/portofolio/:id/:companyId`, isLogin, Controller.postEditPortofolioCompany)


app.get(`/admin`, isLogin, isAdmin, Controller.adminPage)

app.get(`/logout`, isLogin, Controller.logout)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

