import { FunctionComponent } from 'react';
import {
  Asset,
  ExtendedAccount as IExtendedAccount,
  Network,
  GasEstimates,
  ExtendedAccount
} from 'v2/types';

export type ISignedTx = string;

export interface ITxObject {
  readonly to: string;
  readonly gasLimit: string;
  readonly gasPrice: string;
  readonly nonce: string;
  readonly data: string;
  readonly value: string;
  readonly chainId: number;
}

export interface ITxConfig {
  readonly gasLimit: string; // Move to BN
  readonly gasPrice: string;
  readonly nonce: string;
  readonly amount: string; // Move to BN
  readonly value: string;
  readonly to: string;
  readonly chainId: number;
  readonly data: string;
  readonly receiverAddress: string; // Can't be an ExtendedAddressBook since recipient may not be registered
  readonly senderAccount: IExtendedAccount;
  readonly asset: Asset;
  readonly network: Network;
}

export interface ITxReceipt {
  [index: string]: any;
}

export interface ITxData {
  readonly hash: string;
  readonly network: Network;
  readonly asset: Asset | undefined;

  readonly amount: string;
  readonly value: string;
  readonly to: string;
  readonly from: string;
  readonly nonce: number;

  readonly gasLimit: string; // Hex
  readonly gasPrice: string; // Hex - wei
  readonly data: string; // Hex
}

export interface IFormikFields {
  asset: Asset;
  receiverAddress: string;
  amount: string;
  account: IExtendedAccount;
  txDataField: string;
  gasEstimates: GasEstimates;
  gasPriceField: string; // Use only if advanced tab is open AND user has input gas price
  gasPriceSlider: string;
  gasLimitField: string;
  nonceField: string; // Use only if user has input a manual nonce value.
  network: Network;
  advancedTransaction: boolean;
  resolvedENSAddress: string; // Address returned when attempting to resolve an ENS/RNS address.
}

export interface ISignComponentProps {
  network: Network;
  senderAccount: ExtendedAccount;
  rawTransaction: ITxObject;
  children?: never;
  onSuccess(receipt: ITxReceipt | ISignedTx): void;
}

export interface IStepComponentProps {
  txConfig: ITxConfig;
  txReceipt?: ITxReceipt;
  signedTx?: ISignedTx;
  children?: never;
  onComplete(data: IFormikFields | ITxReceipt | ISignedTx | null): void;
}

export type TStepAction = (payload: any, after: () => void) => void;

export interface IPath {
  label: string;
  component: FunctionComponent<IStepComponentProps>;
  action: TStepAction;
}
