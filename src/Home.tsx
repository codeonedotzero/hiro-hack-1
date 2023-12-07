import { StacksDevnet } from '@stacks/network';
import Image from 'react-bootstrap/Image';
import { useGeeseQuery } from './stores/GeeseStore';
import { Container, Col, Row, Card, Button, Stack } from 'react-bootstrap';
import { useCallback } from 'react';
import { openContractCall } from '@stacks/connect';
import {
  FungibleConditionCode,
  makeContractSTXPostCondition,
  principalCV,
  uintCV,
  AnchorMode,
  PostConditionMode
} from '@stacks/transactions';
import { stringAscii } from '@stacks/transactions/dist/cl';
import { userSession } from './components/ui/connect-wallet';

const Home = () => {
  const devnet = new StacksDevnet();
  const contractInfo = {
    network: devnet,
    contractId: 1,
    contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    contractName: 'goose-gang'
  };

  const { data: geese } = useGeeseQuery(contractInfo);

  const handleBuyEggs = (goose: string, eggCount: number) => {
    transactEggs(goose, true, eggCount);
  };

  const handleSellEggs = (goose: string, eggCount: number) => {
    transactEggs(goose, false, eggCount);
  };

  const transactEggs = useCallback(
    async (goose: string, buyEggs: boolean, eggCount: number) => {
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
        contractAddress: contractAddress,
        contractName: contractName,
        functionName: buyEggs ? 'lay-eggs' : 'break-eggs',
        functionArgs: [principalCV(goose), uintCV(eggCount)],
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Allow,
        onFinish: (data: any) => {
          console.log(data);
        }
      };

      await openContractCall(options);
    },
    []
  );

  const headerStyle = {
    background:
      'linear-gradient(225deg, rgba(77,75,79,.3) 0%, rgba(71,63,79,.4) 48%, rgba(115,115,115,.3) 100%)'
  };

  const bodyStyle = {
    background:
      'linear-gradient(125deg, rgba(77,75,79,.2) 0%, rgba(115,115,115,.4) 100%)'
  };

  const footerStyle = {
    background:
      'linear-gradient(225deg, rgba(77,75,79,.3) 0%, rgba(71,63,79,.4) 48%, rgba(115,115,115,.3) 100%)'
  };

  const tempSquad = [
    '0e36051e6d49449b2c781a0e27fa741f4d1025c2c933978fc66da400897c46edi0',
    '960209a5a659ea58f7015fd5473ef07ea649e8a35f463024f6a61e49749eb7aai0',
    '7acaaab25addc7433e43caae612f04db538339332d228d9a4490c7eb6f7d7cf4i0',
    '75c34977db22fc6880d7c34c658fcd680f4dfc77d4e6449cea7f3551d90966b9i0',
    '61b2f0ce2238128ef7add87534efc6b42883bee19bea53829dda258aa6b5ee8bi0',
    '68e7b3db7b5c03588a09e41d88091d09275f71d6f61bd61107e893fb68cfb73fi0',
    'a1a4c9527c7cc2f7a99314171ca7bbf8203d11ac24d7517c9f80c93e059c2d52i0',
    '7ce0ccae1cb540de73392f425ae5a864c4f9f932be2229b92b1592cf272934eei0',
    '1bef081e60173443f2671c7ee0b9e8e500d2be8d6cf9d65b1deae0d63cb6f988i0',
    '970f9d274d890c4ac471ce30fed8f1327607b371bef6199107ddfc65bdb5818fi0'
  ];

  return (
    <Container className="justify-content-center text-center" fluid>
      <Row xs={2} sm={2} md={3} lg={4} xl={5}>
        {geese !== undefined &&
          geese.map((g) => (
            <Col key={g.address}>
              <Card style={{ width: '14rem' }} className="m-2">
                <Card.Header style={headerStyle}>
                  <div style={{ height: '2rem' }}>
                    <b>{typeof g.gangName !== 'undefined' && g.gangName}</b>
                  </div>
                </Card.Header>
                <Card.Body style={bodyStyle}>
                  <div className="mb-2" style={{ height: '9rem' }}>
                    {typeof g.name !== 'undefined' && g.name} <br />
                    <Image
                      className="mt-2"
                      width={80}
                      src={
                        typeof g.inscriptionId !== 'undefined'
                          ? g.inscriptionId
                          : ''
                      }
                    />
                  </div>
                  <Container>
                    <Row className="text-center">
                      <Col>
                        <Image
                          width={25}
                          src={
                            'https://ord-mirror.magiceden.dev/content/' +
                            tempSquad[Math.floor(Math.random() * 10)].toString()
                          }
                        />
                      </Col>
                      <Col>
                        <Image
                          width={25}
                          src={
                            'https://ord-mirror.magiceden.dev/content/' +
                            tempSquad[Math.floor(Math.random() * 10)].toString()
                          }
                        />
                      </Col>
                      <Col>
                        {' '}
                        <Image
                          width={25}
                          src={
                            'https://ord-mirror.magiceden.dev/content/' +
                            tempSquad[Math.floor(Math.random() * 10)].toString()
                          }
                        />
                      </Col>
                    </Row>
                  </Container>
                </Card.Body>
                <Card.Footer
                  style={footerStyle}
                  className="d-flex align-items-baseline"
                >
                  <Container>
                    <Row>
                      <Col className="text-center">
                        <b>Holders: </b>
                        {typeof g.holderCount !== 'undefined' && g.holderCount}
                      </Col>
                    </Row>
                    <Row>
                      <Col className="text-center">
                        <b>Supply: </b>
                        {typeof g.supply !== 'undefined' && g.supply}
                      </Col>
                    </Row>
                    <Row>
                      <Col className="text-center">
                        <b>Price: </b>
                        {typeof g.price !== 'undefined' && g.price}
                      </Col>
                    </Row>
                    <Row>
                      <Col className="text-center w-50">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="mt-2"
                          onClick={() => handleBuyEggs(g.address, 10)}
                        >
                          Buy Eggs
                        </Button>
                      </Col>
                      <Col className="text-center w-50">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="mt-2"
                          onClick={() => handleSellEggs(g.address, 10)}
                        >
                          Sell Eggs
                        </Button>
                      </Col>
                    </Row>
                  </Container>
                </Card.Footer>
              </Card>
            </Col>
          ))}
      </Row>
    </Container>
  );
};

export default Home;
