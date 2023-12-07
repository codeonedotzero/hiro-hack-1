import { Container, Col, Nav, Navbar, Row } from 'react-bootstrap';
import { QueryClient, QueryClientProvider } from 'react-query';
import ConnectWallet from './components/ui/connect-wallet';
import Layout from './Layout';

const queryClient = new QueryClient();

const headerStyle = {
  background:
    'linear-gradient(225deg, rgba(77,75,79,1) 0%, rgba(71,63,79,1) 48%, rgba(115,115,115,1) 100%)'
};

function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <Navbar
          className="mb-3"
          style={headerStyle}
          sticky="top"
          collapseOnSelect
          expand="md"
        >
          <Navbar.Brand className="ms-3 my-1" href="/">
            Goose Gang
          </Navbar.Brand>
          <Navbar.Toggle
            className="me-3"
            aria-controls="responsive-navbar-nav"
          />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link className="ms-1" href="/home">
                explore goose gangs
              </Nav.Link>
              <Nav.Link className="ms-1" href="/create">
                create a goose gang
              </Nav.Link>
              {/* <Nav.Link className="ms-1" href="/bridge">
                &#8644; bridge sBTC
              </Nav.Link> */}
            </Nav>
            <Nav>
              <Container className="w-100">
                <Row>
                  <Col className="text-end">
                    <ConnectWallet />
                  </Col>
                </Row>
              </Container>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Layout />
      </QueryClientProvider>
    </div>
  );
}

export default App;
