const jsonServer = require('json-server');
const auth = require('json-server-auth');
const tmp = require('tmp');
const path = require('path');
const fs = require('fs-extra');
const archiver = require('archiver');

const util = require('./json-server-util');
const config = require('./json-server-confg.json');

const { Mutex } = require('async-mutex');

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


server.post('/fleet/download/self',
    util.verifyToken(server),
    util.needAuthorized(server),
    (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            const idUser = util.getIdUser(authHeader);

            const user = server.db.get('users').find({ id: idUser }).value();
            const userFleet = server.db.get('fleet').filter({ userId: idUser }).value();

            var inputJson = [];
            if (user.ccu) {
                inputJson = user.ccu;
            }

            userFleet.forEach(ship => {
                for (let i = 1; i <= (+ship.quantity); i++) {
                    inputJson.push({
                        name: ship.name,
                        shipname: ship.nickname,
                        type: "ship"
                    })
                }
            });

            const buffer = Buffer.from(JSON.stringify(inputJson), 'utf-8');
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', 'attachment; filename="fleetview.json"');
            res.send(buffer);

        } catch (error) {
            console.error('Erro ao gerar arquivo do fleetview:', error);
            res.status(500).json({ error: 'Erro interno ao gerar o arquivo' });
        }
    });

server.post('/fleet/download/guild',
    util.verifyToken(server),
    util.needAuthorized(server),
    util.needAdmin(server),
    (req, res, next) => {
        try {

            const usersCCU = server.db.get('users').value()
                .map((user) => user.ccu);
            const allFleets = server.db.get('fleet').value();

            const inputJson = [];

            usersCCU.forEach(user => {
                if (user) {
                    user.forEach(ship => {
                        inputJson.push({
                            name: ship.name,
                            shipname: ship.shipname,
                            type: ship.type
                        })
                    });
                }
            });

            allFleets.forEach(ship => {
                for (let i = 1; i <= (+ship.quantity); i++) {
                    inputJson.push({
                        name: ship.name,
                        shipname: ship.nickname,
                        type: "ship"
                    })
                }
            });

            const buffer = Buffer.from(JSON.stringify(inputJson), 'utf-8');
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', 'attachment; filename="fleetview.json"');
            res.send(buffer);

        } catch (error) {
            console.error('Erro ao gerar arquivo do fleetview:', error);
            res.status(500).json({ error: 'Erro interno ao gerar o arquivo' });
        }


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

server.get('/hangar',
    util.verifyToken(server),
    util.needAuthorized(server),
    (req, res, next) => {
        const authHeader = req.headers.authorization;
        userId = util.getIdUser(authHeader)
        const user = server.db.get('users').find({ id: userId }).value();
        return res.status(200).json(user.ccu);

    });

server.post('/hangar',
    util.verifyPluginToken(server),
    (req, res, next) => {
        const authHeader = req.headers.authorization;

        try {
            const result = [];

            const response = req.body;
            response.forEach(entitie => {
                Object.keys(entitie).forEach(key => {
                    const group = entitie[key];
                    Object.keys(group).forEach(row => {
                        const pack = group[row];
                        if (pack && pack.place && pack.place == 'hangar') {
                            //if (row == '10235266') {
                            pack['items'].forEach(item => {
                                if (item.kind == 'Ship') {
                                    result.push({
                                        "name": item.name, "shipname": item.name, "type": "ship"
                                    });
                                }
                            });
                            //}
                        }
                    });
                });
            })

            server.db.get('users')
                .find({ accessToken: authHeader })
                .assign({ ccu: result })
                .write();

            res.status(200).json('OK')
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });


server.post('/download',
    util.verifyToken(server),
    util.needAuthorized(server),
    (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            const idUser = util.getIdUser(authHeader);
            const accessToken = generateAlphaNumericSerial(22);

            server.db.get('users')
                .find({ id: parseInt(idUser) })
                .assign({ accessToken: accessToken })
                .write();

            const inputJson = {
                url: config.path,
                token: accessToken
            };

            const tempDir = tmp.dirSync({ unsafeCleanup: true }).name;
            const templateDir = path.join(__dirname, 'plugin/chrome');

            const configPath = path.join(tempDir, 'config.json');
            fs.writeJson(configPath, inputJson, { spaces: 2 });

            const zipPath = path.join(tempDir, 'extension.zip');
            zipFiles(zipPath, [
                configPath,
                path.join(templateDir, 'background.js'),
                path.join(templateDir, 'content-script.js'),
                path.join(templateDir, 'manifest.json'),
            ], () => {
                res.setHeader('Content-Type', 'application/zip');
                res.setHeader('Content-Disposition', 'attachment; filename="extension.zip"');
                res.sendFile(zipPath, () => {
                    fs.remove(tempDir); // limpeza
                });
            });

        } catch (error) {
            console.error('Erro ao gerar zip:', error);
            res.status(500).json({ error: 'Erro interno ao gerar o arquivo' });
        }
    });



server.get('/users',
    util.verifyToken(server),
    util.needAuthorized(server),
    util.needAdmin(server),);

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

server.use(async (req, res, next) => {
    const isWrite = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);

    if (isWrite) {
        const release = await mutex.acquire(); // bloqueia outras escritas
        res.on('finish', release); // libera após resposta
    }

    next();
});

server.listen(3000, () => {
    console.log('JSON Server com auth rodando em http://localhost:3000');
});

//Layout do fleetviewer.json[{"name":"atls","shipname":"","type":"ship"}]


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

                newResponse = {
                    accessToken: objResponse.accessToken,
                    user: {
                        nickname: objResponse.user.nickname,
                        authorized: objResponse.user.authorized,
                        admin: objResponse.user.admin
                    }
                }
                return originalSend.call(this, JSON.stringify(newResponse));
            }
        }

        return originalSend.call(this, body);
    };
}

function zipFiles(outputPath, files, onClose) {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on('close', onClose);
    archive.on("error", function (err) {
        throw err;
    });

    archive.pipe(output);
    files.forEach((file) => {
        archive.file(file, { name: file.split("/").pop() });
    });
    archive.finalize();
}

function generateAlphaNumericSerial(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let serial = '';
    for (let i = 0; i < length; i++) {
        serial += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // Formata como XXYY-ZZWW se length = 8
    return serial.match(/.{1,4}/g).join('-');
}
