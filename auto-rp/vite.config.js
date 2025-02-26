export default {
    build: {
      manifest: true,
      sourcemap: true,
    //   rollupOptions: {
    //     // entrypoints to unpack different parts of the app
    //     // so they can be used as components
    //     input: {
    //       system_status: "src/system_status.ts",
    //       bikemi_heatmap: "src/bikemi_heatmap.ts",
    //       bikemi_time_chart: "src/bikemi_time_chart.ts",
    //       vega_loader: "src/vega_loader.ts",
    //       metro_reachability_map: "src/metro_reachability_map.ts",
    //       // 'index_html': 'index.html',
    //     },
    //     output: {
    //       // use predictable names to import them from generated static pages
    //       entryFileNames: `[name].js`,
    //       chunkFileNames: `[name].js`,
    //       assetFileNames: `[name].[ext]`,
    //     },
    //   },
    },
    server: {
      open: true,
      port: 5173,
      proxy: {
        "/api": "http://127.0.0.1:8000/",
      },
    },
  };