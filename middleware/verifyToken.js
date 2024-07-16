import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({message: "not authenticated"});

    jwt.verify(token, process.env.JWT, async (err, payload) => {
        if (err) return res.status(403).json({message: "token invalid"});
        req.userId = payload.id;
        next();
    });
};

export const verifyAdminToken = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) return res.status(200).json({message: "not Authenticated"});

    jwt.verify(token, process.env.JWT, async (err, payload) => {
        if (err) return res.status(403).json({message: "token invalid"});
        if (!payload.isAdmin) return res.status(403).json({message: "not Authorized"});
        req.userId = payload.id;
        next();
    })
}

