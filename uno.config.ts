import { defineConfig } from 'unocss'
import presetUno from '@unocss/preset-uno'

export default defineConfig({
  presets: [
    presetUno(),
  ],
  content: {
    filesystem: [
      'dev/**/*.{html,ts,js}',
    ],
  },
})
