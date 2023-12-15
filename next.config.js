/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      maxNumberOfWorkers: 2,
      disableOptimizedLoading: true,
      scriptSetup: true,
      output: 'esm'
    }
  }
  
  module.exports = nextConfig