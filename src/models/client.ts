import { model, Schema } from "mongoose";


export interface Client {
    ip: string;
    timestamp: number;
}

const clientSchema = new Schema<Client>({
    ip: String,
    timestamp: Number,
})

const ClientModel = model<Client>('Client', clientSchema);

export default ClientModel;
