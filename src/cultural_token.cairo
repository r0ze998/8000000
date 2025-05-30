#[starknet::contract]
mod CulturalToken {
    use openzeppelin::token::erc20::{ERC20Component, ERC20HooksEmptyImpl};
    use openzeppelin::access::ownable::OwnableComponent;
    use starknet::ContractAddress;
    use starknet::get_caller_address;

    component!(path: ERC20Component, storage: erc20, event: ERC20Event);
    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    // ERC20 Mixin
    #[abi(embed_v0)]
    impl ERC20MixinImpl = ERC20Component::ERC20MixinImpl<ContractState>;
    impl ERC20InternalImpl = ERC20Component::InternalImpl<ContractState>;

    // Ownable
    #[abi(embed_v0)]
    impl OwnableMixinImpl = OwnableComponent::OwnableMixinImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        erc20: ERC20Component::Storage,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        shrine_manager: ContractAddress,
        visit_nft: ContractAddress,
        minters: Map<ContractAddress, bool>,
        rewards_pool: u256,
        staking_pools: Map<u256, StakingPool>,
        user_stakes: Map<(ContractAddress, u256), UserStake>,
        pool_counter: u256,
    }

    #[derive(Copy, Drop, Serde, starknet::Store)]
    struct StakingPool {
        id: u256,
        name: felt252,
        total_staked: u256,
        reward_rate: u256, // per block
        last_update_block: u64,
        accumulated_reward_per_token: u256,
        is_active: bool,
    }

    #[derive(Copy, Drop, Serde, starknet::Store)]
    struct UserStake {
        amount: u256,
        reward_per_token_paid: u256,
        pending_rewards: u256,
        last_stake_block: u64,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC20Event: ERC20Component::Event,
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        CulturalRewardMinted: CulturalRewardMinted,
        TokensStaked: TokensStaked,
        TokensUnstaked: TokensUnstaked,
        RewardsClaimed: RewardsClaimed,
        StakingPoolCreated: StakingPoolCreated,
    }

    #[derive(Drop, starknet::Event)]
    struct CulturalRewardMinted {
        #[key]
        to: ContractAddress,
        amount: u256,
        reason: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct TokensStaked {
        #[key]
        user: ContractAddress,
        pool_id: u256,
        amount: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct TokensUnstaked {
        #[key]
        user: ContractAddress,
        pool_id: u256,
        amount: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct RewardsClaimed {
        #[key]
        user: ContractAddress,
        pool_id: u256,
        amount: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct StakingPoolCreated {
        #[key]
        pool_id: u256,
        name: felt252,
        reward_rate: u256,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        owner: ContractAddress,
        shrine_manager: ContractAddress,
        visit_nft: ContractAddress
    ) {
        let name = "Cultural Capital Token";
        let symbol = "CCT";
        let initial_supply: u256 = 1000000 * 1000000000000000000; // 1M tokens with 18 decimals
        
        self.erc20.initializer(name, symbol);
        self.ownable.initializer(owner);
        self.shrine_manager.write(shrine_manager);
        self.visit_nft.write(visit_nft);
        
        // 初期供給をオーナーにミント
        self.erc20._mint(owner, initial_supply);
        
        // 報酬プール設定
        self.rewards_pool.write(initial_supply / 2); // 50%を報酬プールに
        
        // 承認されたミンター設定
        self.minters.write(shrine_manager, true);
        self.minters.write(visit_nft, true);
        
        self.pool_counter.write(0);
    }

    #[abi(embed_v0)]
    impl CulturalTokenImpl of ICulturalToken<ContractState> {
        // 文化活動報酬ミント
        fn mint_cultural_reward(
            ref self: ContractState,
            to: ContractAddress,
            amount: u256,
            reason: felt252
        ) -> bool {
            let caller = get_caller_address();
            assert(self.minters.read(caller), 'Not authorized minter');
            
            // 報酬プールから支払い
            let current_pool = self.rewards_pool.read();
            assert(current_pool >= amount, 'Insufficient reward pool');
            
            self.rewards_pool.write(current_pool - amount);
            self.erc20._mint(to, amount);
            
            self.emit(CulturalRewardMinted {
                to: to,
                amount: amount,
                reason: reason,
            });
            
            true
        }

        // ステーキングプール作成
        fn create_staking_pool(
            ref self: ContractState,
            name: felt252,
            reward_rate: u256
        ) -> u256 {
            self.ownable.assert_only_owner();
            
            let pool_id = self.pool_counter.read() + 1;
            self.pool_counter.write(pool_id);
            
            let pool = StakingPool {
                id: pool_id,
                name: name,
                total_staked: 0,
                reward_rate: reward_rate,
                last_update_block: starknet::get_block_number(),
                accumulated_reward_per_token: 0,
                is_active: true,
            };
            
            self.staking_pools.write(pool_id, pool);
            
            self.emit(StakingPoolCreated {
                pool_id: pool_id,
                name: name,
                reward_rate: reward_rate,
            });
            
            pool_id
        }

        // トークンステーキング
        fn stake_tokens(ref self: ContractState, pool_id: u256, amount: u256) -> bool {
            let caller = get_caller_address();
            let mut pool = self.staking_pools.read(pool_id);
            
            assert(pool.is_active, 'Pool not active');
            assert(amount > 0, 'Amount must be positive');
            
            // ユーザーのトークン残高チェック
            let user_balance = self.erc20.balance_of(caller);
            assert(user_balance >= amount, 'Insufficient balance');
            
            // プール情報更新
            self._update_pool(pool_id);
            pool = self.staking_pools.read(pool_id); // 更新後の値を取得
            
            // ユーザーの既存ステーク取得
            let mut user_stake = self.user_stakes.read((caller, pool_id));
            
            // 保留中の報酬を計算・更新
            if user_stake.amount > 0 {
                let pending = self._calculate_pending_rewards(caller, pool_id);
                user_stake.pending_rewards += pending;
            }
            
            // ステーク更新
            user_stake.amount += amount;
            user_stake.reward_per_token_paid = pool.accumulated_reward_per_token;
            user_stake.last_stake_block = starknet::get_block_number();
            
            self.user_stakes.write((caller, pool_id), user_stake);
            
            // プールの総ステーク更新
            pool.total_staked += amount;
            self.staking_pools.write(pool_id, pool);
            
            // トークン転送
            self.erc20._transfer(caller, starknet::get_contract_address(), amount);
            
            self.emit(TokensStaked {
                user: caller,
                pool_id: pool_id,
                amount: amount,
            });
            
            true
        }

        // トークンアンステーキング
        fn unstake_tokens(ref self: ContractState, pool_id: u256, amount: u256) -> bool {
            let caller = get_caller_address();
            let mut pool = self.staking_pools.read(pool_id);
            let mut user_stake = self.user_stakes.read((caller, pool_id));
            
            assert(user_stake.amount >= amount, 'Insufficient staked amount');
            
            // プール情報更新
            self._update_pool(pool_id);
            pool = self.staking_pools.read(pool_id);
            
            // 保留中の報酬を計算・更新
            let pending = self._calculate_pending_rewards(caller, pool_id);
            user_stake.pending_rewards += pending;
            
            // ステーク更新
            user_stake.amount -= amount;
            user_stake.reward_per_token_paid = pool.accumulated_reward_per_token;
            
            self.user_stakes.write((caller, pool_id), user_stake);
            
            // プールの総ステーク更新
            pool.total_staked -= amount;
            self.staking_pools.write(pool_id, pool);
            
            // トークン返却
            self.erc20._transfer(starknet::get_contract_address(), caller, amount);
            
            self.emit(TokensUnstaked {
                user: caller,
                pool_id: pool_id,
                amount: amount,
            });
            
            true
        }

        // 報酬請求
        fn claim_rewards(ref self: ContractState, pool_id: u256) -> u256 {
            let caller = get_caller_address();
            
            // プール情報更新
            self._update_pool(pool_id);
            
            let mut user_stake = self.user_stakes.read((caller, pool_id));
            let pool = self.staking_pools.read(pool_id);
            
            // 全報酬計算
            let pending = self._calculate_pending_rewards(caller, pool_id);
            let total_rewards = user_stake.pending_rewards + pending;
            
            assert(total_rewards > 0, 'No rewards to claim');
            
            // ユーザーステーク更新
            user_stake.pending_rewards = 0;
            user_stake.reward_per_token_paid = pool.accumulated_reward_per_token;
            self.user_stakes.write((caller, pool_id), user_stake);
            
            // 報酬ミント
            self.erc20._mint(caller, total_rewards);
            
            self.emit(RewardsClaimed {
                user: caller,
                pool_id: pool_id,
                amount: total_rewards,
            });
            
            total_rewards
        }

        // ステーキング情報取得
        fn get_staking_info(self: @ContractState, user: ContractAddress, pool_id: u256) -> (u256, u256, u256) {
            let user_stake = self.user_stakes.read((user, pool_id));
            let pending = self._calculate_pending_rewards(user, pool_id);
            let total_rewards = user_stake.pending_rewards + pending;
            
            (user_stake.amount, total_rewards, user_stake.last_stake_block.into())
        }

        // プール情報取得
        fn get_pool_info(self: @ContractState, pool_id: u256) -> StakingPool {
            self.staking_pools.read(pool_id)
        }

        // 総プール数取得
        fn get_total_pools(self: @ContractState) -> u256 {
            self.pool_counter.read()
        }

        // 報酬プール残高取得
        fn get_rewards_pool_balance(self: @ContractState) -> u256 {
            self.rewards_pool.read()
        }

        // ミンター権限付与
        fn add_minter(ref self: ContractState, minter: ContractAddress) -> bool {
            self.ownable.assert_only_owner();
            self.minters.write(minter, true);
            true
        }

        // ミンター権限削除
        fn remove_minter(ref self: ContractState, minter: ContractAddress) -> bool {
            self.ownable.assert_only_owner();
            self.minters.write(minter, false);
            true
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        // プール情報更新
        fn _update_pool(ref self: ContractState, pool_id: u256) {
            let mut pool = self.staking_pools.read(pool_id);
            let current_block = starknet::get_block_number();
            
            if current_block <= pool.last_update_block || pool.total_staked == 0 {
                return;
            }
            
            let blocks_passed = current_block - pool.last_update_block;
            let rewards = blocks_passed.into() * pool.reward_rate;
            let reward_per_token = rewards * 1000000000000000000 / pool.total_staked; // 18 decimal precision
            
            pool.accumulated_reward_per_token += reward_per_token;
            pool.last_update_block = current_block;
            
            self.staking_pools.write(pool_id, pool);
        }

        // 保留中報酬計算
        fn _calculate_pending_rewards(self: @ContractState, user: ContractAddress, pool_id: u256) -> u256 {
            let user_stake = self.user_stakes.read((user, pool_id));
            let pool = self.staking_pools.read(pool_id);
            
            if user_stake.amount == 0 {
                return 0;
            }
            
            let reward_per_token_diff = pool.accumulated_reward_per_token - user_stake.reward_per_token_paid;
            (user_stake.amount * reward_per_token_diff) / 1000000000000000000
        }
    }

    #[starknet::interface]
    trait ICulturalToken<TContractState> {
        fn mint_cultural_reward(ref self: TContractState, to: ContractAddress, amount: u256, reason: felt252) -> bool;
        fn create_staking_pool(ref self: TContractState, name: felt252, reward_rate: u256) -> u256;
        fn stake_tokens(ref self: TContractState, pool_id: u256, amount: u256) -> bool;
        fn unstake_tokens(ref self: TContractState, pool_id: u256, amount: u256) -> bool;
        fn claim_rewards(ref self: TContractState, pool_id: u256) -> u256;
        fn get_staking_info(self: @TContractState, user: ContractAddress, pool_id: u256) -> (u256, u256, u256);
        fn get_pool_info(self: @TContractState, pool_id: u256) -> StakingPool;
        fn get_total_pools(self: @TContractState) -> u256;
        fn get_rewards_pool_balance(self: @TContractState) -> u256;
        fn add_minter(ref self: TContractState, minter: ContractAddress) -> bool;
        fn remove_minter(ref self: TContractState, minter: ContractAddress) -> bool;
    }
}