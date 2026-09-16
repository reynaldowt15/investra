const express = require('express');
const session = require(`express-session`)
const Controller = require('./controllers/controller');
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

app.get(`/`, (req, res) => {
  res.redirect(`/login`)
})
app.get(`/login`, Controller.login)
app.post(`/login`, Controller.postLogin)
app.get(`/register`, Controller.getRegister)
app.post(`/register`, Controller.postRegister)
app.get(`/profile`, Controller.getProfile)
app.get('/profile/edit', Controller.getEditProfile)
app.post('/profile/edit', Controller.postEditProfile)
app.get(`/company`, Controller.getCompany)

// app.use((req, res, next) => {
//   console.log(req.session)
//   if (!req.session.user) {
//     const msg = `Please login first`
//     res.redirect(`/login?error=${msg}`)
//   } else {
//     if (req.session.user.role === `admin`) {
//       res.redirect(`/admin`)
//     } else {
//       res.redirect(`/home`)
//     }
//   }
// });

// app.use((req, res, next) => {
//   console.log(req.session)
//   if (req.session.user.roles) {
//     const msg = `Please login first`
//     res.redirect(`/login?error=${msg}`)
//   } else {
//     next()
//   }
//   // console.log('Time:', Date.now());
//   // next();
// });

app.get(`/home`, Controller.home)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

