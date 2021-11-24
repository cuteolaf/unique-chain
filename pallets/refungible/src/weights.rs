// Template adopted from https://github.com/paritytech/substrate/blob/master/.maintain/frame-weight-template.hbs

//! Autogenerated weights for pallet_refungible
//!
//! THIS FILE WAS AUTO-GENERATED USING THE SUBSTRATE BENCHMARK CLI VERSION 4.0.0-dev
//! DATE: 2021-10-21, STEPS: `50`, REPEAT: 20, LOW RANGE: `[]`, HIGH RANGE: `[]`
//! EXECUTION: None, WASM-EXECUTION: Compiled, CHAIN: None, DB CACHE: 128

// Executed Command:
// target/release/unique-collator
// benchmark
// --pallet
// pallet-refungible
// --wasm-execution
// compiled
// --extrinsic
// *
// --template
// .maintain/frame-weight-template.hbs
// --steps=50
// --repeat=20
// --output=./pallets/refungible/src/weights.rs


#![cfg_attr(rustfmt, rustfmt_skip)]
#![allow(unused_parens)]
#![allow(unused_imports)]

use frame_support::{traits::Get, weights::{Weight, constants::RocksDbWeight}};
use sp_std::marker::PhantomData;

/// Weight functions needed for pallet_refungible.
pub trait WeightInfo {
	fn create_item() -> Weight;
	fn create_multiple_items(b: u32, ) -> Weight;
	fn burn_item_partial() -> Weight;
	fn burn_item_fully() -> Weight;
	fn transfer_normal() -> Weight;
	fn transfer_creating() -> Weight;
	fn transfer_removing() -> Weight;
	fn transfer_creating_removing() -> Weight;
	fn approve() -> Weight;
	fn transfer_from_normal() -> Weight;
	fn transfer_from_creating() -> Weight;
	fn transfer_from_removing() -> Weight;
	fn transfer_from_creating_removing() -> Weight;
	fn set_variable_metadata(b: u32, ) -> Weight;
}

/// Weights for pallet_refungible using the Substrate node and recommended hardware.
pub struct SubstrateWeight<T>(PhantomData<T>);
impl<T: frame_system::Config> WeightInfo for SubstrateWeight<T> {
	// Storage: Refungible TokensMinted (r:1 w:1)
	// Storage: Refungible AccountBalance (r:1 w:1)
	// Storage: Refungible Balance (r:0 w:1)
	// Storage: Refungible TotalSupply (r:0 w:1)
	// Storage: Refungible TokenData (r:0 w:1)
	// Storage: Refungible Owned (r:0 w:1)
	fn create_item() -> Weight {
		(18_681_000 as Weight)
			.saturating_add(T::DbWeight::get().reads(2 as Weight))
			.saturating_add(T::DbWeight::get().writes(6 as Weight))
	}
	// Storage: Refungible TokensMinted (r:1 w:1)
	// Storage: Refungible AccountBalance (r:1 w:1)
	// Storage: Refungible Balance (r:0 w:4)
	// Storage: Refungible TotalSupply (r:0 w:4)
	// Storage: Refungible TokenData (r:0 w:4)
	// Storage: Refungible Owned (r:0 w:4)
	fn create_multiple_items(b: u32, ) -> Weight {
		(13_869_000 as Weight)
			// Standard Error: 28_000
			.saturating_add((5_611_000 as Weight).saturating_mul(b as Weight))
			.saturating_add(T::DbWeight::get().reads(2 as Weight))
			.saturating_add(T::DbWeight::get().writes(2 as Weight))
			.saturating_add(T::DbWeight::get().writes((4 as Weight).saturating_mul(b as Weight)))
	}
	// Storage: Refungible TotalSupply (r:1 w:1)
	// Storage: Refungible Balance (r:1 w:1)
	// Storage: Refungible AccountBalance (r:1 w:1)
	// Storage: Refungible Owned (r:0 w:1)
	fn burn_item_partial() -> Weight {
		(21_591_000 as Weight)
			.saturating_add(T::DbWeight::get().reads(3 as Weight))
			.saturating_add(T::DbWeight::get().writes(4 as Weight))
	}
	// Storage: Refungible TotalSupply (r:1 w:1)
	// Storage: Refungible Balance (r:1 w:1)
	// Storage: Refungible AccountBalance (r:1 w:1)
	// Storage: Refungible TokensBurnt (r:1 w:1)
	// Storage: Refungible TokenData (r:0 w:1)
	// Storage: Refungible Owned (r:0 w:1)
	fn burn_item_fully() -> Weight {
		(29_257_000 as Weight)
			.saturating_add(T::DbWeight::get().reads(4 as Weight))
			.saturating_add(T::DbWeight::get().writes(6 as Weight))
	}
	// Storage: Refungible Balance (r:2 w:2)
	fn transfer_normal() -> Weight {
		(17_733_000 as Weight)
			.saturating_add(T::DbWeight::get().reads(2 as Weight))
			.saturating_add(T::DbWeight::get().writes(2 as Weight))
	}
	// Storage: Refungible Balance (r:2 w:2)
	// Storage: Refungible AccountBalance (r:1 w:1)
	// Storage: Refungible Owned (r:0 w:1)
	fn transfer_creating() -> Weight {
		(20_943_000 as Weight)
			.saturating_add(T::DbWeight::get().reads(3 as Weight))
			.saturating_add(T::DbWeight::get().writes(4 as Weight))
	}
	// Storage: Refungible Balance (r:2 w:2)
	// Storage: Refungible AccountBalance (r:1 w:1)
	// Storage: Refungible Owned (r:0 w:1)
	fn transfer_removing() -> Weight {
		(22_406_000 as Weight)
			.saturating_add(T::DbWeight::get().reads(3 as Weight))
			.saturating_add(T::DbWeight::get().writes(4 as Weight))
	}
	// Storage: Refungible Balance (r:2 w:2)
	// Storage: Refungible AccountBalance (r:2 w:2)
	// Storage: Refungible Owned (r:0 w:2)
	fn transfer_creating_removing() -> Weight {
		(24_762_000 as Weight)
			.saturating_add(T::DbWeight::get().reads(4 as Weight))
			.saturating_add(T::DbWeight::get().writes(6 as Weight))
	}
	// Storage: Refungible Balance (r:1 w:0)
	// Storage: Refungible Allowance (r:0 w:1)
	fn approve() -> Weight {
		(14_109_000 as Weight)
			.saturating_add(T::DbWeight::get().reads(1 as Weight))
			.saturating_add(T::DbWeight::get().writes(1 as Weight))
	}
	// Storage: Refungible Allowance (r:1 w:1)
	// Storage: Refungible Balance (r:2 w:2)
	fn transfer_from_normal() -> Weight {
		(25_348_000 as Weight)
			.saturating_add(T::DbWeight::get().reads(3 as Weight))
			.saturating_add(T::DbWeight::get().writes(3 as Weight))
	}
	// Storage: Refungible Allowance (r:1 w:1)
	// Storage: Refungible Balance (r:2 w:2)
	// Storage: Refungible AccountBalance (r:1 w:1)
	// Storage: Refungible Owned (r:0 w:1)
	fn transfer_from_creating() -> Weight {
		(28_647_000 as Weight)
			.saturating_add(T::DbWeight::get().reads(4 as Weight))
			.saturating_add(T::DbWeight::get().writes(5 as Weight))
	}
	// Storage: Refungible Allowance (r:1 w:1)
	// Storage: Refungible Balance (r:2 w:2)
	// Storage: Refungible AccountBalance (r:1 w:1)
	// Storage: Refungible Owned (r:0 w:1)
	fn transfer_from_removing() -> Weight {
		(30_472_000 as Weight)
			.saturating_add(T::DbWeight::get().reads(4 as Weight))
			.saturating_add(T::DbWeight::get().writes(5 as Weight))
	}
	// Storage: Refungible Allowance (r:1 w:1)
	// Storage: Refungible Balance (r:2 w:2)
	// Storage: Refungible AccountBalance (r:2 w:2)
	// Storage: Refungible Owned (r:0 w:2)
	fn transfer_from_creating_removing() -> Weight {
		(32_362_000 as Weight)
			.saturating_add(T::DbWeight::get().reads(5 as Weight))
			.saturating_add(T::DbWeight::get().writes(7 as Weight))
	}
	// Storage: Refungible TokenData (r:1 w:1)
	fn set_variable_metadata(_b: u32, ) -> Weight {
		(6_801_000 as Weight)
			.saturating_add(T::DbWeight::get().reads(1 as Weight))
			.saturating_add(T::DbWeight::get().writes(1 as Weight))
	}
}

// For backwards compatibility and tests
impl WeightInfo for () {
	// Storage: Refungible TokensMinted (r:1 w:1)
	// Storage: Refungible AccountBalance (r:1 w:1)
	// Storage: Refungible Balance (r:0 w:1)
	// Storage: Refungible TotalSupply (r:0 w:1)
	// Storage: Refungible TokenData (r:0 w:1)
	// Storage: Refungible Owned (r:0 w:1)
	fn create_item() -> Weight {
		(18_681_000 as Weight)
			.saturating_add(RocksDbWeight::get().reads(2 as Weight))
			.saturating_add(RocksDbWeight::get().writes(6 as Weight))
	}
	// Storage: Refungible TokensMinted (r:1 w:1)
	// Storage: Refungible AccountBalance (r:1 w:1)
	// Storage: Refungible Balance (r:0 w:4)
	// Storage: Refungible TotalSupply (r:0 w:4)
	// Storage: Refungible TokenData (r:0 w:4)
	// Storage: Refungible Owned (r:0 w:4)
	fn create_multiple_items(b: u32, ) -> Weight {
		(13_869_000 as Weight)
			// Standard Error: 28_000
			.saturating_add((5_611_000 as Weight).saturating_mul(b as Weight))
			.saturating_add(RocksDbWeight::get().reads(2 as Weight))
			.saturating_add(RocksDbWeight::get().writes(2 as Weight))
			.saturating_add(RocksDbWeight::get().writes((4 as Weight).saturating_mul(b as Weight)))
	}
	// Storage: Refungible TotalSupply (r:1 w:1)
	// Storage: Refungible Balance (r:1 w:1)
	// Storage: Refungible AccountBalance (r:1 w:1)
	// Storage: Refungible Owned (r:0 w:1)
	fn burn_item_partial() -> Weight {
		(21_591_000 as Weight)
			.saturating_add(RocksDbWeight::get().reads(3 as Weight))
			.saturating_add(RocksDbWeight::get().writes(4 as Weight))
	}
	// Storage: Refungible TotalSupply (r:1 w:1)
	// Storage: Refungible Balance (r:1 w:1)
	// Storage: Refungible AccountBalance (r:1 w:1)
	// Storage: Refungible TokensBurnt (r:1 w:1)
	// Storage: Refungible TokenData (r:0 w:1)
	// Storage: Refungible Owned (r:0 w:1)
	fn burn_item_fully() -> Weight {
		(29_257_000 as Weight)
			.saturating_add(RocksDbWeight::get().reads(4 as Weight))
			.saturating_add(RocksDbWeight::get().writes(6 as Weight))
	}
	// Storage: Refungible Balance (r:2 w:2)
	fn transfer_normal() -> Weight {
		(17_733_000 as Weight)
			.saturating_add(RocksDbWeight::get().reads(2 as Weight))
			.saturating_add(RocksDbWeight::get().writes(2 as Weight))
	}
	// Storage: Refungible Balance (r:2 w:2)
	// Storage: Refungible AccountBalance (r:1 w:1)
	// Storage: Refungible Owned (r:0 w:1)
	fn transfer_creating() -> Weight {
		(20_943_000 as Weight)
			.saturating_add(RocksDbWeight::get().reads(3 as Weight))
			.saturating_add(RocksDbWeight::get().writes(4 as Weight))
	}
	// Storage: Refungible Balance (r:2 w:2)
	// Storage: Refungible AccountBalance (r:1 w:1)
	// Storage: Refungible Owned (r:0 w:1)
	fn transfer_removing() -> Weight {
		(22_406_000 as Weight)
			.saturating_add(RocksDbWeight::get().reads(3 as Weight))
			.saturating_add(RocksDbWeight::get().writes(4 as Weight))
	}
	// Storage: Refungible Balance (r:2 w:2)
	// Storage: Refungible AccountBalance (r:2 w:2)
	// Storage: Refungible Owned (r:0 w:2)
	fn transfer_creating_removing() -> Weight {
		(24_762_000 as Weight)
			.saturating_add(RocksDbWeight::get().reads(4 as Weight))
			.saturating_add(RocksDbWeight::get().writes(6 as Weight))
	}
	// Storage: Refungible Balance (r:1 w:0)
	// Storage: Refungible Allowance (r:0 w:1)
	fn approve() -> Weight {
		(14_109_000 as Weight)
			.saturating_add(RocksDbWeight::get().reads(1 as Weight))
			.saturating_add(RocksDbWeight::get().writes(1 as Weight))
	}
	// Storage: Refungible Allowance (r:1 w:1)
	// Storage: Refungible Balance (r:2 w:2)
	fn transfer_from_normal() -> Weight {
		(25_348_000 as Weight)
			.saturating_add(RocksDbWeight::get().reads(3 as Weight))
			.saturating_add(RocksDbWeight::get().writes(3 as Weight))
	}
	// Storage: Refungible Allowance (r:1 w:1)
	// Storage: Refungible Balance (r:2 w:2)
	// Storage: Refungible AccountBalance (r:1 w:1)
	// Storage: Refungible Owned (r:0 w:1)
	fn transfer_from_creating() -> Weight {
		(28_647_000 as Weight)
			.saturating_add(RocksDbWeight::get().reads(4 as Weight))
			.saturating_add(RocksDbWeight::get().writes(5 as Weight))
	}
	// Storage: Refungible Allowance (r:1 w:1)
	// Storage: Refungible Balance (r:2 w:2)
	// Storage: Refungible AccountBalance (r:1 w:1)
	// Storage: Refungible Owned (r:0 w:1)
	fn transfer_from_removing() -> Weight {
		(30_472_000 as Weight)
			.saturating_add(RocksDbWeight::get().reads(4 as Weight))
			.saturating_add(RocksDbWeight::get().writes(5 as Weight))
	}
	// Storage: Refungible Allowance (r:1 w:1)
	// Storage: Refungible Balance (r:2 w:2)
	// Storage: Refungible AccountBalance (r:2 w:2)
	// Storage: Refungible Owned (r:0 w:2)
	fn transfer_from_creating_removing() -> Weight {
		(32_362_000 as Weight)
			.saturating_add(RocksDbWeight::get().reads(5 as Weight))
			.saturating_add(RocksDbWeight::get().writes(7 as Weight))
	}
	// Storage: Refungible TokenData (r:1 w:1)
	fn set_variable_metadata(_b: u32, ) -> Weight {
		(6_801_000 as Weight)
			.saturating_add(RocksDbWeight::get().reads(1 as Weight))
			.saturating_add(RocksDbWeight::get().writes(1 as Weight))
	}
}
