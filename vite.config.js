import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, __dirname)

  return {
    plugins: [vue()],
    // 强制预构建插件包
    optimizeDeps: {
      //检测需要预构建的依赖项
      entries: [],
      //默认情况下，不在 node_modules 中的，链接的包不会预构建
      include: ['axios'],
      exclude: ['your-package-name'], //排除在优化之外
    },
    //静态资源服务的文件夹
    publicDir: 'public',
    base: './',
    //静态资源处理
    assetsInclude: '',
    //控制台输出的级别 info 、warn、error、silent
    logLevel: 'info',
    // 设为false 可以避免 vite 清屏而错过在终端中打印某些关键信息
    clearScreen: true,
    resolve: {
      alias: [
        //配置别名
        { find: '@', replacement: resolve(__dirname, './src') },
      ],
      // 情景导出 package.json 配置中的exports字段
      conditions: [],
      // 导入时想要省略的扩展名列表
      // 不建议使用 .vue 影响IDE和类型支持
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    },
    //本地运行配置，以及反向代理配置
    server: {
      host: 'localhost',
      https: false, //是否启用 http 2
      cors: true, //为开发服务器配置 CORS , 默认启用并允许任何源
      open: true, //服务启动时自动在浏览器中打开应用
      port: '9000',
      strictPort: false, //设为true时端口被占用则直接退出，不会尝试下一个可用端口
      force: true, //是否强制依赖预构建
      hmr: true, //禁用或配置 HMR 连接 true 时 热部署
      // 传递给 chockidar 的文件系统监视器选项
      watch: {
        ignored: ['!**/node_modules/your-package-name/**'],
      },
      // 反向代理配置
      proxy: {
        [env.VITE_APP_BASE_API]: {
          // 后台地址
          target: 'https://api.imooc-web.lgdsunday.club/api',
          changeOrigin: true,
          rewrite: (path) =>
            path.replace(new RegExp('^' + env.VITE_APP_BASE_API), ''),
        },
      },
    },
  }
})
// export default defineConfig({
//   plugins: [vue()],
//   resolve:{
//     alias:{
//       '@':'./src'
//     }
//   },
//    //本地运行配置，以及反向代理配置
//    server: {
//     host: 'localhost',
//     https: false, //是否启用 http 2
//     cors: true, //为开发服务器配置 CORS , 默认启用并允许任何源
//     open: true, //服务启动时自动在浏览器中打开应用
//     port: '9000',
//     strictPort: false, //设为true时端口被占用则直接退出，不会尝试下一个可用端口
//     force: true, //是否强制依赖预构建
//     hmr: true, //禁用或配置 HMR 连接 true 时 热部署
//     // 传递给 chockidar 的文件系统监视器选项
//     watch: {
//       ignored: ['!**/node_modules/your-package-name/**'],
//     },
//     // 反向代理配置
//     proxy: {
//       [env.VITE_APP_BASE_API]: {
//         // 后台地址
//         target: 'https://api.imooc-web.lgdsunday.club/api',
//         changeOrigin: true,
//         rewrite: (path) =>
//           path.replace(new RegExp('^' + env.VITE_APP_BASE_API), ''),
//       },
//     },
//   },
// })
