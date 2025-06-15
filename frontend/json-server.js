const jsonServer = require('json-server');
const auth = require('json-server-auth');
const util = require('./json-server-util');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.db = router.db;

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.get('/oauth',
    util.verifyToken(server),
    util.needAuthorized(server),
    (req, res, next) => {
        next();
    });

server.post('/login',
    (req, res, next) => {
        const { email } = req.body;
        const user = server.db.get('users').find({ email }).value();
        if (!user) {
            return res.status(401).json({ error: 'ERRO.USER.NOTFOUND' });
        }
        res.send = parseMessage(res, 'login')
        next();
    });

server.post('/register',
    (req, res, next) => {
        delete req.body.confirmPassword;
        res.send = parseMessage(res, 'register')
        next();
    });

server.post('/fleet',
    util.verifyToken(server),
    util.needAuthorized(server),
    (req, res, next) => {
        const authHeader = req.headers.authorization;
        req.body.userId = util.getIdUser(authHeader);
        next();
    });

server.get('/fleet',
    util.verifyToken(server),
    util.needAuthorized(server),
    (req, res, next) => {
        const authHeader = req.headers.authorization;
        userId = util.getIdUser(authHeader)
        const userFleet = server.db.get('fleet').filter({ userId: userId }).value();
        return res.status(200).json(userFleet);

    });

server.get('/users',
    util.verifyToken(server));

server.put('/users/:id/allow',
    util.verifyToken(server),
    util.needAuthorized(server),
    util.needAdmin(server),
    (req, res) => {
        const { id } = req.params;
        const { allow } = req.body;

        if (typeof allow !== 'boolean') {
            return res.status(400).json({
                error: 'O payload deve conter {allow: true|false}'
            });
        }
        const user = server.db.get('users').find({ id: parseInt(id) }).value();
        if (!user) {
            return res.status(404).json({
                error: 'Usuário não encontrado'
            });
        }

        // Atualiza apenas o campo allow
        server.db.get('users')
            .find({ id: parseInt(id) })
            .assign({ authorized: allow })
            .write();

        // Retorna o usuário atualizado
        return res.status(200).json({ msg: 'USER.AUTHORIZED_CHANGED' });
    });

server.delete('/users/:id',
    util.verifyToken(server),
    util.needAuthorized(server),
    util.needAdmin(server),
    (req, res) => {
        const { id } = req.params;
        const userId = parseInt(id);

        server.db.get('fleet')
            .remove({ userId: userId })
            .write();

        server.db.get('users')
            .remove({ id: userId })
            .write();

        return res.status(200).json({ msg: 'USER.DELETED' });
    });

server.use(auth);
server.use(router);

server.listen(3000, () => {
    console.log('JSON Server com auth rodando em http://localhost:3000');
});



function parseMessage(res, path) {
    const originalSend = res.send;
    return function (body) {
        if (body.indexOf('{') == -1) {
            //Error message
            errorCode = JSON.parse(body)
            if (errorCode === 'Email already exists') {
                errorCode = 'ERRO.EMAIL.EXISTS'
            } else if (errorCode === 'Invalid password') {
                errorCode = 'ERRO.PASSWORD.INVALID'
            }

            return originalSend.call(this, JSON.stringify({ code: errorCode }));
        } else {
            if (path === 'login'
                || path === 'register') {
                objResponse = JSON.parse(body)
                if (objResponse.user) {
                    const oauthEntry = server.db.get('oauth').find({ id: objResponse.user.id }).value();
                    if (oauthEntry) {
                        server.db
                            .get('oauth')
                            .find({ id: objResponse.user.id })
                            .assign({ token: objResponse.accessToken })
                            .write();
                    } else {
                        server.db
                            .get('oauth')
                            .push({ id: objResponse.user.id, token: objResponse.accessToken })
                            .write();
                    }
                }
            }
        }
        return originalSend.call(this, body);
    };
}
