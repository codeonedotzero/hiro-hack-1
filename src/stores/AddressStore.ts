import { useQuery } from 'react-query';
import { IAddress } from '../interfaces/IAddress';
import { ICurrencyPrices } from '../interfaces/ICurrencyPrices';

const getAddressInfo = async (address: string): Promise<IAddress> => {
  const addressInfo: IAddress = {
    address: address,
    balance: -1,
    stxBalance: 0,
    stxUsdBalance: '',
    sBtcBalance: 0,
    sBtcUsdBalance: ''
  };

  const prices: ICurrencyPrices = {
    btc: 0,
    stx: 0
  };

  //https://api.coingecko.com/api/v3/exchange_rates
  // eslint-disable-next-line no-constant-condition
  if (1 > 2) {
    prices.btc = 35000;
    prices.stx = 0.7;
  } else {
    await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=blockstack,bitcoin&vs_currencies=usd'
    )
      .then((data) => data.json())
      .then((json) => {
        prices.btc = json.bitcoin.usd;
        prices.stx = json.blockstack.usd;
      });
  }

  //look up player (microblock)
  await fetch(
    'http://localhost:3999/extended/v1/address/' +
      address +
      '/balances?unanchored=true'
  )
    .then((data) => data.json())
    .then((json) => {
      addressInfo.balance = json.stx.balance;
      addressInfo.stxBalance = json.stx.balance / 1000000;
      addressInfo.stxUsdBalance = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(addressInfo.stxBalance * prices.stx);

      if (
        json.fungible_tokens[
          'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.asset::sbtc'
        ] != undefined
      ) {
        addressInfo.sBtcBalance =
          json.fungible_tokens[
            'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.asset::sbtc'
          ].balance;

        addressInfo.sBtcUsdBalance = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format((addressInfo.sBtcBalance / 100000000) * prices.btc);
      }
    });
  return addressInfo;
};

export const useAddressQuery = (address: string) =>
  useQuery({
    queryKey: ['addressInfo', address],
    queryFn: () => getAddressInfo(address),
    refetchInterval: 60000
  });
