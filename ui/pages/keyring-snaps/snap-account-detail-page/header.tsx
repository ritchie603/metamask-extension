import React, { useState } from 'react';
import ConfigureSnapPopup, {
  ConfigureSnapPopupType,
} from '../../../components/app/configure-snap-popup/configure-snap-popup';
import {
  ButtonVariant,
  Box,
  Button,
  Icon,
  IconName,
  Tag,
  Text,
} from '../../../components/component-library';
import {
  AlignItems,
  BorderColor,
  Display,
  FlexDirection,
  JustifyContent,
  TextColor,
  TextVariant,
} from '../../../helpers/constants/design-system';
import { useI18nContext } from '../../../hooks/useI18nContext';
import { METAMASK_DEVELOPER } from '../constants';
import { SnapCardProps } from '../new-snap-account-page/new-snap-account-page';
import SnapDetailTag from './snap-detail-tag';

export const SnapDetailHeader = ({
  updateAvailable,
  isInstalled,
  metadata: {
    name,
    author: { name: developer, website },
    audits,
  },
}: Pick<SnapCardProps, 'updateAvailable' | 'isInstalled' | 'metadata'>) => {
  const t = useI18nContext();
  const [showConfigPopover, setShowConfigPopover] = useState(false);
  const [showConfigPopoverType, setShowConfigPopoverType] =
    useState<ConfigureSnapPopupType>(ConfigureSnapPopupType.INSTALL);

  return (
    <>
      <Box marginBottom={5}>
        <Box
          display={Display.Flex}
          flexDirection={FlexDirection.Row}
          alignItems={AlignItems.center}
          marginBottom={4}
        >
          <Button
            variant={ButtonVariant.Link}
            marginRight={4}
            onClick={() => history.back()}
          >
            {t('snapDetailsCreateASnapAccount')}
          </Button>
          <Icon name={IconName.ArrowRight} marginRight={4} />
          <Text>{name}</Text>
        </Box>
        <Box
          display={Display.Flex}
          justifyContent={JustifyContent.spaceBetween}
        >
          <Box
            display={Display.Flex}
            flexDirection={FlexDirection.Row}
            alignItems={AlignItems.center}
          >
            <Text variant={TextVariant.headingLg} marginRight={1}>
              {name}
            </Text>
            {isInstalled && (
              <Tag
                label={t('snapDetailsInstalled') as string}
                labelProps={{
                  color: TextColor.textAlternative,
                }}
              />
            )}
          </Box>
          <Box>
            {isInstalled && updateAvailable && (
              <Button
                variant={ButtonVariant.Secondary}
                marginRight={1}
                onClick={() => {
                  setShowConfigPopoverType(ConfigureSnapPopupType.INSTALL);
                  setShowConfigPopover(true);
                }}
              >
                {t('snapUpdateAvailable')}
              </Button>
            )}
            {isInstalled && (
              <Button
                variant={ButtonVariant.Primary}
                onClick={() => {
                  setShowConfigPopoverType(ConfigureSnapPopupType.CONFIGURE);
                  setShowConfigPopover(true);
                }}
              >
                {t('snapConfigure')}
              </Button>
            )}
            {!isInstalled && (
              <Button
                variant={ButtonVariant.Primary}
                onClick={() => {
                  setShowConfigPopoverType(ConfigureSnapPopupType.INSTALL);
                  setShowConfigPopover(true);
                }}
              >
                {t('snapInstall')}
              </Button>
            )}
          </Box>
        </Box>
        <Box
          display={Display.Flex}
          flexDirection={FlexDirection.Row}
          alignItems={AlignItems.center}
        >
          <Box
            display={Display.Flex}
            justifyContent={JustifyContent.center}
            alignItems={AlignItems.center}
            style={{
              borderRadius: '50%',
              height: '32px',
              width: '32px',
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
          {developer.toLowerCase() === METAMASK_DEVELOPER && (
            <SnapDetailTag icon={IconName.Star}>
              {t('snapCreatedByMetaMask')}
            </SnapDetailTag>
          )}
          {audits.length > 0 && (
            <SnapDetailTag icon={IconName.Star}>
              {t('snapIsAudited')}
            </SnapDetailTag>
          )}
        </Box>
      </Box>
      <ConfigureSnapPopup
        type={showConfigPopoverType}
        isOpen={showConfigPopover}
        onClose={() => setShowConfigPopover(false)}
        link={website}
      />
    </>
  );
};
