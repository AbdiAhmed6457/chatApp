const router = require("express").Router();
const bcrypt = require("bcrypt");
const { Error } = require("mongoose");
const User = require("../models/User")
//update user 

router.put("/:id", async(req, res) => {
    if(req.body.userId == req.params.id || req.body.isAdmin){
        if(req.body.password){
            try {
               const salt = await bcrypt.genSalt(10)
               req.body.password = await bcrypt.hash(req.body.password, salt)
            } catch (error) {
                return res.status(500).json(Error)
            }
        }

        try {
            const user = await User.findByIdAndUpdate(req.params.id, {$set: req.body, })
            res.status(200).json("Account have been successfully updated")
        } catch (error) {
            return res.status(500).json(Error)
        }
    }else{
        return res.status(403).json("you can update only your information")
    }
})

//Delete 
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
          return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "Account has been successfully deleted" });
      } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
      }
    } else {
      return res.status(403).json({ error: "You are not authorized to delete this account" });
    }
  });

  //get user

  router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const {password, updatedAt, followers, ...other}  = user._doc
        res.status(200).json(other)
    } catch (error) {
        res.status(500).json(error)
    }
  })
  
 //follow a user
    router.put("/:id/follow", async(req, res) => {
        if(req.body.userId !== req.params.id){
            try {
                const user = await User.findById(req.params.id)
                const currentUser =await User.findById(req.body.userId)
                
                if(!user.followers.includes(req.body.userId)){
                   await user.updateOne({$push: {followers: req.body.userId}});
                   await currentUser.updateOne({$push: {following: req.params.id}});
                   res.status(200).json("user has been followed")
                
                }else{
                    res.status(401).json("you already follow this crazy guy")
                }
            } catch (error) {
                res.status(500).json(error)
            }
        }else{
            res.status(403).json("you can't follow yourself")
        }
    })

    router.put("/:id/unfollow", async(req, res) => {
        if(req.body.userId !== req.params.id){
            try {
                const user = await User.findById(req.params.id)
                const currentUser =await User.findById(req.body.userId)
                
                if(user.followers.includes(req.body.userId)){
                   await user.updateOne({$pull: {followers: req.body.userId}});
                   await currentUser.updateOne({$pull: {following: req.params.id}});
                   res.status(200).json("user has been unfollowed")
                
                }else{
                    res.status(401).json("what do you mean habibi?")
                }
            } catch (error) {
                res.status(500).json(error)
            }
        }else{
            res.status(403).json("you can't unfollow yourself")
        }
    })

  module.exports = router;


module.exports = router;