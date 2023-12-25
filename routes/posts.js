const router = require("express").Router();
const Post = require("../models/Post")
const User = require("../models/User")


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

//update a post

router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
          }
   
        if( post.userId == req.body.userId){

            await post.updateOne({$set: req.body});
            res.status(200).json("successfully updated your post")
        }else{
            res.status(403).json("you can only update your own posts");
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

//like a post 

router.put("/:id/likes", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (post.likes.includes(req.body.userId)) {
        await post.updateOne({ $pull: { likes: req.body.userId } });
        res.send("you disliked it successfully")
    } else {
        await post.updateOne({ $push: { likes: req.body.userId } });
        res.send("Post liked successfully.");
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  //get post

  router.get("/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);

      res.status(200).json(post);
    } catch (error) {
      res.status(500).json(error);
    }
  });

  router.get("/timeline/all", async (req, res) => {
    try {
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({ userId: currentUser._id });

        const friendPosts = await Promise.all(
            currentUser.following.map((friendId) => {
               return Post.find({userId : friendId});
            }
        ))
        res.json(userPosts.concat(...friendPosts));
    } catch (error) {
        res.status(500).json(error)
    }
  })

module.exports = router;