const express = require("express"); /* 익스프레스 서버 */
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const path = require("path"); /*  페이지 파일을 보내줄 때 : 파일 경로 */
const dotenv = require("dotenv"); /* 비밀 정보들이 담김. application-properties랑 유사. */
const nunjucks = require("nunjucks");
const passport = require("passport");


const boardRouter = require("./routes/board");
const pageRouter = require("./routes/page");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const userRouter = require("./routes/user");


const passportConfig = require("./passport");
const { sequelize } = require("./models");

const app = express();

dotenv.config();
passportConfig();
// index.js 실행 -> 로그인할 때, 요청마다 실행하는 함수 정의 + 요청에 관한 세션 등록 함수 실행

app.set("port", process.env.PORT || 8001);
app.set("view engine", "html");

nunjucks.configure("views", {
  // html -> views 폴더 안에
  express: app,
  watch: true,
});

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public"))); // 정적 폴더  css 들어간다  img src 기본 루트가 public폴더로 갑니다.
app.use("/img", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//   본문에 적힌 정보를  req.body객체로 만들어줌 , 다른 확장도구 쓸꺼냐
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(
  session({
    resave: false /* 요청이 올 때 마다 세션 수정내역 없어도 저장  */,
    saveUninitialized: false, // 세션에 저장할만한게 없어도 저장
    secret: process.env.COOKIE_SECRET,
    cookie: {
      // 세션쿠키에대한 설정
      httpOnly: true, // 클라에서 확인 불가
      secure: false,
    },
  })
);

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

app.use("/", pageRouter);
app.use("/auth", authRouter);
app.use("/board", boardRouter);
app.use("/post", postRouter);
app.use("/user", userRouter);

app.use(express.static(path.join(__dirname, "../reactpj/build")));
app.get("/aboutus", (req, res) => {
  res.sendFile(path.join(__dirname, "../reactpj/build/index.html"));
});

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "prodcution" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
