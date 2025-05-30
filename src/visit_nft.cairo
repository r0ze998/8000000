#[starknet::contract]
mod VisitNFT {
    use openzeppelin::token::erc721::{ERC721Component, ERC721HooksEmptyImpl};
    use openzeppelin::introspection::src5::SRC5Component;
    use openzeppelin::access::ownable::OwnableComponent;
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use starknet::get_block_timestamp;

    component!(path: ERC721Component, storage: erc721, event: ERC721Event);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);
    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    // ERC721 Mixin
    #[abi(embed_v0)]
    impl ERC721MixinImpl = ERC721Component::ERC721MixinImpl<ContractState>;
    impl ERC721InternalImpl = ERC721Component::InternalImpl<ContractState>;

    // Ownable
    #[abi(embed_v0)]
    impl OwnableMixinImpl = OwnableComponent::OwnableMixinImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        erc721: ERC721Component::Storage,
        #[substorage(v0)]
        src5: SRC5Component::Storage,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        token_counter: u256,
        visit_nfts: Map<u256, VisitMetadata>,
        shrine_manager: ContractAddress,
    }

    #[derive(Copy, Drop, Serde, starknet::Store)]
    struct VisitMetadata {
        token_id: u256,
        shrine_id: u256,
        visitor: ContractAddress,
        shrine_name: felt252,
        visit_date: u64,
        verification_method: felt252,
        location: felt252,
        cultural_value: u256,
        rarity: u8, // 1=Common, 2=Rare, 3=Epic, 4=Legendary
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC721Event: ERC721Component::Event,
        #[flat]
        SRC5Event: SRC5Component::Event,
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        VisitNFTMinted: VisitNFTMinted,
        RarityUpgraded: RarityUpgraded,
    }

    #[derive(Drop, starknet::Event)]
    struct VisitNFTMinted {
        #[key]
        token_id: u256,
        #[key]
        to: ContractAddress,
        shrine_id: u256,
        shrine_name: felt252,
        rarity: u8,
    }

    #[derive(Drop, starknet::Event)]
    struct RarityUpgraded {
        #[key]
        token_id: u256,
        old_rarity: u8,
        new_rarity: u8,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        owner: ContractAddress,
        shrine_manager: ContractAddress
    ) {
        let name = "Cultural Shrine Visit NFT";
        let symbol = "CSVNFT";
        
        self.erc721.initializer(name, symbol, "");
        self.ownable.initializer(owner);
        self.shrine_manager.write(shrine_manager);
        self.token_counter.write(0);
    }

    #[abi(embed_v0)]
    impl VisitNFTImpl of IVisitNFT<ContractState> {
        // 参拝NFTミント
        fn mint_visit_nft(
            ref self: ContractState,
            to: ContractAddress,
            shrine_id: u256,
            shrine_name: felt252,
            location: felt252,
            verification_method: felt252
        ) -> u256 {
            // 神社管理コントラクトからのみ呼び出し可能
            let caller = get_caller_address();
            assert(caller == self.shrine_manager.read(), 'Only shrine manager can mint');
            
            let token_id = self.token_counter.read() + 1;
            self.token_counter.write(token_id);
            
            // レアリティ計算（簡易的なランダム性）
            let rarity = self._calculate_rarity(shrine_id, get_block_timestamp());
            
            // 文化価値計算
            let cultural_value = self._calculate_cultural_value(rarity);
            
            let metadata = VisitMetadata {
                token_id: token_id,
                shrine_id: shrine_id,
                visitor: to,
                shrine_name: shrine_name,
                visit_date: get_block_timestamp(),
                verification_method: verification_method,
                location: location,
                cultural_value: cultural_value,
                rarity: rarity,
            };
            
            self.visit_nfts.write(token_id, metadata);
            self.erc721._mint(to, token_id);
            
            self.emit(VisitNFTMinted {
                token_id: token_id,
                to: to,
                shrine_id: shrine_id,
                shrine_name: shrine_name,
                rarity: rarity,
            });
            
            token_id
        }

        // NFTメタデータ取得
        fn get_visit_metadata(self: @ContractState, token_id: u256) -> VisitMetadata {
            self.visit_nfts.read(token_id)
        }

        // ユーザーの総NFT数取得
        fn get_user_nft_count(self: @ContractState, user: ContractAddress) -> u256 {
            self.erc721.balance_of(user)
        }

        // 総発行数取得
        fn get_total_supply(self: @ContractState) -> u256 {
            self.token_counter.read()
        }

        // レアリティ別NFT数取得
        fn get_rarity_count(self: @ContractState, rarity: u8) -> u256 {
            // 実装は簡略化（実際はインデックスが必要）
            let total = self.token_counter.read();
            let mut count = 0;
            let mut i = 1;
            
            loop {
                if i > total {
                    break;
                }
                let metadata = self.visit_nfts.read(i);
                if metadata.rarity == rarity {
                    count += 1;
                }
                i += 1;
            };
            
            count
        }

        // NFTアップグレード（レアリティ向上）
        fn upgrade_nft_rarity(ref self: ContractState, token_id: u256) -> bool {
            let caller = get_caller_address();
            let owner = self.erc721.owner_of(token_id);
            
            assert(caller == owner, 'Not token owner');
            
            let mut metadata = self.visit_nfts.read(token_id);
            assert(metadata.rarity < 4, 'Already max rarity');
            
            let old_rarity = metadata.rarity;
            metadata.rarity += 1;
            metadata.cultural_value = self._calculate_cultural_value(metadata.rarity);
            
            self.visit_nfts.write(token_id, metadata);
            
            self.emit(RarityUpgraded {
                token_id: token_id,
                old_rarity: old_rarity,
                new_rarity: metadata.rarity,
            });
            
            true
        }

        // 神社別NFT数取得
        fn get_shrine_nft_count(self: @ContractState, shrine_id: u256) -> u256 {
            let total = self.token_counter.read();
            let mut count = 0;
            let mut i = 1;
            
            loop {
                if i > total {
                    break;
                }
                let metadata = self.visit_nfts.read(i);
                if metadata.shrine_id == shrine_id {
                    count += 1;
                }
                i += 1;
            };
            
            count
        }

        // コレクション統計取得
        fn get_collection_stats(self: @ContractState, user: ContractAddress) -> (u256, u256, u256, u256) {
            let total_nfts = self.erc721.balance_of(user);
            let mut rare_count = 0;
            let mut epic_count = 0;
            let mut legendary_count = 0;
            
            // ユーザーの全NFTをチェック（実装は簡略化）
            let total_supply = self.token_counter.read();
            let mut i = 1;
            
            loop {
                if i > total_supply {
                    break;
                }
                
                let token_owner = self.erc721.owner_of(i);
                if token_owner == user {
                    let metadata = self.visit_nfts.read(i);
                    if metadata.rarity == 2 {
                        rare_count += 1;
                    } else if metadata.rarity == 3 {
                        epic_count += 1;
                    } else if metadata.rarity == 4 {
                        legendary_count += 1;
                    }
                }
                i += 1;
            };
            
            (total_nfts, rare_count, epic_count, legendary_count)
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        // レアリティ計算（疑似ランダム）
        fn _calculate_rarity(self: @ContractState, shrine_id: u256, timestamp: u64) -> u8 {
            let seed = shrine_id + timestamp.into();
            let random = seed % 100;
            
            if random < 60 {
                1 // Common (60%)
            } else if random < 85 {
                2 // Rare (25%)
            } else if random < 95 {
                3 // Epic (10%)
            } else {
                4 // Legendary (5%)
            }
        }

        // 文化価値計算
        fn _calculate_cultural_value(self: @ContractState, rarity: u8) -> u256 {
            match rarity {
                1 => 10,  // Common
                2 => 25,  // Rare
                3 => 50,  // Epic
                4 => 100, // Legendary
                _ => 10,
            }
        }
    }

    #[starknet::interface]
    trait IVisitNFT<TContractState> {
        fn mint_visit_nft(
            ref self: TContractState,
            to: ContractAddress,
            shrine_id: u256,
            shrine_name: felt252,
            location: felt252,
            verification_method: felt252
        ) -> u256;
        fn get_visit_metadata(self: @TContractState, token_id: u256) -> VisitMetadata;
        fn get_user_nft_count(self: @TContractState, user: ContractAddress) -> u256;
        fn get_total_supply(self: @TContractState) -> u256;
        fn get_rarity_count(self: @TContractState, rarity: u8) -> u256;
        fn upgrade_nft_rarity(ref self: TContractState, token_id: u256) -> bool;
        fn get_shrine_nft_count(self: @TContractState, shrine_id: u256) -> u256;
        fn get_collection_stats(self: @TContractState, user: ContractAddress) -> (u256, u256, u256, u256);
    }
}