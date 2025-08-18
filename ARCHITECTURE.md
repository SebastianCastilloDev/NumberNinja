# 🥷 NumberNinja - Arquitectura del Proyecto

Este proyecto ha sido refactorizado siguiendo los principios de **Clean Architecture** y **Separation of Concerns** para garantizar un código mantenible, escalable y fácil de entender.

## 🏗️ Estructura del Proyecto

```
src/
├── app/                    # Páginas de Next.js
│   ├── layout.tsx         # Layout principal con fuentes
│   ├── page.tsx           # Página principal (REFACTORIZADA)
│   └── globals.css        # Estilos globales
├── components/            # Componentes React reutilizables
│   ├── StartScreen.tsx    # Pantalla de inicio y selección de niveles
│   ├── GameHeader.tsx     # Header con estadísticas y controles
│   ├── GameArea.tsx       # Área principal del juego
│   └── index.ts           # Exportaciones centralizadas
├── hooks/                 # Custom hooks para lógica de estado
│   ├── useGameState.ts    # Hook principal del estado del juego
│   └── index.ts           # Exportaciones centralizadas
├── interfaces/            # Definiciones de tipos TypeScript
│   └── index.ts           # Todas las interfaces del proyecto
├── utils/                 # Funciones utilitarias puras
│   ├── gameUtils.ts       # Lógica del juego (cálculos, validaciones)
│   └── index.ts           # Exportaciones centralizadas
└── config/                # Configuraciones centralizadas
    ├── gameConfig.ts      # Configuración principal (Single Source of Truth)
    ├── configExamples.ts  # Ejemplos y presets de configuración
    └── README.md          # Documentación de configuración
```

## 🧩 Separación de Responsabilidades

### **📱 Components (`/components`)**

Componentes React puros que se enfocan únicamente en la presentación:

- **`StartScreen`**: Pantalla de bienvenida y selección de niveles
- **`GameHeader`**: Header con estadísticas y controles de nivel
- **`GameArea`**: Área principal con problemas matemáticos y respuestas

**Principios:**

- ✅ Solo reciben props y emiten eventos
- ✅ No manejan estado global
- ✅ Reutilizables y testeable
- ✅ Un solo propósito por componente

### **🎣 Hooks (`/hooks`)**

Custom hooks que encapsulan la lógica de estado y efectos:

- **`useGameState`**: Maneja todo el estado del juego y la lógica de transiciones

**Principios:**

- ✅ Encapsulan lógica compleja
- ✅ Reutilizables entre componentes
- ✅ Separados de la presentación
- ✅ Facilitan testing de lógica

### **🔧 Utils (`/utils`)**

Funciones puras para cálculos y transformaciones:

- **`gameUtils`**: Generación de problemas, cálculos de puntos, validaciones

**Principios:**

- ✅ Funciones puras (sin efectos secundarios)
- ✅ Fáciles de testear
- ✅ Reutilizables
- ✅ Una responsabilidad por función

### **📋 Interfaces (`/interfaces`)**

Definiciones de tipos TypeScript para todo el proyecto:

**Principios:**

- ✅ Tipos centralizados
- ✅ Contratos claros entre módulos
- ✅ Facilita refactoring
- ✅ Mejor IntelliSense

### **⚙️ Config (`/config`)**

Configuraciones centralizadas siguiendo Single Source of Truth:

**Principios:**

- ✅ Un solo lugar para cambios
- ✅ Configuraciones por ambiente/edad
- ✅ Valores tipados
- ✅ Fácil personalización

## 🔄 Flujo de Datos

```
Config ──┐
         ├──→ useGameState ──→ Components ──→ User
         │         ↑                 ↓
Utils ───┘         └─────── Events ──┘
```

1. **Config** proporciona la configuración inicial
2. **Utils** proveen funciones para cálculos
3. **useGameState** maneja el estado y lógica
4. **Components** renderizan la UI
5. **User Events** actualizan el estado via hooks

## 🎯 Beneficios de esta Arquitectura

### **🔧 Mantenibilidad**

- Código organizado y predecible
- Fácil encontrar y modificar funcionalidad específica
- Separación clara de responsabilidades

### **🧪 Testabilidad**

- Funciones puras fáciles de testear
- Componentes aislados
- Hooks separados de la UI

### **🚀 Escalabilidad**

- Fácil agregar nuevos componentes
- Reutilización de lógica
- Configuración flexible

### **👥 Colaboración**

- Estructura clara para el equipo
- Convenciones consistentes
- Fácil onboarding

## 📝 Cómo Trabajar con esta Arquitectura

### **Para agregar una nueva característica:**

1. **¿Es configuración?** → Modifica `/config/gameConfig.ts`
2. **¿Es cálculo/validación?** → Agrega función en `/utils/gameUtils.ts`
3. **¿Es estado/lógica?** → Modifica `/hooks/useGameState.ts`
4. **¿Es UI/presentación?** → Crea/modifica componente en `/components/`
5. **¿Necesita tipos?** → Define en `/interfaces/index.ts`

### **Para modificar comportamiento existente:**

1. **Cambiar valores** → `/config/gameConfig.ts`
2. **Cambiar cálculos** → `/utils/gameUtils.ts`
3. **Cambiar flujo** → `/hooks/useGameState.ts`
4. **Cambiar apariencia** → `/components/`

### **Para debugging:**

1. **Estado incorrecto** → Revisar `useGameState.ts`
2. **Cálculo erróneo** → Revisar `gameUtils.ts`
3. **UI rota** → Revisar componente específico
4. **Configuración** → Revisar `gameConfig.ts`

## 🛠️ Próximos Pasos Sugeridos

### **Testing**

- Agregar tests para `gameUtils.ts`
- Tests de componentes con React Testing Library
- Tests de integración para `useGameState.ts`

### **Performance**

- Memorización con `useMemo` y `useCallback` donde sea necesario
- Lazy loading de componentes
- Optimización de re-renders

### **Features**

- Sistema de guardado (localStorage/Firebase)
- Más tipos de operaciones (resta, multiplicación, división)
- Sistema de logros y badges
- Modo multijugador

### **UX/UI**

- Animaciones con Framer Motion
- Sonidos de feedback
- Modo dark/light
- Accesibilidad completa

---

¡Esta arquitectura proporciona una base sólida para el crecimiento y mantenimiento a largo plazo de NumberNinja! 🥷✨
