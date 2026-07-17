import path from 'node:path'
import { fileURLToPath } from 'node:url'

/** 这里是 ESM 环境，自己算 __dirname */
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// monorepo 根：对齐 pnpm-lock.yaml 所在层级
const monoRoot = path.resolve(__dirname, '../../../../')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. 静态导出
  output: 'export',

  // 2. 文件追踪相关
  outputFileTracingRoot: monoRoot,
  outputFileTracingExcludes: {
    '*': [
      '**/.next/**',
      '**/node_modules/**',
      '**/generated/**',
      './code/generated/**'
    ]
  },

  // 3. 开发环境代理
  // 注意：rewrites 在静态导出模式下不工作，只在开发环境使用
  ...(process.env.NODE_ENV !== 'production' && {
    async rewrites() {
      return [
        {
          source: "/flow-engine/PROJ_b0c2dac0/v2/run_flow",
          destination: "https://pztest.koudingvip.com/flow-engine/PROJ_b0c2dac0/v2/run_flow",
        },
        {
          source: '/api/project_pz/getimage',
          destination: 'https://project.autocoder.cc/api/project_pz/getimage'
        }
      ]
    }
  }),

  experimental: {
    externalDir: true,
    cpus: 4
  },

  transpilePackages: ['components'],

  // turbopack 配置保留备用，切回时加 --turbopack 并注释掉 webpack
  // turbopack: {
  //   root: monoRoot,
  //   resolveAlias: {
  //     '@/frontend/actions': path.resolve(__dirname, './lib/rpc-generated/src/frontend/actions'),
  //     '@/backend/actions': path.resolve(__dirname, './lib/rpc-generated/src/backend/actions'),
  //     '@/app/actions': path.resolve(__dirname, './lib/rpc-generated/src/app/actions'),
  //     '@': path.resolve(__dirname, './src'),
  //     '@/server': path.resolve(__dirname, './server')
  //   },
  //   rules: { ... }
  // },

  trailingSlash: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',

  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp']
  },

  productionBrowserSourceMaps: false,
  compress: true,

  env: {
    NEXT_PUBLIC_PROJECT_ID: process.env.NEXT_PUBLIC_PROJECT_ID || 'PROJ_43bb5105_snap_20260716_073319_373',
    NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH || '',
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
    NEXT_PUBLIC_RUNTIME_API: 'https://www.autocoder.cc/rpc',
    NEXT_PUBLIC_SITE_TITLE:
      process.env.NEXT_PUBLIC_SITE_TITLE || "Tavola Italian Dining"
  },

  typescript: {
    ignoreBuildErrors: true
  },

  webpack: (config) => {
    // resolve aliases（与 turbopack.resolveAlias 对齐）
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@/frontend/actions': path.resolve(__dirname, './lib/rpc-generated/src/frontend/actions'),
      '@/backend/actions': path.resolve(__dirname, './lib/rpc-generated/src/backend/actions'),
      '@/app/actions': path.resolve(__dirname, './lib/rpc-generated/src/app/actions'),
    }

    config.module.rules.push(
      // declare-function-rewrite: types 中的 declare function → actions re-export
      {
        test: /\/src\/(frontend|backend|app)\/types\/\w+\.ts$/,
        exclude: /node_modules/,
        enforce: 'pre',
        use: [{
          loader: path.resolve(__dirname, './src/default/declare-function-rewrite-loader.cjs'),
          options: { projectRoot: __dirname }
        }]
      },
      // source-attributes-loader
      {
        test: /\.(tsx|jsx)$/,
        exclude: /node_modules/,
        enforce: 'pre',
        use: [{ loader: path.resolve(__dirname, './src/default/source-attributes-loader.js') }]
      },
      // rpc-loader for actions
      {
        test: /[\\/]actions[\\/].+\.ts$|[\\/]app[\\/].+[\\/]actions\.ts$/,
        exclude: /node_modules/,
        use: [{ loader: path.resolve(__dirname, 'scripts/rpc-loader.js') }]
      }
    )
    return config
  },
}

export default nextConfig
