import {IWorkerPlugin, ISession} from '@ijstech/plugin';

class Worker implements IWorkerPlugin {
    async process(session: ISession, data: any): Promise<any> {
        let wallet = session.plugins.wallet;
        return await wallet.tokenInfo(data.contract);
    };
};
export default Worker;