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

const getGeese = async (contractInfo: IContractInfo): Promise<IGoose[]> => {
  const geese: IGoose[] = [];

  const whitelist = [
    'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5',
    'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
  ];

  for (let i = 0; i < whitelist.length; i++) {
    const opt = {
      network: contractInfo.network,
      contractAddress: contractInfo.contractAddress,
      contractName: contractInfo.contractName,
      functionName: 'get-goose',
      functionArgs: [principalCV(whitelist[i])],
      senderAddress: userSession.loadUserData().profile.stxAddress.testnet
    };

    const result: any = await callReadOnlyFunction(opt);

    if (result.value && cvToString(result.value.data['address']).length > 0) {
      const goose = {
        address: cvToString(result.value.data['address']),
        name: cvToString(result.value.data['goose-name']),
        gangName: cvToString(result.value.data['gang-name']),
        inscriptionId:
          'https://ord-mirror.magiceden.dev/content/' +
          cvToString(result.value.data['inscription-id']).substring(
            1,
            cvToString(result.value.data['inscription-id']).length - 1
          ),
        holderCount: parseInt(cvToValue(result.value.data['holder-count'])),
        price: parseInt(cvToValue(result.value.data['price'])),
        supply: parseInt(cvToValue(result.value.data['supply'])),
        gooseFee: parseInt(cvToValue(result.value.data['goose-fee'])),
        protocolFee: parseInt(cvToValue(result.value.data['protocol-fee']))
      };
      if (goose.supply > 0) {
        geese.push(goose);
      }
    }
  }

  console.log(geese);
  return geese;
};

export const useGeeseQuery = (contractInfo: IContractInfo) =>
  useQuery({
    queryKey: ['geese', contractInfo],
    queryFn: () => getGeese(contractInfo),
    refetchInterval: 15000
  });
