import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'pb-bg':             '#EDEAE3',
        'pb-surface':        '#FFFFFF',
        'pb-surface-1':      '#F4F2EE',
        'pb-border':         '#E4DFD8',
        'pb-border-strong':  '#DDD8D0',
        'pb-text':           '#0E0E0C',
        'pb-text-secondary': '#6A6560',
        'pb-text-muted':     '#9A9690',
        'pb-text-disabled':  '#B0AA9E',
        'pb-gold':           '#C9A84C',
        'pb-gold-light':     '#FBF8F0',
        'pb-slate':          '#3D5A80',
        'pb-sage':           '#7B9E87',
        'pb-terra':          '#C9895A',
        'pb-plum':           '#8B7BA8',
        'pb-success':        '#3B6D11',
        'pb-success-bg':     '#EAF3DE',
        'pb-danger':         '#C0392B',
        'pb-danger-bg':      '#FDECEC',
        'pb-warning':        '#925A1A',
        'pb-warning-bg':     '#FEF3E2',
      },
      borderRadius: {
        'pb':    '8px',
        'pb-lg': '12px',
      },
      boxShadow: {
        'pb-card':  '0 2px 12px rgba(0,0,0,0.04)',
        'pb-panel': '0 4px 24px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}
export default config
