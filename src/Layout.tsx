import { Route, Routes } from 'react-router-dom';
import Home from './Home';
import ConnectWallet from './components/ui/connect-wallet';
import Create from './Create';

const Layout = () => {
  return (
    <Routes>
      {/* static pages */}
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/create" element={<Create />} />
      <Route path="/connect" element={<ConnectWallet />} />
    </Routes>
  );
};
export default Layout;
