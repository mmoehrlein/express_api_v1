module.exports = function(req, res, next){
    if(req.user.active){
        return next();
    } else {
        res.json({"error": "user needs to be activated"});
    }
};