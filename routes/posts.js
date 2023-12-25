const router = require("express").Router();
const Post = require("../models/Post")


//create a post 
router.post("/", async (req, res) => {
   const newPost = new Post(req.body)
      try {
       const savedPost = await newPost.save()
       res.status(200).json({message: "the post is successfully saved", savedPost})
   } catch (error) {
    res.status(500).json(error)
   }
})


module.exports = router;