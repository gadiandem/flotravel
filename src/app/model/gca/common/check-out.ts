import { Status } from "./status";
import { Trace } from "./trace";

export class Checkout {
    data: string;
    error: string[];
    trace: Trace;
    status: Status;
}