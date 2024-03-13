// 라우터 접근 권한을 제어하는 미들웨어 . 로그인/로그아웃 각 유저별로 접근할 수 있는 라우터 

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send("로그인 필요");
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    const message = encodeURIComponent("로그인 한 상태입니다.");
    res.redirect(`/?error=${message}`);
  }
};
