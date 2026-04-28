require('dotenv').config({ path: '/var/www/autogest/.env.production' })

module.exports = {
  apps: [
    {
      name: 'autogest',
      script: 'node_modules/.bin/next',
      args: 'start -p 3000',
      cwd: '/var/www/autogest',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
        ...require('dotenv').parse(require('fs').readFileSync('/var/www/autogest/.env.production')),
      },
      error_file: '/tmp/autogest-error.log',
      out_file: '/tmp/autogest-out.log',
      merge_logs: true,
    },
  ],
}
