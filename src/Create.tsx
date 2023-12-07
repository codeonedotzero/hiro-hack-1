import { openContractCall } from '@stacks/connect';
import { StacksDevnet } from '@stacks/network';
import {
  FungibleConditionCode,
  makeContractSTXPostCondition,
  uintCV,
  AnchorMode,
  PostConditionMode,
  principalCV
} from '@stacks/transactions';
import { useCallback } from 'react';
import { Button } from './components/ui/button';
import { stringAscii } from '@stacks/transactions/dist/cl';
import { userSession } from './components/ui/connect-wallet';

const Create = () => {
  const handleCreateGooseGang = () => {
    createGooseGang();
  };
  const createGooseGang = useCallback(async () => {
    // With a contract principal
    const postConditionCode = FungibleConditionCode.LessEqual;
    const postConditionAmount = 25 * 1000000;
    const contractAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
    const contractName = 'goose-gang';

    const contractSTXPostCondition = makeContractSTXPostCondition(
      contractAddress,
      contractName,
      postConditionCode,
      postConditionAmount
    );

    const devnet = new StacksDevnet();
    const options = {
      network: devnet,
      contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      contractName: 'goose-gang',
      functionName: 'create-goose-gang',
      functionArgs: [
        principalCV(userSession.loadUserData().profile.stxAddress.testnet),
        stringAscii('tripnmonkey'),
        stringAscii('The Dev Crew'),
        stringAscii(
          '802ddaedc13ec4e2d30b66ee50c708dfefd723483c69bd0dea89dba7720c81b5i0'
        ),
        uintCV(100)
      ],
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Allow,
      onFinish: (data: any) => {
        console.log(data);
      }
    };

    await openContractCall(options);
  }, []);

  return (
    <div>
      {' '}
      <Button
        className="ms-2 my-0 w-25"
        size="sm"
        variant="secondary"
        onClick={() => handleCreateGooseGang()}
      >
        Create Goose Gang
      </Button>
    </div>
  );
};
export default Create;
