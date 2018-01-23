const passport = require('koa-passport')

const fetchUser = (() => {
  // This is an example! Use password hashing in your project and avoid storing passwords in your code
  const user = { id: 1, username: 'test', password: 'test' }
  return async function() {
    return user
  }
})()

passport.serializeUser(function(user, done) {
  done(null, user.id)
})

passport.deserializeUser(async function(id, done) {
  try {
    const user = await fetchUser()
    done(null, user)
  } catch(err) {
    done(err)
  }
})

const LocalStrategy = require('passport-local').Strategy
passport.use(new LocalStrategy(function(username, password, done) {
  fetchUser()
    .then(user => {
      if (username === user.username && password === user.password) {
        done(null, user)
      } else {
        done(null, false)
      }
    })
    .catch(err => done(err))
}))

var GitHubStrategy = require('passport-github').Strategy;

const GITHUB_CLIENT_ID = '3c5e373ced8e435eb692'
const GITHUB_CLIENT_SECRET = '4b45600288e4a3dbbfc77ab842d2ac9f9380b162'
passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // 此处正常逻辑应该是githubId去数据查询用户
    // User.findOrCreate({ githubId: profile.id }, function (err, user) {
      return cb(null, profile);
    // });
  }
));