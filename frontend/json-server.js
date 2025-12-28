const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.get('/domain/unity', (req, res) => {
  const domain = router.db.get('unity').value();
  return res.status(200).json(domain);
});

server.use(router);

server.listen(3000, () => {
  console.log('JSON Server com auth rodando em http://localhost:3000');
});
