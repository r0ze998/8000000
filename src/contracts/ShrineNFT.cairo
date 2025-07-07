
use starknet::ContractAddress;

#[starknet::interface]
trait IShrineNFT<TContractState> {
    fn mint_nft(
        ref self: TContractState, 
        to: ContractAddress, 
        uri: felt252, 
        nft_type: felt252, 
        rarity: felt252, 
        power: u256
    ) -> u256;
    fn earn_cultural_capital(ref self: TContractState, user: ContractAddress, amount: u256);
    fn get_cultural_capital(self: @TContractState, user: ContractAddress) -> u256;
    fn get_user_nfts(self: @TContractState, user: ContractAddress) -> Array<u256>;
    fn token_uri(self: @TContractState, token_id: u256) -> felt252;
    fn get_nft_type(self: @TContractState, token_id: u256) -> felt252;
    fn get_rarity(self: @TContractState, token_id: u256) -> felt252;
    fn get_power(self: @TContractState, token_id: u256) -> u256;
}

#[starknet::contract]
mod ShrineNFT {
    use starknet::{ContractAddress, get_caller_address};
    use openzeppelin::token::erc721::ERC721Component;
    use openzeppelin::introspection::src5::SRC5Component;
    use openzeppelin::access::ownable::OwnableComponent;

    component!(path: ERC721Component, storage: erc721, event: ERC721Event);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);
    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    #[abi(embed_v0)]
    impl ERC721Impl = ERC721Component::ERC721Impl<ContractState>;
    #[abi(embed_v0)]
    impl SRC5Impl = SRC5Component::SRC5Impl<ContractState>;
    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;

    impl ERC721InternalImpl = ERC721Component::InternalImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        erc721: ERC721Component::Storage,
        #[substorage(v0)]
        src5: SRC5Component::Storage,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        // NFT固有のデータ
        token_uris: LegacyMap<u256, felt252>,
        nft_types: LegacyMap<u256, felt252>,
        rarities: LegacyMap<u256, felt252>,
        powers: LegacyMap<u256, u256>,
        // ユーザーの文化資本
        cultural_capital: LegacyMap<ContractAddress, u256>,
        // ユーザーのNFTリスト
        user_nfts: LegacyMap<ContractAddress, Array<u256>>,
        // 次のトークンID
        next_token_id: u256,
        // Account Abstraction用のセッション管理
        valid_sessions: LegacyMap<ContractAddress, bool>,
        session_expiry: LegacyMap<ContractAddress, u64>,
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
        NFTMinted: NFTMinted,
        CulturalCapitalEarned: CulturalCapitalEarned,
        SessionValidated: SessionValidated,
    }

    #[derive(Drop, starknet::Event)]
    struct NFTMinted {
        to: ContractAddress,
        token_id: u256,
        nft_type: felt252,
        rarity: felt252,
        power: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct CulturalCapitalEarned {
        user: ContractAddress,
        amount: u256,
        total: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct SessionValidated {
        session: ContractAddress,
        expiry: u64,
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        let name = 'ShrineNFT';
        let symbol = 'SHRINE';
        self.erc721.initializer(name, symbol);
        self.ownable.initializer(owner);
        self.next_token_id.write(1);
    }

    #[external(v0)]
    impl ShrineNFTImpl of super::IShrineNFT<ContractState> {
        fn mint_nft(
            ref self: ContractState, 
            to: ContractAddress, 
            uri: felt252, 
            nft_type: felt252, 
            rarity: felt252, 
            power: u256
        ) -> u256 {
            // Account Abstractionセッション検証
            self._validate_session(get_caller_address());
            
            let token_id = self.next_token_id.read();
            self.next_token_id.write(token_id + 1);

            // NFTをミント
            self.erc721._mint(to, token_id);

            // メタデータを保存
            self.token_uris.write(token_id, uri);
            self.nft_types.write(token_id, nft_type);
            self.rarities.write(token_id, rarity);
            self.powers.write(token_id, power);

            // ユーザーのNFTリストに追加
            let mut user_nft_list = self.user_nfts.read(to);
            user_nft_list.append(token_id);
            self.user_nfts.write(to, user_nft_list);

            // イベント発行
            self.emit(NFTMinted { 
                to, 
                token_id, 
                nft_type, 
                rarity, 
                power 
            });

            token_id
        }

        fn earn_cultural_capital(ref self: ContractState, user: ContractAddress, amount: u256) {
            // Account Abstractionセッション検証
            self._validate_session(get_caller_address());
            
            let current = self.cultural_capital.read(user);
            let new_total = current + amount;
            self.cultural_capital.write(user, new_total);

            self.emit(CulturalCapitalEarned { 
                user, 
                amount, 
                total: new_total 
            });
        }

        fn get_cultural_capital(self: @ContractState, user: ContractAddress) -> u256 {
            self.cultural_capital.read(user)
        }

        fn get_user_nfts(self: @ContractState, user: ContractAddress) -> Array<u256> {
            self.user_nfts.read(user)
        }

        fn token_uri(self: @ContractState, token_id: u256) -> felt252 {
            self.token_uris.read(token_id)
        }

        fn get_nft_type(self: @ContractState, token_id: u256) -> felt252 {
            self.nft_types.read(token_id)
        }

        fn get_rarity(self: @ContractState, token_id: u256) -> felt252 {
            self.rarities.read(token_id)
        }

        fn get_power(self: @ContractState, token_id: u256) -> u256 {
            self.powers.read(token_id)
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn _validate_session(self: @ContractState, session: ContractAddress) {
            // セッションの有効性をチェック
            let is_valid = self.valid_sessions.read(session);
            let expiry = self.session_expiry.read(session);
            let current_time = starknet::get_block_timestamp();
            
            assert(is_valid && current_time < expiry, 'Invalid session');
        }

        fn _create_session(ref self: ContractState, session: ContractAddress, duration: u64) {
            let expiry = starknet::get_block_timestamp() + duration;
            self.valid_sessions.write(session, true);
            self.session_expiry.write(session, expiry);
            
            self.emit(SessionValidated { session, expiry });
        }
    }

    // Account Abstraction用のセッション管理
    #[external(v0)]
    fn validate_session(ref self: ContractState, session: ContractAddress, duration: u64) {
        // オーナーまたは認証されたアカウントのみセッション作成可能
        self.ownable.assert_only_owner();
        self._create_session(session, duration);
    }

    #[external(v0)]
    fn is_session_valid(self: @ContractState, session: ContractAddress) -> bool {
        let is_valid = self.valid_sessions.read(session);
        let expiry = self.session_expiry.read(session);
        let current_time = starknet::get_block_timestamp();
        
        is_valid && current_time < expiry
    }
}
