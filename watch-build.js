#!/usr/bin/env node

/**
 * Watch script to rebuild packages when source files change
 * This script watches all TypeScript files in packages/*/src and triggers a build
 */

const { execSync } = require('child_process');
const chokidar = require('chokidar');
const path = require('path');

const packagesDir = path.join(__dirname, 'packages');
const watcher = chokidar.watch('**/*.ts', {
  cwd: packagesDir,
  ignored: /node_modules|dist/,
  persistent: true,
  ignoreInitial: true
});

let buildTimeout;
const DEBOUNCE_MS = 500;

function build() {
  console.log('🔄 Source files changed, rebuilding...');
  try {
    execSync('pnpm run build', { 
      stdio: 'inherit',
      cwd: __dirname 
    });
    console.log('✅ Build completed');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
  }
}

watcher.on('change', (filePath) => {
  console.log(`📝 File changed: ${filePath}`);
  clearTimeout(buildTimeout);
  buildTimeout = setTimeout(build, DEBOUNCE_MS);
});

watcher.on('add', (filePath) => {
  console.log(`➕ File added: ${filePath}`);
  clearTimeout(buildTimeout);
  buildTimeout = setTimeout(build, DEBOUNCE_MS);
});

console.log('👀 Watching for changes in packages/*/src/**/*.ts');
console.log('Press Ctrl+C to stop');
