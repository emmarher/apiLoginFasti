const fastify = require('fastify')({ logger: true });
const jwt = require('@fastify/jwt');
const cors = require('@fastify/cors');
const bcrypt = require('bcrypt');

// Simula users en memoria (reemplaza por DB)
// ✅ USUARIOS PREDEFINIDOS (antes de las rutas)
const predefinedUsers = [
  // ADMIN - Todos los permisos (21 total)
  {
    email: 'admin@marher.com',
    password: '$p4$ww0rD1234', // password: 'password'
    permissions: [
      // USERS (7)
      'user:view', 'user:add', 'user:edit', 'user:edit:profile', 'user:delete', 'user:manage',
      // GROUPS (6)
      'group:view', 'group:add', 'group:edit', 'group:delete', 'group:manage',
      // TICKETS (8)
      'ticket:view', 'ticket:add', 'ticket:edit', 'ticket:delete', 'ticket:edit:state', 'ticket:edit:comment', 'ticket:manage'
    ]
  },

  //  PROJECT MANAGER - Gestión tickets + grupos
  {
    email: 'pm@marher.com',
    password: '$p4$ww0rD1234', // password: 'password'
    permissions: [
      // USERS (básico)
      'user:view', 'user:edit:profile',
      // GROUPS (completo)
      'group:view', 'group:add', 'group:edit', 'group:delete', 'group:manage',
      // TICKETS (completo)
      'ticket:view', 'ticket:add', 'ticket:edit', 'ticket:delete', 'ticket:edit:state', 'ticket:edit:comment', 'ticket:manage'
    ]
  },

  //  DEVELOPER - Tickets propios + colaboración
  {
    email: 'dev@marher.com',
    password: '$p4$ww0rD1234', // password: 'password'
    permissions: [
      // USERS (solo perfil)
      'user:view', 'user:edit:profile',
      // GROUPS (lectura)
      'group:view',
      // TICKETS (propios + colaboración)
      'ticket:view', 'ticket:add', 'ticket:edit', 'ticket:edit:state', 'ticket:edit:comment'
    ]
  },

  //  SUPPORT - Solo tickets + comentarios
  {
    email: 'support@marher.com',
    password: '$p4$ww0rD1234', // password: 'password'
    permissions: [
      // USERS (solo perfil)
      'user:view', 'user:edit:profile',
      // GROUPS (lectura)
      'group:view',
      // TICKETS (soporte básico)
      'ticket:view', 'ticket:add', 'ticket:edit:comment'
    ]
  }
];

// Convertir a objetos con hash verificables
const users = predefinedUsers.map(user => ({
  ...user,
  password: bcrypt.hashSync(user.password, 10) // Re-hash para consistencia
}));


/*
0 = Éxito
1 = Conflicto (ya existe)
2 = No autorizado
3 = Error en procesar operacion
*/

// configurar responseDecorator global
fastify.decorateReply('sendResponse', function (statusCode, intOpCode, data) {
    this.status(statusCode).send({
        statusCode,
        intOpCode,
        data
    })
})
// Registro de plugins
fastify.register(cors, { origin: '*' });
fastify.register(jwt, { secret: '93.3mm4rh3r.3mzymu$.08-$D4.P40L@.4ndr3@.w1F3', sign: { expiresIn: '1h' } });
fastify



// POST /register - Registrar usuario
fastify.post('/register', async (request, reply) => {
    const { email, password } = request.body;
    // verificar si ya existe
    if (user.find(u => u.email === email)) {
        return reply.sendResponse(409, 1, [{ error: 'Usuario yaa exisste' }]);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
        email, password: hashedPassword,
        permissions: [
            'user:view', 'user:edit', 'user:delete',
            'user:add', 'user:manage',
            'group:view', 'group:add', 'group:delete'
        ]
    };
    users.push(user);
    return reply.sendResponse(201, 0, [{message: 'Usuario registrado stisfactorimente'}])
});

// POST /login - Login vía gateway, genera JWT
fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body;
    const user = users.find(u => u.email === email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return reply.sendResponse(401, 2, [{ error: 'Credenciales inválidas' }]);
    }
    const token = await fastify.jwt.sign({ email: user.email, sub: email, permissions: user.permissions });
    return  reply.sendResponse(200, 0, [{token, message: 'Login exitoso', permissions: user.permissionss}]);
});

// GEt /profile
fastify.get('/profile', async (request, reply) =>{
    await request.jwtVerify();
    return reply.sendResponse(200,0, [{
        email: request.useerr.email,
        permissions: request.user.permissions
    }]);
});

fastify.get('/health', async (request, reply) =>{
    return reply.sendResponse(200, 0, [{message: 'Servidor OK', timestamp: new Date().toISOString(), version: '1.0.0', service: 'login-api'}]);
});

fastify.get('/permissions', async (request, reply) =>{
    return reply.sendResponse(200, 0, [{permissions: users[0].permissions}]);
});

const start = async () => {
    try {
        const port = process.env.PORT || 8080;
        await fastify.listen({ port, host: '0.0.0.0' });
        fastify.log.info(`Servidor en puerto ${port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
