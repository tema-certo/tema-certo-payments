module.exports = {
    apps: [
        /*{
            name: 'tema-certo-payments-api',
	        script: 'src/index.ts',
	        interpreter: 'tsx',
	        watch: true,
	        env: {
		        NODE_ENV: 'development',
	        },
        },*/
        {
            name: 'tema-certo-payments-consumer',
            script: 'src/index.consumer.ts',
	        interpreter: 'tsx',
        },
    ],
};
