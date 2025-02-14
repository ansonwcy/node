import {AppServer, IAppServerOptions} from "@ijstech/app";
import Config from '../data/config.js';

async function main(){
    const Options: IAppServerOptions = {
        http: {
            port: 8088,
            router: {
                routes: [
                    {   
                        baseUrl: '/hello',
                        methods: ['GET'],
                        scriptPath: './plugins/hello/index.js',
                        isolated: false,
                        params: {
                            isolated: 'false, running in node.js'
                        },
                        plugins: {
                            cache: {},
                            db: {
                                "db1": {
                                    mysql: Config.mysql
                                }
                            },
                            queue: {
                                queues: ['job_queue_1'],
                                connection: {
                                    redis: Config.redis
                                }
                            },
                            message: {
                                connection: {
                                    redis: Config.redis
                                },
                                publish: ['msg_channel1']
                            }//,
                            // wallet: Config.wallet
                        },
                        dependencies: {
                            "@pack/demo": {
                                script: "file:../demoPack"
                            },
                            "bignumber.js": {}
                        }
                    },
                    {
                        baseUrl: '/vm/hello',
                        methods: ['GET'],
                        scriptPath: './plugins/hello/index.js',
                        isolated: true,
                        params: {
                            isolated: 'true, running inside vm'
                        },
                        plugins: {
                            cache: {},
                            db: {
                                "db1": {
                                    mysql: Config.mysql
                                }
                            },
                            queue: {
                                queues: ['job_queue_1'],
                                connection: {
                                    redis: Config.redis
                                }
                            },
                            message: {
                                connection: {
                                    redis: Config.redis
                                },
                                publish: ['msg_channel1']
                            }//,
                            // wallet: Config.wallet
                        },
                        dependencies: {
                            "@pack/demo": {script:"file:../demoPack"},
                            "bignumber.js": {version: '*'}
                        }
                    } 
                ]
            }
        },
        queue: {
            workers: [
                {
                    connection: {
                        redis: Config.redis
                    },                    
                    jobQueue: 'job_queue_1',
                    isolated: true,
                    scriptPath: './plugins/worker/index.js',                    
                    plugins: {
                        message: {
                            connection: {
                                redis: Config.redis
                            },
                            subscribe: ['msg_channel1']
                        }
                    },
                    dependencies: {
                        "@pack/demo": {script:"file:../demoPack"}
                    }
                }
            ]
        }
    };
    let app = new AppServer(Options);
    app.start();
};
main();