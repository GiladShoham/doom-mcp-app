# Doom MCP App

A Doom-style FPS game built as an MCP (Model Context Protocol) App. AI models can launch and play an interactive Doom clone directly through the MCP interface.

The game itself is based on [doom-react-three-fiber](https://github.com/eugeniosegala/doom-react-three-fiber) by Eugenio Segala.

## Features

- **Interactive FPS Game**: Doom-style first-person shooter with enemies, projectiles, and collectibles
- **MCP Apps compliant**: Uses the `@modelcontextprotocol/ext-apps` SDK to serve the game as an MCP App
- **Dual transport**: Supports both HTTP (Streamable HTTP) and stdio transports
- **Single-file bundle**: The entire game (code, assets, sounds) is bundled into a single HTML file via Vite

## Game Controls

| Control | Action |
|---------|--------|
| W/A/S/D | Movement |
| Mouse | Camera look (pointer lock) |
| Space | Shoot |
| Click | Enable pointer lock |

## Project Structure

```
├── main.ts                # MCP server entry point (HTTP or stdio transport)
├── server.ts              # MCP server with tool and resource registration
├── mcp-app.html           # HTML entry point for Vite (game UI)
├── src/
│   ├── mcp-app.tsx        # MCP app wrapper component
│   ├── index.js           # Standalone game entry point (with router)
│   ├── index.css          # Global styles
│   ├── store.js           # Zustand state management
│   ├── components/        # React Three Fiber game components
│   │   ├── Player.js      # Player movement, collision, shooting
│   │   ├── Enemy.js       # Enemy AI, pathfinding, combat
│   │   ├── Bullet.js      # Projectile logic
│   │   ├── FPVControls.js # Pointer lock camera controls
│   │   ├── Gun.js         # Weapon display
│   │   ├── Level01.js     # Level definition and tile map
│   │   └── ...            # UI, coins, lights, walls, etc.
│   ├── levels/            # Level definitions
│   ├── hooks/             # Custom hooks (keyboard, long press)
│   ├── utils/             # Utility functions
│   ├── maps-data/         # Level tile map data
│   ├── sounds/            # Audio files (music, SFX)
│   └── images/            # Sprite assets
├── .vscode/mcp.json       # VS Code MCP server configuration
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite bundler configuration
├── tsconfig.server.json   # TypeScript config (server)
└── dist/                  # Build output
```

## MCP Tool

The server exposes a single tool:

| Tool | Description |
|------|-------------|
| `play_doom` | Launch an interactive Doom-style FPS game in the MCP App UI |

The tool takes no input parameters. When called, it returns a UI resource that renders the full game.

## Installation

```bash
npm install
```

## Running the MCP Server

The MCP server serves the game as an MCP App that AI hosts can render.

### Build the game UI first

```bash
npm run build:mcp
```

This bundles the entire game into a single HTML file at `dist/mcp-app.html`.

### HTTP transport (default)

```bash
npm run serve:mcp
# Server listens on http://localhost:3001/mcp
```

### Stdio transport

```bash
tsx main.ts --stdio
```

### Development mode (watch + serve)

```bash
npm run dev:mcp
```

This runs the Vite build in watch mode and the MCP server concurrently, so changes to the game are automatically rebuilt.

### VS Code integration

The project includes a `.vscode/mcp.json` that configures the MCP server for VS Code:

```json
{
  "servers": {
    "doom-mcp-app": {
      "url": "http://localhost:3001/mcp",
      "type": "http"
    }
  }
}
```

Start the MCP server, then VS Code will connect to it automatically.

## Running the Game Standalone (without MCP)

The game can also run as a standalone React app without the MCP layer:

```bash
npm start
```

This starts a development server using React Scripts with the entry point at `src/index.js`.

## Testing with basic-host

1. Build and start the MCP server:
```bash
npm run build:mcp && npm run serve:mcp
```

2. In another directory, clone and set up the ext-apps repository:
```bash
git clone https://github.com/modelcontextprotocol/ext-apps.git
cd ext-apps
npm install
cd examples/basic-host
npm install
```

3. Run basic-host pointing to the Doom MCP server:
```bash
SERVERS='["http://localhost:3001/mcp"]' npm run start
```

4. Open http://localhost:8080 and call the `play_doom` tool

## Tech Stack

- **React** + **React Three Fiber** - 3D rendering in React
- **Three.js** - WebGL 3D graphics
- **Zustand** - Lightweight state management
- **Vite** + **vite-plugin-singlefile** - Build tooling
- **Express** - HTTP server for MCP transport
- **@modelcontextprotocol/sdk** - MCP server SDK
- **@modelcontextprotocol/ext-apps** - MCP Apps UI integration

## Credits

- Game based on [doom-react-three-fiber](https://github.com/eugeniosegala/doom-react-three-fiber) by Eugenio Segala
- Sprites generated using [Piskel](https://www.piskelapp.com/)

## License

MIT
