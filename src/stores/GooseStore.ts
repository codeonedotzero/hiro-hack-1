import { IContractInfo } from '@/interfaces/IContractInfo';
import {
  callReadOnlyFunction,
  cvToString,
  cvToValue,
  principalCV
} from '@stacks/transactions';
import { useQuery } from 'react-query';
import { userSession } from '../components/ui/connect-wallet';
import { IGoose } from '../interfaces/IGoose';

const getGoose = async (
  gooseAddress: string,
  contractInfo: IContractInfo
): Promise<IGoose | undefined> => {
  let goose: IGoose | undefined = undefined;

  const opt = {
    network: contractInfo.network,
    contractAddress: contractInfo.contractAddress,
    contractName: contractInfo.contractName,
    functionName: 'get-goose',
    functionArgs: [principalCV(gooseAddress)],
    senderAddress: userSession.loadUserData().profile.stxAddress.testnet
  };

  const result: any = await callReadOnlyFunction(opt);
  console.log(result.value);

  if (result.value) {
    goose = {
      address: cvToString(result.value.data['address']),
      name: '',
      inscriptionId:
        'https://ord-mirror.magiceden.dev/content/7503546e9e5309b68a08d25d550e17183c87d005e12425b030c209b10e50ed49i0',
      holderCount: parseInt(cvToValue(result.value.data['holder-count'])),
      price: parseInt(cvToValue(result.value.data['price'])),
      supply: parseInt(cvToValue(result.value.data['supply'])),
      gooseFee: parseInt(cvToValue(result.value.data['goose-fee'])),
      protocolFee: parseInt(cvToValue(result.value.data['protocol-fee']))
    };
  }

  return goose;
};

export const useGooseQuery = (
  gooseAddress: string,
  contractInfo: IContractInfo
) =>
  useQuery({
    queryKey: ['goose', gooseAddress, contractInfo],
    queryFn: () => getGoose(gooseAddress, contractInfo),
    refetchInterval: 15000
  });
