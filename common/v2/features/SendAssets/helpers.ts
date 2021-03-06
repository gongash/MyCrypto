import BN from 'bn.js';
import { bufferToHex } from 'ethereumjs-util';
import { utils } from 'ethers';

import {
  IFormikFields,
  ITxObject,
  IHexStrTransaction,
  Asset,
  IHexStrWeb3Transaction
} from 'v2/types';

import { getNetworkByChainId } from 'v2/services/Store';
import {
  bigNumGasPriceToViewableGwei,
  bigNumGasLimitToViewable,
  bigNumValueToViewableEther,
  Address,
  toWei,
  TokenValue,
  inputGasPriceToHex,
  inputValueToHex,
  inputNonceToHex,
  inputGasLimitToHex,
  encodeTransfer
} from 'v2/services/EthService';

export function decodeTransaction(signedTx: string) {
  const decodedTransaction = utils.parseTransaction(signedTx);
  const gasLimit = bigNumGasLimitToViewable(decodedTransaction.gasLimit);
  const gasPriceGwei = bigNumGasPriceToViewableGwei(decodedTransaction.gasPrice);
  const amountToSendEther = bigNumValueToViewableEther(decodedTransaction.value);

  return {
    to: decodedTransaction.to,
    from: decodedTransaction.from,
    value: amountToSendEther.toString(),
    gasLimit: gasLimit.toString(),
    gasPrice: gasPriceGwei.toString(),
    nonce: decodedTransaction.nonce,
    data: decodedTransaction.data,
    chainId: decodedTransaction.chainId
  };
}

export async function getNetworkNameFromSignedTx(signedTx: string) {
  const decodedTransaction = utils.parseTransaction(signedTx);
  const chainId = decodedTransaction.chainId.toString();
  const network = await getNetworkByChainId(parseFloat(chainId));

  return network ? network.name : undefined;
}

const createBaseTxObject = (formData: IFormikFields): IHexStrTransaction | ITxObject => {
  const { network } = formData;
  return {
    to: formData.receiverAddress.value,
    value: formData.amount ? inputValueToHex(formData.amount) : '0x0',
    data: formData.txDataField ? formData.txDataField : '0x0',
    gasLimit: formData.gasLimitField,
    gasPrice: formData.advancedTransaction
      ? inputGasPriceToHex(formData.gasPriceField)
      : inputGasPriceToHex(formData.gasPriceSlider),
    nonce: inputNonceToHex(formData.nonceField),
    chainId: network.chainId ? network.chainId : 1
  };
};

const createERC20TxObject = (formData: IFormikFields): IHexStrTransaction => {
  const { asset, network } = formData;
  return {
    to: asset.contractAddress!,
    value: '0x0',
    data: bufferToHex(
      encodeTransfer(
        Address(formData.receiverAddress.value),
        formData.amount !== '' ? toWei(formData.amount, asset.decimal!) : TokenValue(new BN(0))
      )
    ),
    gasLimit: inputGasLimitToHex(formData.gasLimitField),
    gasPrice: formData.advancedTransaction
      ? inputGasPriceToHex(formData.gasPriceField)
      : inputGasPriceToHex(formData.gasPriceSlider),
    nonce: inputNonceToHex(formData.nonceField),
    chainId: network.chainId ? network.chainId : 1
  };
};

export const isERC20Tx = (asset: Asset): boolean => {
  return asset.type === 'erc20' && asset.contractAddress && asset.decimal ? true : false;
};

export const processFormDataToTx = (formData: IFormikFields): IHexStrTransaction | ITxObject => {
  const transform = isERC20Tx(formData.asset) ? createERC20TxObject : createBaseTxObject;
  return transform(formData);
};

export const processFormForEstimateGas = (formData: IFormikFields): IHexStrWeb3Transaction => {
  const transform = isERC20Tx(formData.asset) ? createERC20TxObject : createBaseTxObject;
  // First we use destructuring to remove the `gasLimit` field from the object that is not used by IHexStrWeb3Transaction
  // then we add the extra properties required.
  const { gasLimit, ...tx } = transform(formData);
  return {
    ...tx,
    from: formData.account.address,
    gas: inputGasLimitToHex(formData.gasLimitField)
  };
};
