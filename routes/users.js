const router = require("express").Router();

router.get("/", (req, res) => {
    res.send("hey this is from api router don't be surprised")
})


module.exports = router;