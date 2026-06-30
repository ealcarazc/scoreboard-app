# Marcador Deportivo Familiar

App de marcador para Tenis, Ping-Pong y Squash. Diseño limpio con números grandes y control táctil para cancha.

## Características v1

- **Tres deportes**: 
  - Ping-pong (11 o 21 puntos, saque cada 2 / cada 1 a partir de 10-10)
  - Squash (11 puntos, regla PAR, victoria por +1)
  - Tenis (sets/juegos/tie-break, mejor de 3 o 5)
- **Tenis avanzado**: Deuce, ventaja, tie-break a 6-6 (a 7 puntos)
- **Interacción táctil**: Tap para anotar, swipe para deshacer, reset con confirmación
- **Feedback**: Vibración + sonido opcional (Web API)
- **Jugadores**: 4 predefinidos (Ernesto, Liz, Lila, Maia) + 8 colores seleccionables

## Setup

```bash
npm install
npm run dev
```

Abierto en `http://localhost:3000`

## Tech Stack

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS v4
- **State**: React hooks + Context
- **Tactile**: Web Vibration API + Web Audio API
- **Future**: Supabase para sincronización real-time

## Próximos pasos (Fase 2)

- [ ] Persistencia localStorage
- [ ] Historial de partidos
- [ ] Sincronización Supabase (phone ↔ iPad)
- [ ] Pantalla de estadísticas
