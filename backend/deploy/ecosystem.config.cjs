module.exports = {
  apps: [
    {
      name: 'programactor-api',
      script: './dist/server.js',
      instances: 'max', // Cluster mode (utilise tous les cœurs CPU du VPS)
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5001,
      },
      max_memory_restart: '500M',
      autorestart: true,
      watch: false,
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
