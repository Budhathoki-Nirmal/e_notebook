var jwt = require('jsonwebtoken');
const JWT_SECRET = 'AuthenticationToken';

const fetchuser = (req, res, next) => {
    //Get the user from the jwt token
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ errors: 'Unvalid User' })
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ errors: 'valid User' })
    }


}

module.exports = fetchuser;