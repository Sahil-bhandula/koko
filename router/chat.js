const router = require("express").Router();
const SendMESSAGE = require("../controller/Chat");

router.post("/send", SendMESSAGE.sendMESSAGE);

router.get("/history", SendMESSAGE.getChatHistory);


module.exports = router;