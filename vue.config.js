const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
	transpileDependencies: true,
	devServer: {
		proxy: {
			'/articles': {
				target: 'https://api.kdark.weareshadowpins.com',
				changeOrigin: true,
				timeout: 100000,
			}
		}
	}
})