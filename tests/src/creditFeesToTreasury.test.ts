//
// This file is subject to the terms and conditions defined in
// file 'LICENSE', which is part of this source code package.
//

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {default as usingApi, submitTransactionAsync, submitTransactionExpectFailAsync} from './substrate/substrate-api';
import {alicesPublicKey, bobsPublicKey} from './accounts';
import privateKey from './substrate/privateKey';
import {IKeyringPair} from '@polkadot/types/types';
import {
  createCollectionExpectSuccess,
  createItemExpectSuccess,
  getGenericResult,
  transferExpectSuccess,
} from './util/helpers';

import {default as waitNewBlocks} from './substrate/wait-new-blocks';
import {ApiPromise} from '@polkadot/api';

chai.use(chaiAsPromised);
const expect = chai.expect;

const TREASURY = '5EYCAe5ijiYfyeZ2JJCGq56LmPyNRAKzpG4QkoQkkQNB5e6Z';
const saneMinimumFee = 0.05;
const saneMaximumFee = 0.5;
const createCollectionDeposit = 100;

let alice: IKeyringPair;
let bob: IKeyringPair;

// Skip the inflation block pauses if the block is close to inflation block
// until the inflation happens
/*eslint no-async-promise-executor: "off"*/
function skipInflationBlock(api: ApiPromise): Promise<void> {
  const promise = new Promise<void>(async (resolve) => {
    const blockInterval = (await api.consts.inflation.inflationBlockInterval).toNumber();
    const unsubscribe = await api.rpc.chain.subscribeNewHeads(head => {
      const currentBlock = head.number.toNumber();
      if (currentBlock % blockInterval < blockInterval - 10) {
        unsubscribe();
        resolve();
      } else {
        console.log(`Skipping inflation block, current block: ${currentBlock}`);
      }
    });
  });

  return promise;
}

describe('integration test: Fees must be credited to Treasury:', () => {
  before(async () => {
    await usingApi(async () => {
      alice = privateKey('//Alice');
      bob = privateKey('//Bob');
    });
  });

  it('Total issuance does not change', async () => {
    await usingApi(async (api) => {
      await skipInflationBlock(api);
      await waitNewBlocks(api, 1);

      const totalBefore = (await api.query.balances.totalIssuance()).toBigInt();

      const alicePrivateKey = privateKey('//Alice');
      const amount = 1n;
      const transfer = api.tx.balances.transfer(bobsPublicKey, amount);

      const result = getGenericResult(await submitTransactionAsync(alicePrivateKey, transfer));

      const totalAfter = (await api.query.balances.totalIssuance()).toBigInt();

      expect(result.success).to.be.true;
      expect(totalAfter).to.be.equal(totalBefore);
    });
  });

  it('Sender balance decreased by fee+sent amount, Treasury balance increased by fee', async () => {
    await usingApi(async (api) => {
      await skipInflationBlock(api);
      await waitNewBlocks(api, 1);

      const alicePrivateKey = privateKey('//Alice');
      const treasuryBalanceBefore: bigint = (await api.query.system.account(TREASURY)).data.free.toBigInt();
      const aliceBalanceBefore: bigint = (await api.query.system.account(alicesPublicKey)).data.free.toBigInt();

      const amount = 1n;
      const transfer = api.tx.balances.transfer(bobsPublicKey, amount);
      const result = getGenericResult(await submitTransactionAsync(alicePrivateKey, transfer));

      const treasuryBalanceAfter: bigint = (await api.query.system.account(TREASURY)).data.free.toBigInt();
      const aliceBalanceAfter: bigint = (await api.query.system.account(alicesPublicKey)).data.free.toBigInt();
      const fee = aliceBalanceBefore - aliceBalanceAfter - amount;
      const treasuryIncrease = treasuryBalanceAfter - treasuryBalanceBefore;

      expect(result.success).to.be.true;
      expect(treasuryIncrease).to.be.equal(fee);
    });
  });

  it('Treasury balance increased by failed tx fee', async () => {
    await usingApi(async (api) => {
      await skipInflationBlock(api);
      await waitNewBlocks(api, 1);

      const bobPrivateKey = privateKey('//Bob');
      const treasuryBalanceBefore = (await api.query.system.account(TREASURY)).data.free.toBigInt();
      const bobBalanceBefore = (await api.query.system.account(bobsPublicKey)).data.free.toBigInt();

      const badTx = api.tx.balances.setBalance(alicesPublicKey, 0, 0);
      await expect(submitTransactionExpectFailAsync(bobPrivateKey, badTx)).to.be.rejected;

      const treasuryBalanceAfter = (await api.query.system.account(TREASURY)).data.free.toBigInt();
      const bobBalanceAfter = (await api.query.system.account(bobsPublicKey)).data.free.toBigInt();
      const fee = bobBalanceBefore - bobBalanceAfter;
      const treasuryIncrease = treasuryBalanceAfter - treasuryBalanceBefore;

      expect(treasuryIncrease).to.be.equal(fee);
    });
  });

  it('NFT Transactions also send fees to Treasury', async () => {
    await usingApi(async (api) => {
      await skipInflationBlock(api);
      await waitNewBlocks(api, 1);

      const treasuryBalanceBefore = (await api.query.system.account(TREASURY)).data.free.toBigInt();
      const aliceBalanceBefore = (await api.query.system.account(alicesPublicKey)).data.free.toBigInt();

      await createCollectionExpectSuccess();

      const treasuryBalanceAfter = (await api.query.system.account(TREASURY)).data.free.toBigInt();
      const aliceBalanceAfter = (await api.query.system.account(alicesPublicKey)).data.free.toBigInt();
      const fee = aliceBalanceBefore - aliceBalanceAfter;
      const treasuryIncrease = treasuryBalanceAfter - treasuryBalanceBefore;

      expect(treasuryIncrease).to.be.equal(fee);
    });
  });

  it('Fees are sane', async () => {
    await usingApi(async (api) => {
      await skipInflationBlock(api);
      await waitNewBlocks(api, 1);

      const aliceBalanceBefore: bigint = (await api.query.system.account(alicesPublicKey)).data.free.toBigInt();

      await createCollectionExpectSuccess();

      const aliceBalanceAfter: bigint = (await api.query.system.account(alicesPublicKey)).data.free.toBigInt();
      const fee = aliceBalanceBefore - aliceBalanceAfter;

      expect(fee / 10n ** 15n < BigInt(Math.ceil(saneMaximumFee + createCollectionDeposit))).to.be.true;
      expect(fee / 10n ** 15n < BigInt(Math.ceil(saneMinimumFee  + createCollectionDeposit))).to.be.true;
    });
  });

  it('NFT Transfer fee is close to 0.1 Unique', async () => {
    await usingApi(async (api) => {
      await skipInflationBlock(api);
      await waitNewBlocks(api, 1);

      const collectionId = await createCollectionExpectSuccess();
      const tokenId = await createItemExpectSuccess(alice, collectionId, 'NFT');

      const aliceBalanceBefore: bigint = (await api.query.system.account(alicesPublicKey)).data.free.toBigInt();
      await transferExpectSuccess(collectionId, tokenId, alice, bob, 1, 'NFT');
      const aliceBalanceAfter: bigint = (await api.query.system.account(alicesPublicKey)).data.free.toBigInt();
      const fee = aliceBalanceBefore - aliceBalanceAfter;

      // console.log(fee.toString());
      const expectedTransferFee = 0.1;
      const toleranceMaxBound = 0.0012;
      const toleranceMinBound = -0.0012;
      let fact = Number(fee) / 1e15 - expectedTransferFee;
      expect(fact).to.be.lessThan(toleranceMaxBound);
      expect(fact).to.be.greaterThan(toleranceMinBound);
    });
  });

});
