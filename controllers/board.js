const Board = require('../models/board');


exports.renderBoard = (req,res) => {
  res.render ('board', {title : '게시판 '});
};

exports.runBoard = async (req, res, next) => {
  const { subject, creater, content } = req.body;
  try{
    await Board.create({
      subject,
      creater,
      content,
    });
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return next(error);
  }
}

 