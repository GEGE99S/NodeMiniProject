const { Post, Hashtag, User, Comment } = require("../models");

exports.afterUploadImage = (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
};

exports.uploadPost = async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      UserId: req.user.id,
    });
    const hashtags = req.body.content.match(/#[^\s#]*/g);
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          });
        })
      );
      await post.addHashtags(result.map((r) => r[0]));
    }
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.deletePost = async (req, res) => {
  const twitId = req.params.twitId; // 게시물 id
  const reqUserId = req.params.userId; // 작성자 id
  const user = parseInt(req.user.id, 10);  // Passport 세션 인증된 사용자 정보 

  if (user == reqUserId) { // 세션 인증된 사용자와 클라에서 요청한 사용자 정보 검증
    try {
      const comments = await Comment.findAll({   // 1. 게시물에 연결된 모든 댓글 찾기
        include: {
          model: Post,
          through: "PostComment",
          where: { id: twitId }, //
        },
      }); 
      for (const comment of comments) {
        await comment.destroy();                 // 2. 게시물에 작성된 모든 댓글 삭제
      }
      const post = await Post.findOne({          // 3. 삭제 요청한 게시물 조회
        where: {
          id: twitId,
          UserId: reqUserId,
        },
      });
      if (!post) {
        return res.status(404).json({ error: "게시물을 찾을 수 없습니다." });
      }
      await post.destroy();                      // 4. 삭제
      res.json({ message: "게시물이 삭제되었습니다." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "내부 서버 오류" });
    }
  } else {
    return res.status(401).json({ error: "삭제할 권한이 없습니다!" });
  }
};

