module.exports = {
  apps: [
    {
      name: 'starnet', // Name of your application
      script: 'dist/main.js', // Entry file of your app
      instances: 1, // Number of instances to start
      autorestart: true, // Restart on crash
      watch: false, // Watch files and reload
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
