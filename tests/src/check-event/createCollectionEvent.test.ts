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

// https://unique-network.readthedocs.io/en/latest/jsapi.html#setchainlimits
import {ApiPromise} from '@polkadot/api';
import {IKeyringPair} from '@polkadot/types/types';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import privateKey from '../substrate/privateKey';
import usingApi, {submitTransactionAsync} from '../substrate/substrate-api';
import {uniqueEventMessage} from '../util/helpers';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Create collection event ', () => {
  let alice: IKeyringPair;
  const checkSection = 'CollectionCreated';
  const checkTreasury = 'Deposit';
  const checkSystem = 'ExtrinsicSuccess';
  before(async () => {
    await usingApi(async () => {
      alice = privateKey('//Alice');
    });
  });
  it('Check event from createCollection(): ', async () => {
    await usingApi(async (api: ApiPromise) => {
      const tx = api.tx.unique.createCollectionEx({name: [0x31], description: [0x32], tokenPrefix: '0x33', mode: 'NFT'});
      const events = await submitTransactionAsync(alice, tx);
      const msg = JSON.stringify(uniqueEventMessage(events));
      expect(msg).to.be.contain(checkSection);
      expect(msg).to.be.contain(checkTreasury);
      expect(msg).to.be.contain(checkSystem);
    });
  });
});