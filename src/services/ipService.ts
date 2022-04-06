import ClientModel from "../models/client";

const ipCountLimit = parseInt(process.env.IP_COUNT_LIMIT || '5');
const ipTimeLimit = parseInt(process.env.IP_TIME_LIMIT || '1') * 60; // minutes to seconds

export const isIpAllowed = async (ip: string): Promise<boolean> => {
    if (ipCountLimit <= 0) return true;

    const nowSeconds = Math.floor(new Date().valueOf() / 1000)
    const periodStartSeconds = nowSeconds - ipTimeLimit
    await new ClientModel({ ip, timestamp: nowSeconds }).save()

    const requestCount = await ClientModel.count({ ip, timestamp: { $gt: periodStartSeconds } })

    // TODO clean db once a minute, maybe
    ClientModel.deleteMany({timestamp: { $lt: periodStartSeconds } })

    return requestCount < ipCountLimit;
}

