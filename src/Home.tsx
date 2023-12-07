import { StacksDevnet } from '@stacks/network';
import Image from 'react-bootstrap/Image';
import { useGeeseQuery } from './stores/GeeseStore';
import { Container, Col, Row, Card, Button } from 'react-bootstrap';
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
                  <div style={{ height: '9rem' }}>
                    {typeof g.name !== 'undefined' && g.name} <br />
                    <Image
                      width={80}
                      src={
                        typeof g.inscriptionId !== 'undefined'
                          ? g.inscriptionId
                          : ''
                      }
                    />
                  </div>
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
