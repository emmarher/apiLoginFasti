npm run dev

## permisos

USERS (7 permisos)
├── user:view     - Ver usuarios
├── user:add      - Crear usuarios  
├── user:edit     - Editar usuarios
├── user:edit:profile     - Editar perfil
├── user:delete   - Eliminar usuarios
└── user:manage   - para activar sidebar

GROUPS (6 permisos)
├── group:view    - Ver grupos
├── group:add     - Crear grupos
├── group:edit    - Editar grupos
├── group:delete  - Eliminar grupos
└── group:manage  - para activar sidebar

TICKETS (8 permisos)
├── ticket:view   - Ver tickets
├── ticket:add    - Crear tickets
├── ticket:edit   - Editar tickets
├── ticket:delete - Eliminar tickets
├── ticket:edit:state - Editar estado tickets
├── ticket:edit:comment - Editar comentario tickets
└── ticket:manage - para activar sidebar


// ✅ USUARIOS PREDEFINIDOS (antes de las rutas)
const predefinedUsers = [
  // ADMIN - Todos los permisos (21 total)
  {
    email: 'admin@marher.com',
    password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: 'password'
    permissions: [
      // USERS (7)
      'user:view', 'user:add', 'user:edit', 'user:edit:profile', 'user:delete', 'user:manage',
      // GROUPS (6)
      'group:view', 'group:add', 'group:edit', 'group:delete', 'group:manage',
      // TICKETS (8)
      'ticket:view', 'ticket:add', 'ticket:edit', 'ticket:delete', 'ticket:edit:state', 'ticket:edit:comment', 'ticket:manage'
    ]
  },

  // 👨‍💼 PROJECT MANAGER - Gestión tickets + grupos
  {
    email: 'pm@marher.com',
    password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: 'password'
    permissions: [
      // USERS (básico)
      'user:view', 'user:edit:profile',
      // GROUPS (completo)
      'group:view', 'group:add', 'group:edit', 'group:delete', 'group:manage',
      // TICKETS (completo)
      'ticket:view', 'ticket:add', 'ticket:edit', 'ticket:delete', 'ticket:edit:state', 'ticket:edit:comment', 'ticket:manage'
    ]
  },

  // 🛠️ DEVELOPER - Tickets propios + colaboración
  {
    email: 'dev@marher.com',
    password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: 'password'
    permissions: [
      // USERS (solo perfil)
      'user:view', 'user:edit:profile',
      // GROUPS (lectura)
      'group:view',
      // TICKETS (propios + colaboración)
      'ticket:view', 'ticket:add', 'ticket:edit', 'ticket:edit:state', 'ticket:edit:comment'
    ]
  },

  // 📝 SUPPORT - Solo tickets + comentarios
  {
    email: 'support@marher.com',
    password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: 'password'
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
