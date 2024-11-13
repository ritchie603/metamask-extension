import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { useI18nContext } from '../../../../hooks/useI18nContext';
import { MetaMetricsContext } from '../../../../contexts/metametrics';
import {
  MetaMetricsEventCategory,
  MetaMetricsEventName,
  MetaMetricsTokenEventSource,
} from '../../../../../shared/constants/metametrics';
import {
  getAllDetectedTokensForSelectedAddress,
  getCurrentChainId,
  getCurrentNetwork,
  getDetectedTokensInCurrentNetwork,
} from '../../../../selectors';

import Popover from '../../../ui/popover';
import Box from '../../../ui/box';
import Button from '../../../ui/button';
import DetectedTokenDetails from '../detected-token-details/detected-token-details';
import { trace, endTrace, TraceName } from '../../../../../shared/lib/trace';

const DetectedTokenSelectionPopover = ({
  tokensListDetected,
  handleTokenSelection,
  onImport,
  onIgnoreAll,
  setShowDetectedTokens,
  sortingBasedOnTokenSelection,
}) => {
  const t = useI18nContext();
  const trackEvent = useContext(MetaMetricsContext);

  const chainId = useSelector(getCurrentChainId);

  const detectedTokens = useSelector(getDetectedTokensInCurrentNetwork);

  const currentNetwork = useSelector(getCurrentNetwork);

  const detectedTokensMultichain = useSelector(
    getAllDetectedTokensForSelectedAddress,
  );

  const totalTokens = process.env.PORTFOLIO_VIEW
    ? Object.values(detectedTokensMultichain).reduce(
        (count, tokenArray) => count + tokenArray.length,
        0,
      )
    : detectedTokens.length;

  const { selected: selectedTokens = [] } =
    sortingBasedOnTokenSelection(tokensListDetected);

  const onClose = () => {
    const chainIds = Object.keys(detectedTokensMultichain);
    const chainIdForMetrics = process.env.PORTFOLIO_VIEW ? chainIds : chainId;

    setShowDetectedTokens(false);
    const eventTokensDetails = detectedTokens.map(
      ({ address, symbol }) => `${symbol} - ${address}`,
    );
    trackEvent({
      event: MetaMetricsEventName.TokenImportCanceled,
      category: MetaMetricsEventCategory.Wallet,
      properties: {
        source_connection_method: MetaMetricsTokenEventSource.Detected,
        chain_id: chainIdForMetrics,
        tokens: eventTokensDetails,
      },
    });
  };

  const footer = (
    <>
      <Button
        className="detected-token-selection-popover__ignore-button"
        type="secondary"
        onClick={() => onIgnoreAll()}
      >
        {t('ignoreAll')}
      </Button>
      <Button
        className="detected-token-selection-popover__import-button"
        type="primary"
        onClick={() => {
          endTrace({ name: TraceName.AccountOverviewAssetListTab });
          trace({ name: TraceName.AccountOverviewAssetListTab });
          onImport();
        }}
        disabled={selectedTokens.length === 0}
      >
        {t('importWithCount', [`(${selectedTokens.length})`])}
      </Button>
    </>
  );

  return (
    <Popover
      className="detected-token-selection-popover"
      title={
        totalTokens === 1
          ? t('tokenFoundTitle')
          : t('tokensFoundTitle', [totalTokens])
      }
      onClose={onClose}
      footer={footer}
    >
      {process.env.PORTFOLIO_VIEW ? (
        <Box margin={3}>
          {Object.entries(detectedTokensMultichain).map(
            ([networkId, tokens]) => {
              return tokens.map((token, index) => (
                <DetectedTokenDetails
                  key={`${networkId}-${index}`}
                  token={token}
                  chainId={networkId}
                  handleTokenSelection={handleTokenSelection}
                  tokensListDetected={tokensListDetected}
                />
              ));
            },
          )}
        </Box>
      ) : (
        <Box margin={3}>
          {detectedTokens.map((token, index) => {
            return (
              <DetectedTokenDetails
                key={index}
                token={token}
                handleTokenSelection={handleTokenSelection}
                tokensListDetected={tokensListDetected}
                chainId={currentNetwork.chainId}
              />
            );
          })}
        </Box>
      )}
    </Popover>
  );
};

DetectedTokenSelectionPopover.propTypes = {
  tokensListDetected: PropTypes.object,
  handleTokenSelection: PropTypes.func.isRequired,
  onIgnoreAll: PropTypes.func.isRequired,
  onImport: PropTypes.func.isRequired,
  setShowDetectedTokens: PropTypes.func.isRequired,
  sortingBasedOnTokenSelection: PropTypes.func.isRequired,
};

export default DetectedTokenSelectionPopover;
