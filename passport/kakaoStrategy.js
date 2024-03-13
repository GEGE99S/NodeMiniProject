const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/user');

module.exports = () => {
  passport.use(new KakaoStrategy({
    /* 요청된 정보 파싱 중  */
    clientID: process.env.KAKAO_ID,
    callbackURL: '/auth/kakao/callback', /* 수행할 콜백URL 수행할거다. */
    /* 승인 받으러 갔다가 다시 옵니다.  */
  }, async (accessToken, refreshToken, profile, done) => {
    console.log('kakao profile', profile);
    try {
      const exUser = await User.findOne({
        where: { snsId: profile.id, provider: 'kakao' },
      });
      if (exUser) {
        done(null, exUser);
      } else {
        /* 유저 정보가 없으면 회원가입 */
        const newUser = await User.create({
          email: profile._json?.kakao_account?.email,
          nick: profile.displayName,
          snsId: profile.id,
          provider: 'kakao',
        });
        done(null, newUser);
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};

/* 로그인 시도후 DB에 저장된 유저가 없으면 바로 회원등록 */