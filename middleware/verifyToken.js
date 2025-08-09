import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
    const token = req.cookies.token

    if (!token) return res.status(401).json({message: "not authenticated"});

    jwt.verify(token, process.env.JWT, async (err, payload) => {
        if (err) return res.status(403).json({message: "Token invalid"});
        req.user = payload;
        next();
    });
};

export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({message: "You are not allowed to access this resource"});
        }
        next();
    };
}
