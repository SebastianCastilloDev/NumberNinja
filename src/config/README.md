# 🎮 Configuración de NumberNinja

Este directorio contiene toda la configuración centralizada del juego NumberNinja, siguiendo el patrón **Single Source of Truth**.

## 📁 Archivos

### `gameConfig.ts` - Configuración Principal

Contiene todas las configuraciones del juego en un solo lugar:

- ✅ **Niveles de dificultad** (rangos de números, puntos, requisitos)
- ✅ **Temporización del juego** (delays de feedback, animaciones)
- ✅ **Sistema de recompensas** (monedas, bonificaciones, retiros)
- ✅ **Configuración de UI** (fuentes, colores, tamaños)
- ✅ **Opciones de progreso** (auto-nivel, guardado local)

### `configExamples.ts` - Ejemplos y Presets

Contiene configuraciones predefinidas para diferentes casos de uso:

- 🧒 **Por edades** (6 años, 8 años, 10+ años)
- 🎯 **Por nivel de habilidad** (principiante, intermedio, avanzado)
- ⚡ **Por velocidad** (modo rápido, modo lento)
- 💰 **Por recompensas** (generoso, estricto)
- 🎲 **Modos especiales** (solo sumas fáciles, desafío extremo)

## 🔧 Cómo Personalizar

### 1. Cambiar Valores Básicos

```typescript
// En gameConfig.ts, modifica los valores directamente:
export const GAME_CONFIG: GameConfig = {
  levels: [
    {
      id: 1,
      name: "Principiante",
      minRange: 1, // ← Cambia aquí el rango mínimo
      maxRange: 10, // ← Cambia aquí el rango máximo
      pointsPerCorrect: 5, // ← Cambia aquí los puntos por acierto
      // ...
    },
  ],
  // ...
};
```

### 2. Ajustar Temporización

```typescript
game: {
  correctAnswerDelay: 1500,    // Tiempo después de respuesta correcta (ms)
  incorrectAnswerDelay: 2000,  // Tiempo después de respuesta incorrecta (ms)
  levelUpDelay: 3000,          // Tiempo de celebración al subir nivel (ms)
}
```

### 3. Personalizar Recompensas

```typescript
rewards: {
  coinName: "NinjaCoins",      // Nombre de la moneda virtual
  coinEmoji: "🪙",             // Emoji de la moneda
  conversionRate: 0.1,         // 1 punto = 0.1 monedas
  minimumWithdrawal: 50,       // Mínimo para retirar
  streakMultiplier: 1.5,       // Bonus por racha (50% extra)
}
```

### 4. Usar Configuraciones Predefinidas

```typescript
import { applyPresetConfig, getConfigByAge } from "./configExamples";

// Aplicar configuración por edad
const config = getConfigByAge(8); // Para niño de 8 años

// Aplicar configuración predefinida
const config = applyPresetConfig("BEGINNER"); // Modo principiante
```

## 🎯 Configuraciones Recomendadas por Edad

### 👶 **6-7 años**

- Números: 1-15 máximo
- Puntos: Triple recompensa
- Tiempo: Más lento para celebrar éxitos
- Requisitos: Más fáciles para subir de nivel

### 🧒 **8-9 años**

- Números: Configuración estándar
- Puntos: Doble recompensa
- Tiempo: Estándar
- Requisitos: Ligeramente reducidos

### 👦 **10+ años**

- Números: Rangos más amplios
- Puntos: Configuración estándar
- Tiempo: Más rápido
- Requisitos: Estándar o aumentados

## 🚀 Modos Especiales

### ⚡ **Modo Rápido**

- Perfecto para niños impacientes
- Feedback instantáneo
- Transiciones rápidas

### 🐌 **Modo Lento**

- Para niños que necesitan más tiempo
- Celebraciones extendidas
- Más tiempo para pensar

### 💰 **Modo Generoso**

- Más recompensas
- Menos requisitos para retiros
- Bonificaciones aumentadas

### 🏆 **Modo Desafío**

- Números más grandes
- Más puntos requeridos
- Recompensas aumentadas

## 🔄 Aplicar Cambios

1. **Modifica** los valores en `gameConfig.ts`
2. **Guarda** el archivo
3. **Reinicia** el servidor de desarrollo si es necesario
4. Los cambios se aplican **automáticamente** en toda la aplicación

## 📝 Ejemplo de Personalización Completa

```typescript
// Para crear una configuración personalizada para tu hijo específico:
export const CONFIG_MI_HIJO = {
  ...GAME_CONFIG,
  levels: GAME_CONFIG.levels.map((level) => ({
    ...level,
    maxRange: level.maxRange * 0.8, // Un poco más fácil
    pointsPerCorrect: level.pointsPerCorrect * 1.5, // Más recompensas
  })),
  rewards: {
    ...GAME_CONFIG.rewards,
    conversionRate: 0.2, // Más monedas por punto
    minimumWithdrawal: 30, // Puede retirar antes
  },
};
```

## 💡 Tips de Configuración

- 🎯 **Empieza conservador**: Es mejor que sea muy fácil al principio
- 📈 **Ajusta gradualmente**: Observa cómo responde tu hijo y ajusta
- 🎉 **Recompensas generosas**: Los niños necesitan mucha motivación positiva
- ⏱️ **Tiempo apropiado**: No hagas las transiciones muy rápidas
- 🔄 **Experimenta**: Prueba diferentes configuraciones hasta encontrar la perfecta

---

¡Con este sistema de configuración, puedes adaptar NumberNinja perfectamente a las necesidades y habilidades específicas de tus hijos! 🥷✨
