import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import ConfigureSnapPopup, {
  ConfigureSnapPopupType,
} from '../../../components/app/configure-snap-popup';
import {
  ButtonVariant,
  Box,
  Button,
  Icon,
  IconName,
  Text,
  IconSize,
} from '../../../components/component-library';
import {
  AlignItems,
  BackgroundColor,
  BorderColor,
  BorderRadius,
  TextColor,
  Display,
  FlexDirection,
  IconColor,
  JustifyContent,
  TextVariant,
} from '../../../helpers/constants/design-system';
import { useI18nContext } from '../../../hooks/useI18nContext';
import { SnapCardProps } from '../new-snap-account-page/new-snap-account-page';

export default function SnapCard({
  metadata: {
    name,
    author: { website },
    summary,
  },
  isInstalled,
  updateAvailable,
  id,
  onClickFunc,
}: Pick<SnapCardProps, 'id' | 'metadata' | 'versions'> & {
  onClickFunc: () => void;
  updateAvailable: boolean;
  isInstalled: boolean;
}) {
  const t = useI18nContext();
  const history = useHistory();
  const [showConfigPopover, setShowConfigPopover] = useState(false);

  return (
    <Box
      display={Display.Flex}
      flexDirection={FlexDirection.Column}
      backgroundColor={BackgroundColor.backgroundDefault}
      borderColor={BorderColor.borderMuted}
      borderRadius={BorderRadius.SM}
      borderWidth={1}
      padding={[4, 4, 4, 4]}
      data-testid="key-management-snap"
      onClick={() => {
        history.push(`/add-snap-account/${encodeURIComponent(id)}`);
      }}
    >
      <Box
        display={Display.Flex}
        justifyContent={JustifyContent.spaceBetween}
        alignItems={AlignItems.center}
        marginBottom={2}
      >
        <Box
          display={Display.Flex}
          justifyContent={JustifyContent.center}
          alignItems={AlignItems.center}
          style={{
            borderRadius: '50%',
            height: '32px',
            width: '32px',
            backgroundColor: BackgroundColor.infoDefault,
          }}
          borderWidth={1}
          borderColor={BorderColor.borderMuted}
          padding={[2, 2, 2, 2]}
          marginRight={1}
        >
          <Box
            className="snap-detail-icon"
            display={Display.Flex}
            justifyContent={JustifyContent.center}
            alignItems={AlignItems.center}
          >
            <Text>{name ? name[0] : '?'}</Text>
          </Box>
        </Box>
        {isInstalled ? (
          <Button
            className="configure-button"
            data-testid="configure-snap-button"
            variant={ButtonVariant.Secondary}
            onClick={() => setShowConfigPopover(true)}
          >
            {t('snapConfigure')}
            <Icon
              as="span"
              marginLeft={2}
              name={IconName.Arrow2UpRight}
              style={{
                verticalAlign: 'middle',
              }}
            />
          </Button>
        ) : (
          <Button
            data-testid="install-snap-button"
            variant={ButtonVariant.Secondary}
            onClick={() => {
              history.push(`/add-snap-account/${id}`);
            }}
          >
            {t('install')}
          </Button>
        )}
      </Box>
      <Text
        variant={TextVariant.bodySm}
        color={TextColor.textAlternative}
        marginBottom={2}
      >
        {name}
      </Text>
      <Text variant={TextVariant.headingMd} marginBottom="auto">
        {summary}
      </Text>

      <Box
        display={Display.Flex}
        flexDirection={FlexDirection.Row}
        justifyContent={JustifyContent.spaceBetween}
        alignItems={AlignItems.center}
        marginTop={2}
      >
        {updateAvailable && (
          <Text color={TextColor.textAlternative}>
            {t('snapUpdateAvailable')}
          </Text>
        )}
        <Icon
          data-testid="to-snap-detail"
          name={IconName.Arrow2Right}
          color={IconColor.iconAlternative}
          size={IconSize.Xs}
          onClick={onClickFunc}
          marginLeft="auto"
        />
      </Box>
      <ConfigureSnapPopup
        isOpen={showConfigPopover}
        type={ConfigureSnapPopupType.CONFIGURE}
        onClose={() => setShowConfigPopover(false)}
        link={website}
      />
    </Box>
  );
}
