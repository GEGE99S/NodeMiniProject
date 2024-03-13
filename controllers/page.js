const { User, Post, Hashtag, Comment } = require("../models");

exports.renderProfile = (req, res) => {
  res.render("profile", { title: "내 정보 - NodeSNS" });
};
exports.renderJoin = (req, res) => {
  res.render("join", { title: "회원가입 - NodeSNS" });
};

exports.renderMain = async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      include: {
        model: User,
        attributes: ["id", "nick"],
      },
      order: [["createdAt", "DESC"]],
    });
    res.render("main", {
      title: "NodeSNS",
      twits: posts,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.renderHashTag = async (req, res, next) => {
  const query = req.query.hashtag;
  if (!query) {
    return res.redirect("/");
  }

  try {
    const hashtag = await Hashtag.findOne({ where: { title: query } });
    let posts = [];
    if (hashtag) {
      posts = await hashtag.getPosts({ include: [{ model: User }] });
    }
    return res.render("main", {
      title: `${query}| NodeSNS`,
      twits: posts,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

exports.renderComment = async (req, res) => {
  try {
    const PostId = req.params.twitId;
    console.log(`서버로부터 온 덧글조회 요청 게시물 번호: ${PostId}`);

    const searchcComments = await Comment.findAll({
      include: {
        model: Post,
        through: "PostComment",
        where: { id: PostId },
      },
    });

    const commentList = searchcComments.map((comment) => {
      return {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        commentor: comment.UserId,
      };
    });

    console.log(JSON.stringify(commentList));
    res.json(commentList);
  } catch (err) {
    console.error(err);
    res.status(500).send("내부 서버 오류");
  }
};

exports.createComment = async (req, res, next) => {
  const postId = req.params.twitId;
  const { content } = req.body;
  const userId = req.user.id;
  console.log(`생성될 덧글 내용 :${content} `);

  try {
    const comment = await Comment.create({
      content,
      postId,
      UserId: userId,
    });
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ error: "포스트를 찾을 수 없습니다." });
    }
    //   덧글과 포스트를 연결
    await post.addComment(comment);
    console.log("데이터 저장 확인!");
    res.status(201).json({ comment });
  } catch (error) {
    console.error(error);
    res.status(500).send("내부 서버 오류");
  }
};

exports.deleteComment = async (req, res, next) => {
  const reqId = parseInt(req.params.reqId, 10); // 삭제요청한 회원
  const userId = parseInt(req.user.id, 10); // 패스포트 로그인 회원 정보
  const reqcommentId = parseInt(req.params.commentId, 10); // 요청한 덧글
  try {
    const comment = await Comment.findOne({ // 삭제할 댓글 조회
      where: {
        id: reqcommentId,
        UserId: userId,
      },
    });
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "해당 덧글을 찾을 수 없습니다." });
    }
    if (reqId === userId) { // 패스포트 == 클라요청  회원정보 확인
      await comment.destroy();
      return res
        .status(200)
        .json({ success: true, message: "덧글이 성공적으로 삭제되었습니다." });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "삭제할 권한이 없습니다." });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "덧글 삭제 중에 오류가 발생했습니다." });
  }
};
