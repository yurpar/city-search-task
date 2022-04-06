import Client from "../models/client";

const ipCountLimit = parseInt(process.env.IP_COUNT_LIMIT || '5');
const ipTimeLimit = parseInt(process.env.IP_TIME_LIMIT || '1') * 60; // minutes to seconds

export const isIpAllowed = async (ip: string): Promise<boolean> => {
    if (ipCountLimit <= 0) return true;

    const nowSeconds = Math.floor(new Date().valueOf() / 1000)
    const periodStartSeconds = nowSeconds - ipTimeLimit
    await new Client({ ip, timestamp: nowSeconds }).save()
    const requestCount = await Client.count({ ip, timestamp: { $gt: periodStartSeconds } })

    return requestCount < ipCountLimit;
}

// TODO clean db
