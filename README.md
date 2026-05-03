<!-- # 👾Space Invaders👾-->
# Space Invaders

A browser-based Space Invaders arcade game built with vanilla JavaScript and HTML5 Canvas.

**[Play the Game](https://rvx05.github.io/space-invaders/)**

## Features

- **Classic Arcade Gameplay** — Move your ship and shoot down waves of enemies
- **Progressive Difficulty** — Enemy spawn rate and count increase every 10 points
- **Collision Detection** — AABB-based collision between bullets, enemies, and the player
- **Score Tracking** — Live score display with persistent high score via localStorage
- **Sound Effects** — Audio feedback for shooting, explosions, and game over
- **Pause/Resume** — Press ESC to pause and resume gameplay
- **Responsive Canvas** — Game canvas scales dynamically to fit any screen size

## Controls

| Key | Action |
|-----|--------|
| ← → | Move ship left/right |
| Space | Shoot |
| ESC | Pause/Resume |

## Tech Stack

- **HTML5 Canvas** — Game rendering
- **CSS3** — Styling with custom font support
- **Vanilla JavaScript** — Game logic, physics, and state management

## How It Works

The game uses a `requestAnimationFrame` loop with delta-time movement for smooth, frame-rate-independent player controls. Enemies spawn at random horizontal positions and descend at varying speeds. Difficulty scales every 10 points by increasing enemy spawn frequency and maximum enemy count.

### Core Architecture

- **Player Class** — Handles ship rendering, position, and movement
- **Enemy Class** — Manages enemy spawn position, speed, and descent
- **Bullet Class** — Controls projectile rendering and upward movement
- **Game Loop** — Coordinates rendering, collision checks, input handling, and difficulty scaling

## Running Locally

```bash
git clone https://github.com/rvx05/space-invaders.git
cd space-invaders
