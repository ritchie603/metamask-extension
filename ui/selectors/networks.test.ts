import { NetworkStatus, RpcEndpointType } from '@metamask/network-controller';
import mockState from '../../test/data/mock-state.json';
import { mockNetworkState } from '../../test/stub/networks';
import { CHAIN_IDS } from '../../shared/constants/network';
import * as networks from '../../shared/modules/selectors/networks';
describe('Network Selectors', () => {
  describe('#getNetworkConfigurationsByChainId', () => {
    it('returns networkConfigurationsByChainId', () => {
      const networkConfigurationsByChainId = {
        '0x1351': {
          name: 'TEST',
          chainId: '0x1351' as const,
          nativeCurrency: 'TEST',
          defaultRpcEndpointUrl: 'https://mock-rpc-url-1',
          defaultRpcEndpointIndex: 0,
          rpcEndpoints: [
            {
              type: RpcEndpointType.Custom as const,
              networkClientId: 'testNetworkConfigurationId1',
              url: 'https://mock-rpc-url-1',
            },
          ],
          blockExplorerUrls: [],
        },
        '0x1337': {
          name: 'RPC',
          chainId: '0x1337' as const,
          nativeCurrency: 'RPC',
          defaultRpcEndpointUrl: 'https://mock-rpc-url-2',
          defaultRpcEndpointIndex: 0,
          rpcEndpoints: [
            {
              type: RpcEndpointType.Custom as const,
              networkClientId: 'testNetworkConfigurationId2',
              url: 'https://mock-rpc-url-2',
            },
          ],
          blockExplorerUrls: [],
        },
      };

      expect(
        networks.getNetworkConfigurationsByChainId({
          metamask: {
            NetworkController: {
              networkConfigurationsByChainId,
            },
          },
        }),
      ).toStrictEqual(networkConfigurationsByChainId);
    });
  });

  describe('#getInfuraBlocked', () => {
    it('returns getInfuraBlocked', () => {
      let isInfuraBlocked = networks.getInfuraBlocked(mockState);
      expect(isInfuraBlocked).toBe(false);

      const modifiedMockState = {
        ...mockState,
        metamask: {
          NetworkController: {
            ...mockState.metamask,
            ...mockNetworkState({
              chainId: CHAIN_IDS.GOERLI,
              metadata: { status: NetworkStatus.Blocked, EIPS: {} },
            }),
          },
        },
      };
      isInfuraBlocked = networks.getInfuraBlocked(modifiedMockState);
      expect(isInfuraBlocked).toBe(true);
    });
});
