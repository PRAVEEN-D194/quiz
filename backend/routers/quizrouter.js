const express = require('express');
const { getallquestions, getquestion, createquiz } = require('../components/quizcontroller');
const router = express.Router();

router.get('/getallquestions', getallquestions);
router.get('/getquestion/:id', getquestion);
router.post('/createquiz', createquiz);

module.exports = router;