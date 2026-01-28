import React, { Suspense, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";
import type { App, McpUiHostContext } from "@modelcontextprotocol/ext-apps";
import { useApp } from "@modelcontextprotocol/ext-apps/react";

import Level01 from "./levels/Level01";
import UI from "./components/UI";
import ViewFinder from "./components/ViewFinder";
import Gun from "./components/Gun";

import "./index.css";

function DoomGame() {
  return (
    <>
      <Loader />
      <UI>
        <ViewFinder />
        <Gun />
      </UI>
      <Canvas
        shadows={{
          type: "BasicShadowMap",
        }}
        mode="concurrent"
        camera={{ position: [0, 5, 0], rotation: [0, 3.2, 0] }}
      >
        <Level01 />
      </Canvas>
    </>
  );
}

function DoomMcpApp() {
  const [hostContext, setHostContext] = useState<McpUiHostContext | undefined>();

  const { app, error } = useApp({
    appInfo: { name: "Doom MCP App", version: "1.0.0" },
    capabilities: {},
    onAppCreated: (app: App) => {
      app.onteardown = async () => {
        console.info("Doom MCP App is being torn down");
        return {};
      };

      app.ontoolinput = async (input) => {
        console.info("Received tool call input:", input);
      };

      app.ontoolresult = async (result) => {
        console.info("Received tool call result:", result);
      };

      app.ontoolcancelled = (params) => {
        console.info("Tool call cancelled:", params.reason);
      };

      app.onerror = console.error;

      app.onhostcontextchanged = (params) => {
        setHostContext((prev) => ({ ...prev, ...params }));
      };
    },
  });

  useEffect(() => {
    if (app) {
      setHostContext(app.getHostContext());
    }
  }, [app]);

  if (error) {
    return (
      <div style={{ color: "red", padding: 20 }}>
        <strong>ERROR:</strong> {error.message}
      </div>
    );
  }

  if (!app) {
    return (
      <div style={{ color: "white", padding: 20, textAlign: "center" }}>
        Connecting to MCP host...
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        paddingTop: hostContext?.safeAreaInsets?.top,
        paddingRight: hostContext?.safeAreaInsets?.right,
        paddingBottom: hostContext?.safeAreaInsets?.bottom,
        paddingLeft: hostContext?.safeAreaInsets?.left,
      }}
    >
      <Suspense fallback={null}>
        <DoomGame />
      </Suspense>
    </div>
  );
}

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<DoomMcpApp />);
}
