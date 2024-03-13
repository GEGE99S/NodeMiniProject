const express = require('express');
const { renderBoard, runBoard } = require ('../controllers/board');
// const { isLoggedIn, isNotloggedIn } = require ('../middlewares'); /* index.js */

const router = express.Router(); 

router.get('/' , renderBoard); // /board
router.post('/' , runBoard);

module.exports = router;

