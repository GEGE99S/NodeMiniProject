const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");
const {
  renderProfile,
  renderJoin,
  renderMain,
  renderHashTag,
  renderComment,
  createComment,
  deleteComment,
} = require("../controllers/page");

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.followerCount = req.user?.Followers?.length || 0;
  res.locals.followingCount = req.user?.Followings?.length || 0;
  res.locals.followingIdList = req.user?.Followings?.map((f) => f.id) || [];
  next();
});


router.get('/comment/:twitId', renderComment)
router.post('/comment/:twitId', isLoggedIn ,createComment)
router.delete('/comment/delete/:commentId/:reqId', isLoggedIn, deleteComment )


router.get('/hashtag', renderHashTag);

router.get('/profile', isLoggedIn, renderProfile);

router.get('/join', isNotLoggedIn, renderJoin);

router.get('/', renderMain);

router.get('/')

module.exports = router;
