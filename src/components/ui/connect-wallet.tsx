import { AppConfig, showConnect, UserSession } from '@stacks/connect';
import {
  Button,
  Col,
  Container,
  Dropdown,
  DropdownButton,
  Row
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAddressQuery } from '../../stores/AddressStore';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

function authenticate() {
  showConnect({
    appDetails: {
      name: 'Stacks React Starter',
      icon: window.location.origin + '/logo512.png'
    },
    redirectTo: '/',
    onFinish: () => {
      window.location.reload();
    },
    userSession
  });
}

function disconnect() {
  userSession.signUserOut('/');
}

const ConnectWallet = () => {
  if (userSession.isUserSignedIn()) {
    const { data: addressInfo } = useAddressQuery(
      userSession.loadUserData().profile.stxAddress.testnet
    );

    return (
      <DropdownButton
        className="m-1 me-3"
        variant="secondary"
        drop="start"
        size="sm"
        id="dropdown-basic"
        title={
          userSession
            .loadUserData()
            .profile.stxAddress.testnet.substring(0, 6) +
          '...' +
          userSession
            .loadUserData()
            .profile.stxAddress.testnet.substring(
              userSession.loadUserData().profile.stxAddress.testnet.length - 5,
              userSession.loadUserData().profile.stxAddress.testnet.length
            )
        }
      >
        <Dropdown.Item as={Container}>
          <Row>
            <Col className="text-end">
              <b>
                {addressInfo != undefined && addressInfo.stxBalance + ' stx'}
              </b>
            </Col>
          </Row>
          <Row>
            <Col className="text-end">
              {addressInfo != undefined &&
                '(' + addressInfo.stxUsdBalance + ')'}
            </Col>
          </Row>
        </Dropdown.Item>
        {/* <Dropdown.Item as={Container}>
          <Row>
            <Col className="text-end">
              <b>
                {addressInfo != undefined && addressInfo.sBtcBalance + ' sats'}
              </b>
            </Col>
          </Row>
          <Row>
            <Col className="text-end">
              {addressInfo != undefined &&
                '(' + addressInfo.sBtcUsdBalance + ')'}
            </Col>
          </Row>
        </Dropdown.Item> */}
        <Dropdown.Item
          as={Link}
          target="_blank"
          to={
            'http://localhost:3020/address/' +
            userSession.loadUserData().profile.stxAddress.testnet +
            '?chain=testnet&api=http://localhost:3999'
          }
        >
          <Container>
            <Row>
              <Col className="m-0 p-0 text-end">
                {userSession
                  .loadUserData()
                  .profile.stxAddress.testnet.substring(0, 6) +
                  '...' +
                  userSession
                    .loadUserData()
                    .profile.stxAddress.testnet.substring(
                      userSession.loadUserData().profile.stxAddress.testnet
                        .length - 8,
                      userSession.loadUserData().profile.stxAddress.testnet
                        .length
                    ) +
                  '  \u2197'}
              </Col>
            </Row>
          </Container>
        </Dropdown.Item>
        <Dropdown.Item>
          <Container>
            <Row>
              <Col className="m-0 p-0 text-end">
                <Button variant="link" onClick={disconnect} size="sm">
                  Disconnect Wallet
                </Button>
              </Col>
            </Row>
          </Container>
        </Dropdown.Item>
      </DropdownButton>
      /*       <Container>
              <Row>
                <Col className="text-start">
                  <Button variant="link" size="sm" target="_blank"
                    href={"http://localhost:3020/address/" + userSession.loadUserData().profile.stxAddress.testnet + "?chain=testnet&api=http://localhost:3999"}>
                    {userSession.loadUserData().profile.stxAddress.testnet.substring(0, 6) + "..." +
                      userSession.loadUserData().profile.stxAddress.testnet.substring(
                        userSession.loadUserData().profile.stxAddress.testnet.length - 5,
                        userSession.loadUserData().profile.stxAddress.testnet.length)}
                  </Button>
                </Col>
                <Col className="text-end">
                  <Button variant="link" onClick={disconnect} size="sm">
                    Disconnect Wallet
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col className="text-end">
                  {addressInfo != undefined && addressInfo.stxBalance + " stx ("}
                  {addressInfo != undefined && addressInfo.stxUsdBalance + ")"}
                </Col>
              </Row>
              <Row>
                <Col className="text-end">
                  {addressInfo != undefined && addressInfo.sBtcBalance + " sats ("}
                  {addressInfo != undefined && addressInfo.sBtcUsdBalance + ")"}
                </Col>
              </Row>
            </Container> */
    );
  }

  return (
    <button className="Connect" onClick={authenticate}>
      Connect Wallet
    </button>
  );
};

export default ConnectWallet;
