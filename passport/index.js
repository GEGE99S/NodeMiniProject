const passport = require('passport');
const local = require('./localStrategy'); // 로그인 과정을 어떻게 처리할지.
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

// 1.  /auth/login요청  Passport.authenticate 호출  로그인전략 성공시 정보담은 객체 req.login
/* 아래 serialize와 deserialize가 실행됨  */

 
module.exports = () => {
  passport.serializeUser((user,done)=>{
    done(null, user.id);
   });

   passport.deserializeUser((id, done)=>{
    User.findOne ({
      where : { id },
      include : [{
        model : User,
        attributes : ['id', 'nick'],
        as: 'Followers',
      }, {
        model : User,
        attributes : ['id', 'nick'],
        as: 'Followings'
      }],
    })
    .then (user=> done(null, user)) 
    .catch (err=> done(err));
  });

  /* 세션 등록 */
  local();
  kakao();
}
 