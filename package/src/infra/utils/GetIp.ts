import os from "node:os";
import cluster from "node:cluster";
import { logger } from "../../utils/Logger";

export function getIP(port: number) {
  const networkInterfaces = os.networkInterfaces();
  Object.values(networkInterfaces).forEach((ifaceList) => {
    ifaceList?.forEach((iface) => {
      if (iface.family === "IPv4" && !iface.internal) {
        const who = cluster.isPrimary ? "master" : "worker";
        logger("info", `[${who}] accessible at http://${iface.address}:${port}`);
      }
    });
  });
}
