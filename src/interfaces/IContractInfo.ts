import { StacksNetwork } from '@stacks/network';

export interface IContractInfo {
  network: StacksNetwork;
  contractId: number;
  contractAddress: string;
  contractName: string;
}
