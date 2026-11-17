import ELK from "elkjs/lib/elk-api.js";
import elkWorkerUrl from "elkjs/lib/elk-worker.min.js?url";

export const elk = new ELK({ workerUrl: elkWorkerUrl });
