module.exports = {
    // Middleware para verificar o token
    verifyToken: (server) => (req, res, next) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'ERRO.USER.NOTSIGNED' });
        }

        const token = authHeader.replace('Bearer ', '');
        const auth = server.db.get('oauth').filter({ token }).value();

        if (auth.length !== 1) {
            return res.status(403).json({ error: 'ERRO.USER.NOTSIGNED' });
        }

        next();
    },
    verifyPluginToken: (server) => (req, res, next) => {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: 'ERRO.USER.NOTSIGNED' });
        }

        const user = server.db.get('users').filter({ accessToken: authHeader }).value();

        if (user.length !== 1) {
            return res.status(403).json({ error: 'ERRO.USER.NOTSIGNED' });
        }

        next();
    },
    needAuthorized: (server) => (req, res, next) => {
        const userId = searchOnTokenIdUser(req.headers.authorization);
        const user = server.db.get('users').find({ id: userId }).value();

        if (user.authorized) {
            return next();
        }

        return res.status(406).json({ error: 'ERRO.USER.WAIT_APPROVAL' });
    },
    needAdmin: (server) => (req, res, next) => {
        const userId = searchOnTokenIdUser(req.headers.authorization);
        const user = server.db.get('users').find({ id: userId }).value();

        if (user.admin) {
            return next();
        }

        return res.status(403).json({ error: 'ERRO.USER.NOTSIGNED' });
    },
    getIdUser: (authHeader) => {
        return searchOnTokenIdUser(authHeader);
    }
};


function searchOnTokenIdUser(authHeader) {
    const token = authHeader.split(' ')[1];
    const payload = Buffer.from(token, 'base64').toString('utf8');
    const match = payload.match(/"sub"\s*:\s*"?(?<sub>[^",}]+)"?/);
    const userId = match?.groups?.sub || null;
    return parseInt(userId);
}