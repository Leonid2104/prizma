const Router =require('express')
const authMiddleware = require("../middleware/authMiddleware")
const router = new Router() 
const postController = require('../controllers/postController')
router.post('/',authMiddleware,postController.addPost)
router.post('/UploadImg/:id',authMiddleware,postController.addPhotoPost)
router.get('/:id',authMiddleware,postController.checkPosts) 
router.delete('/:postId',authMiddleware,postController.delPost)
router.put('/:userId/:postId',authMiddleware,postController.updatePost)
router.get('/news/news',authMiddleware,postController.getNews)

module.exports = router 