# 🔥 Configuración de Firebase para NumberNinja

## Pasos para configurar Firebase

### 1. Crear Proyecto en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Crear un proyecto"
3. Nombre del proyecto: `numberninja-game` (o el que prefieras)
4. Acepta los términos y continúa
5. Puedes deshabilitar Google Analytics por ahora

### 2. Configurar Firestore Database

1. En el panel lateral, ve a "Firestore Database"
2. Haz clic en "Crear base de datos"
3. Selecciona "Comenzar en modo de prueba"
4. Elige la ubicación más cercana a ti

### 3. Configurar Authentication (Opcional por ahora)

1. Ve a "Authentication" en el panel lateral
2. En la pestaña "Sign-in method"
3. Habilita "Anónimo" para empezar (no requiere configuración adicional)

### 4. Obtener Configuración del Proyecto

1. Ve a "Configuración del proyecto" (icono de engranaje)
2. En la pestaña "General", baja hasta "Tus apps"
3. Haz clic en el icono web `</>`
4. Registra la app con nombre: `NumberNinja Web`
5. **NO** marques "Configurar Firebase Hosting"
6. Copia la configuración que aparece

### 5. Configurar Variables de Entorno

1. Crea un archivo `.env.local` en la raíz del proyecto
2. Copia el contenido de `.env.local.example`
3. Reemplaza los valores con los de tu configuración:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_aquí
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

### 6. Configurar Reglas de Firestore

En Firebase Console > Firestore Database > Reglas, reemplaza las reglas por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura y escritura para modo de desarrollo
    // TODO: Mejorar seguridad en producción
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **Importante**: Estas reglas son para desarrollo. En producción deberás implementar reglas más seguras.

### 7. Estructura de Colecciones

El juego creará automáticamente estas colecciones:

- `players`: Perfiles de jugadores
- `sessions`: Sesiones de juego
- `achievements`: Logros disponibles (futuro)
- `playerAchievements`: Logros desbloqueados (futuro)
- `paymentRequests`: Solicitudes de pago (futuro)

### 8. Probar la Conexión

1. Asegúrate de que el archivo `.env.local` esté configurado
2. Reinicia el servidor de desarrollo: `npm run dev`
3. Abre la aplicación
4. Crea un nuevo jugador
5. Ve a Firebase Console > Firestore Database para verificar que se creó el documento

## 🚀 Funcionalidades Incluidas

- ✅ Creación y gestión de perfiles de jugador
- ✅ Seguimiento de progreso en tiempo real
- ✅ Estadísticas de sesiones de juego
- ✅ Persistencia de datos entre sesiones
- ⏳ Sistema de logros (próximamente)
- ⏳ Solicitudes de pago virtual (próximamente)
- ⏳ Dashboard para padres (próximamente)

## 🔧 Comandos Útiles

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Verificar tipos de TypeScript
npm run type-check

# Construcción de producción
npm run build
```

## 📚 Recursos Adicionales

- [Documentación de Firebase](https://firebase.google.com/docs)
- [Guía de Firestore](https://firebase.google.com/docs/firestore)
- [Configuración de Next.js con Firebase](https://firebase.google.com/docs/web/setup)
