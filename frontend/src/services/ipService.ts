import { IpAnalysisResult } from '../types';
import { lookupIpInfo } from './ipInfoService';

export async function lookupIp(ipAddress: string): Promise<IpAnalysisResult> {
  return lookupIpInfo(ipAddress);
}
export { lookupIpInfo };

