import { useSelector } from 'react-redux';
import BN from 'bn.js';
import { Token } from '@metamask/assets-controllers';
import {
  getNetworkConfigurationsByChainId,
} from '../selectors';
import {
  tokenBalancesStartPolling,
  tokenBalancesStopPollingByPollingToken,
} from '../store/actions';
import { getTokenBalances, getTokens } from '../ducks/metamask/metamask';
import { hexToDecimal } from '../../shared/modules/conversion.utils';
import useMultiPolling from './useMultiPolling';
import { Hex } from '@metamask/utils';

export const useTokenBalances = ({chainIds}: {chainIds?: Hex[]} = {}) => {
  const tokenBalances = useSelector(getTokenBalances);
  const networkConfigurations = useSelector(getNetworkConfigurationsByChainId);

  useMultiPolling({
    startPolling: tokenBalancesStartPolling,
    stopPollingByPollingToken: tokenBalancesStopPollingByPollingToken,
    input: chainIds ?? Object.keys(networkConfigurations),
  });

  return { tokenBalances };
};

// This hook is designed for backwards compatibility with `ui/hooks/useTokenTracker.js`
// and the github.com/MetaMask/eth-token-tracker library. It replaces RPC
// calls with reading state from `TokenBalancesController`. New code may prefer
// to use `useTokenBalances` directly, or compose higher level hooks from it.
export const useTokenTracker = ({
  chainId,
  tokens,
  address,
  hideZeroBalanceTokens,
}: {
  chainId: Hex;
  tokens: Token[];
  address: Hex;
  hideZeroBalanceTokens?: boolean;
}) => {

  const { tokenBalances } = useTokenBalances({ chainIds: [chainId] });

  const tokensWithBalances = tokens.reduce((acc, token) => {
    const hexBalance = tokenBalances[address]?.[chainId]?.[token.address as Hex] ?? '0x0';
    if (hexBalance !== '0x0' || !hideZeroBalanceTokens) {
      const decimalBalance = hexToDecimal(hexBalance);
      acc.push({
        address: token.address,
        symbol: token.symbol,
        decimals: token.decimals,
        balance: decimalBalance,
        string: stringifyBalance(new BN(decimalBalance), new BN(token.decimals)),
      });
    }
    return acc;
  }, [] as (Token & { balance: string, string: string })[])

  return {
    tokensWithBalances
  }

};

// From https://github.com/MetaMask/eth-token-tracker/blob/main/lib/util.js
// Ensures backwards compatibility with display formatting.
function stringifyBalance(balance: BN, bnDecimals: BN, balanceDecimals = 3) {
  if (balance.eq(new BN(0))) {
    return '0';
  }

  const decimals = parseInt(bnDecimals.toString());
  if (decimals === 0) {
    return balance.toString();
  }

  let bal = balance.toString();
  let len = bal.length;
  let decimalIndex = len - decimals;
  let prefix = '';

  if (decimalIndex <= 0) {
    while (prefix.length <= decimalIndex * -1) {
      prefix += '0';
      len++;
    }
    bal = prefix + bal;
    decimalIndex = 1;
  }

  const whole = bal.substr(0, len - decimals);

  if (balanceDecimals === 0) {
    return whole;
  }

  const fractional = bal.substr(decimalIndex, balanceDecimals);
  if (/0+$/.test(fractional)) {
    let withOnlySigZeroes = bal.substr(decimalIndex).replace(/0+$/, '');
    if (withOnlySigZeroes.length > 0) {
      withOnlySigZeroes = `.${withOnlySigZeroes}`;
    }
    return `${whole}${withOnlySigZeroes}`;
  }
  return `${whole}.${fractional}`;
}
