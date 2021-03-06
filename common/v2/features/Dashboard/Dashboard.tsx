import React, { useContext } from 'react';
import { Heading } from '@mycrypto/ui';
import styled from 'styled-components';

import { ROUTE_PATHS } from 'v2/config';
import { COLORS } from 'v2/theme';
import { useDevMode } from 'v2/services';
import { AccountContext, AddressBookContext } from 'v2/services/Store';
import { translate } from 'translations';
import { AccountList, RouterLink, Typography, BannerAd, Desktop, Mobile } from 'v2/components';
import { ActionTile, TokenPanel, WalletBreakdown, RecentTransactionList } from './components';
import { NotificationsPanel } from '../NotificationsPanel';
import { actions } from './constants';
import './Dashboard.scss';

import settingsIcon from 'common/assets/images/icn-settings.svg';

const AccountListFooterWrapper = styled.div`
  & * {
    color: ${COLORS.BRIGHT_SKY_BLUE};
  }
  & img {
    height: 1.1em;
    margin-right: 0.5em;
  }s
`;

const accountListFooter = () => (
  <AccountListFooterWrapper>
    <RouterLink to={ROUTE_PATHS.SETTINGS.path}>
      <img src={settingsIcon} alt={'settings'} />
      <Typography>{translate('SETTINGS_HEADING')}</Typography>
    </RouterLink>
  </AccountListFooterWrapper>
);
// Keep the same mobile width as an ActionTile
const EmptyTile = styled.div`
  width: 110px;
`;

export default function Dashboard() {
  const { isDevelopmentMode } = useDevMode();
  const { accounts } = useContext(AccountContext);
  const { readAddressBook } = useContext(AddressBookContext);

  return (
    <div>
      {/* Mobile only */}
      <Mobile className="Dashboard-mobile">
        <NotificationsPanel accounts={accounts} />
        <div className="Dashboard-mobile-actions">
          {actions.map(action => (
            <ActionTile key={action.title} {...action} />
          ))}
          {/*In mobile we only have 5 tiles on 2 rows. To allow 'space-between' to handle the gaps, we
          add a sixth tile with the same width.*/}
          <EmptyTile />
        </div>
        <div className="Dashboard-mobile-divider" />
        <div className="Dashboard-mobile-group">
          <div className="Dashboard-mobile-walletBreakdown">
            <WalletBreakdown />
          </div>
          <div className="Dashboard-mobile-section Dashboard-mobile-tokenList">
            <TokenPanel />
          </div>
        </div>
        <div className="Dashboard-mobile-section">
          <AccountList
            currentsOnly={true}
            className="Dashboard-mobile-modifiedPanel"
            footer={accountListFooter()}
            copyable={true}
          />
        </div>
        <BannerAd />
        {isDevelopmentMode && (
          <div className="Dashboard-mobile-section">
            <RecentTransactionList accountsList={accounts} readAddressBook={readAddressBook} />
          </div>
        )}
      </Mobile>
      {/* Desktop only */}
      <Desktop className="Dashboard-desktop">
        <NotificationsPanel accounts={accounts} />
        <div className="Dashboard-desktop-top">
          <div className="Dashboard-desktop-top-left">
            <Heading as="h2" className="Dashboard-desktop-top-left-heading">
              Your Dashboard
            </Heading>
            <div className="Dashboard-desktop-top-left-actions">
              {actions.map(action => (
                <ActionTile key={action.title} {...action} />
              ))}
            </div>
            <div>
              <TokenPanel />
            </div>
          </div>
          <div className="Dashboard-desktop-top-right">
            <div>
              <WalletBreakdown />
            </div>
            <div>
              <AccountList
                currentsOnly={true}
                className="Dashboard-desktop-modifiedPanel"
                footer={accountListFooter()}
                copyable={true}
              />
            </div>
          </div>
        </div>
        <BannerAd />
        {isDevelopmentMode && (
          <div className="Dashboard-desktop-bottom">
            <RecentTransactionList
              readAddressBook={readAddressBook}
              accountsList={accounts}
              className="Dashboard-desktop-modifiedPanel"
            />
          </div>
        )}
      </Desktop>
    </div>
  );
}
