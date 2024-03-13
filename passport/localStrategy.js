const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user');

module.exports = () => {
  passport.use(new LocalStrategy({
    /*   라우터에 요청된 값 req.body  */
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: false,
  }, async (email, password, done) => {
    try {
      const exUser = await User.findOne({ where: { email } }); // db에서 로그인 창에 입력된 이메일 비교 
      if (exUser) {
            const result = await bcrypt.compare(password, exUser.password); // 암호화된 비밀번호와 비교
            if (result) {
              done(null, exUser); 
            } else {
              done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
              /* (현재 파일 코드 결과) -> (authError, user, info)  */
            }
      } else {
        done(null, false, { message: '가입되지 않은 회원입니다.' });
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};