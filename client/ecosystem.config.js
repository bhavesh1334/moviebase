module.exports = {
  apps: [
    {
      name: "moviebase-client",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 8000",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 8000,
      },
    },
  ],
};
