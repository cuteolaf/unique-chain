// Copyright 2019-2022 Unique Network (Gibraltar) Ltd.
// This file is part of Unique Network.

// Unique Network is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Unique Network is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Unique Network. If not, see <http://www.gnu.org/licenses/>.

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import usingApi, {submitTransactionAsync} from './substrate/substrate-api';
import fs from 'fs';
import {Abi, ContractPromise as Contract} from '@polkadot/api-contract';
import privateKey from './substrate/privateKey';
import {
  deployFlipper,
  getFlipValue,
  deployTransferContract,
} from './util/contracthelpers';

import {
  addToAllowListExpectSuccess,
  approveExpectSuccess,
  createCollectionExpectSuccess,
  createItemExpectSuccess,
  enablePublicMintingExpectSuccess,
  enableAllowListExpectSuccess,
  getGenericResult,
  normalizeAccountId,
  isAllowlisted,
  transferFromExpectSuccess,
  getTokenOwner,
} from './util/helpers';


chai.use(chaiAsPromised);
const expect = chai.expect;

const value = 0;
const gasLimit = 9000n * 1000000n;
const marketContractAddress = '5CYN9j3YvRkqxewoxeSvRbhAym4465C57uMmX5j4yz99L5H6';

describe.skip('Contracts', () => {
  it('Can deploy smart contract Flipper, instantiate it and call it\'s get and flip messages.', async () => {
    await usingApi(async api => {
      const [contract, deployer] = await deployFlipper(api);
      const initialGetResponse = await getFlipValue(contract, deployer);

      const bob = privateKey('//Bob');
      const flip = contract.tx.flip(value, gasLimit);
      await submitTransactionAsync(bob, flip);

      const afterFlipGetResponse = await getFlipValue(contract, deployer);
      expect(afterFlipGetResponse).not.to.be.eq(initialGetResponse, 'Flipping should change value.');
    });
  });

  it('Can initialize contract instance', async () => {
    await usingApi(async (api) => {
      const metadata = JSON.parse(fs.readFileSync('./src/flipper/metadata.json').toString('utf-8'));
      const abi = new Abi(metadata);
      const newContractInstance = new Contract(api, abi, marketContractAddress);
      expect(newContractInstance).to.have.property('address');
      expect(newContractInstance.address.toString()).to.equal(marketContractAddress);
    });
  });
});

describe.skip('Chain extensions', () => {
  it('Transfer CE', async () => {
    await usingApi(async api => {
      const alice = privateKey('//Alice');
      const bob = privateKey('//Bob');

      // Prep work
      const collectionId = await createCollectionExpectSuccess();
      const tokenId = await createItemExpectSuccess(alice, collectionId, 'NFT');
      const [contract] = await deployTransferContract(api);
      const changeAdminTx = api.tx.unique.addCollectionAdmin(collectionId, contract.address);
      await submitTransactionAsync(alice, changeAdminTx);

      expect(await getTokenOwner(api, collectionId, tokenId)).to.be.deep.equal(normalizeAccountId(alice.address));

      // Transfer
      const transferTx = contract.tx.transfer(value, gasLimit, bob.address, collectionId, tokenId, 1);
      const events = await submitTransactionAsync(alice, transferTx);
      const result = getGenericResult(events);
      expect(result.success).to.be.true;

      expect(await getTokenOwner(api, collectionId, tokenId)).to.be.deep.equal(normalizeAccountId(bob.address));
    });
  });

  it('Mint CE', async () => {
    await usingApi(async api => {
      const alice = privateKey('//Alice');
      const bob = privateKey('//Bob');

      const collectionId = await createCollectionExpectSuccess();
      const [contract] = await deployTransferContract(api);
      await enablePublicMintingExpectSuccess(alice, collectionId);
      await enableAllowListExpectSuccess(alice, collectionId);
      await addToAllowListExpectSuccess(alice, collectionId, contract.address);
      await addToAllowListExpectSuccess(alice, collectionId, bob.address);

      const transferTx = contract.tx.createItem(value, gasLimit, bob.address, collectionId, {Nft: {const_data: '0x010203', variable_data: '0x020304'}});
      const events = await submitTransactionAsync(alice, transferTx);
      const result = getGenericResult(events);
      expect(result.success).to.be.true;

      const tokensAfter = (await api.query.unique.nftItemList.entries(collectionId)).map((kv: any) => kv[1].toJSON());
      expect(tokensAfter).to.be.deep.equal([
        {
          owner: bob.address,
          constData: '0x010203',
          variableData: '0x020304',
        },
      ]);
    });
  });

  it('Bulk mint CE', async () => {
    await usingApi(async api => {
      const alice = privateKey('//Alice');
      const bob = privateKey('//Bob');

      const collectionId = await createCollectionExpectSuccess();
      const [contract] = await deployTransferContract(api);
      await enablePublicMintingExpectSuccess(alice, collectionId);
      await enableAllowListExpectSuccess(alice, collectionId);
      await addToAllowListExpectSuccess(alice, collectionId, contract.address);
      await addToAllowListExpectSuccess(alice, collectionId, bob.address);

      const transferTx = contract.tx.createMultipleItems(value, gasLimit, bob.address, collectionId, [
        {Nft: {const_data: '0x010203', variable_data: '0x020304'}},
        {Nft: {const_data: '0x010204', variable_data: '0x020305'}},
        {Nft: {const_data: '0x010205', variable_data: '0x020306'}},
      ]);
      const events = await submitTransactionAsync(alice, transferTx);
      const result = getGenericResult(events);
      expect(result.success).to.be.true;

      const tokensAfter: any = (await api.query.unique.nftItemList.entries(collectionId) as any)
        .map((kv: any) => kv[1].toJSON())
        .sort((a: any, b: any) => a.constData.localeCompare(b.constData));
      expect(tokensAfter).to.be.deep.equal([
        {
          Owner: bob.address,
          ConstData: '0x010203',
          VariableData: '0x020304',
        },
        {
          Owner: bob.address,
          ConstData: '0x010204',
          VariableData: '0x020305',
        },
        {
          Owner: bob.address,
          ConstData: '0x010205',
          VariableData: '0x020306',
        },
      ]);
    });
  });

  it('Approve CE', async () => {
    await usingApi(async api => {
      const alice = privateKey('//Alice');
      const bob = privateKey('//Bob');
      const charlie = privateKey('//Charlie');

      const collectionId = await createCollectionExpectSuccess();
      const [contract] = await deployTransferContract(api);
      const tokenId = await createItemExpectSuccess(alice, collectionId, 'NFT', contract.address.toString());

      const transferTx = contract.tx.approve(value, gasLimit, bob.address, collectionId, tokenId, 1);
      const events = await submitTransactionAsync(alice, transferTx);
      const result = getGenericResult(events);
      expect(result.success).to.be.true;

      await transferFromExpectSuccess(collectionId, tokenId, bob, normalizeAccountId(contract.address.toString()), charlie, 1, 'NFT');
    });
  });

  it('TransferFrom CE', async () => {
    await usingApi(async api => {
      const alice = privateKey('//Alice');
      const bob = privateKey('//Bob');
      const charlie = privateKey('//Charlie');

      const collectionId = await createCollectionExpectSuccess();
      const [contract] = await deployTransferContract(api);
      const tokenId = await createItemExpectSuccess(alice, collectionId, 'NFT', bob.address);
      await approveExpectSuccess(collectionId, tokenId, bob, contract.address.toString(), 1);

      const transferTx = contract.tx.transferFrom(value, gasLimit, bob.address, charlie.address, collectionId, tokenId, 1);
      const events = await submitTransactionAsync(alice, transferTx);
      const result = getGenericResult(events);
      expect(result.success).to.be.true;

      const token: any = (await api.query.unique.nftItemList(collectionId, tokenId) as any).unwrap();
      expect(token.owner.toString()).to.be.equal(charlie.address);
    });
  });

  it('SetVariableMetaData CE', async () => {
    await usingApi(async api => {
      const alice = privateKey('//Alice');

      const collectionId = await createCollectionExpectSuccess();
      const [contract] = await deployTransferContract(api);
      const tokenId = await createItemExpectSuccess(alice, collectionId, 'NFT', contract.address.toString());

      const transferTx = contract.tx.setVariableMetaData(value, gasLimit, collectionId, tokenId, '0x121314');
      const events = await submitTransactionAsync(alice, transferTx);
      const result = getGenericResult(events);
      expect(result.success).to.be.true;

      const token: any = (await api.query.unique.nftItemList(collectionId, tokenId) as any).unwrap();
      expect(token.variableData.toString()).to.be.equal('0x121314');
    });
  });

  it('ToggleAllowList CE', async () => {
    await usingApi(async api => {
      const alice = privateKey('//Alice');
      const bob = privateKey('//Bob');

      const collectionId = await createCollectionExpectSuccess();
      const [contract] = await deployTransferContract(api);
      const changeAdminTx = api.tx.unique.addCollectionAdmin(collectionId, contract.address);
      await submitTransactionAsync(alice, changeAdminTx);

      expect(await isAllowlisted(api, collectionId, bob.address)).to.be.false;

      {
        const transferTx = contract.tx.toggleAllowList(value, gasLimit, collectionId, bob.address, true);
        const events = await submitTransactionAsync(alice, transferTx);
        const result = getGenericResult(events);
        expect(result.success).to.be.true;

        expect(await isAllowlisted(api, collectionId, bob.address)).to.be.true;
      }
      {
        const transferTx = contract.tx.toggleAllowList(value, gasLimit, collectionId, bob.address, false);
        const events = await submitTransactionAsync(alice, transferTx);
        const result = getGenericResult(events);
        expect(result.success).to.be.true;

        expect(await isAllowlisted(api, collectionId, bob.address)).to.be.false;
      }
    });
  });
});