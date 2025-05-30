#[starknet::contract]
mod ShrineManager {
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use starknet::get_block_timestamp;
    use starknet::storage::{Map, StoragePointer, StoragePathEntry};

    #[storage]
    struct Storage {
        shrines: Map<u256, Shrine>,
        shrine_counter: u256,
        user_shrines: Map<ContractAddress, u256>,
        shrine_visits: Map<u256, u256>,
        user_cultural_capital: Map<ContractAddress, u256>,
        admin: ContractAddress,
    }

    #[derive(Copy, Drop, Serde, starknet::Store)]
    struct Shrine {
        id: u256,
        name: felt252,
        owner: ContractAddress,
        location: felt252,
        level: u8,
        cultural_capital: u256,
        visit_count: u256,
        created_at: u64,
        is_active: bool,
    }

    #[derive(Copy, Drop, Serde, starknet::Store)]
    struct Visit {
        id: u256,
        shrine_id: u256,
        visitor: ContractAddress,
        verification_hash: felt252,
        timestamp: u64,
        cultural_reward: u256,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        ShrineCreated: ShrineCreated,
        VisitRecorded: VisitRecorded,
        CulturalCapitalAwarded: CulturalCapitalAwarded,
        ShrineUpgraded: ShrineUpgraded,
    }

    #[derive(Drop, starknet::Event)]
    struct ShrineCreated {
        #[key]
        shrine_id: u256,
        #[key]
        owner: ContractAddress,
        name: felt252,
        location: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct VisitRecorded {
        #[key]
        visit_id: u256,
        #[key]
        shrine_id: u256,
        #[key]
        visitor: ContractAddress,
        cultural_reward: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct CulturalCapitalAwarded {
        #[key]
        user: ContractAddress,
        amount: u256,
        reason: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct ShrineUpgraded {
        #[key]
        shrine_id: u256,
        new_level: u8,
        cultural_capital_required: u256,
    }

    #[constructor]
    fn constructor(ref self: ContractState, admin: ContractAddress) {
        self.admin.write(admin);
        self.shrine_counter.write(0);
    }

    #[abi(embed_v0)]
    impl ShrineManagerImpl of IShrineManager<ContractState> {
        // 神社作成
        fn create_shrine(
            ref self: ContractState, 
            name: felt252, 
            location: felt252
        ) -> u256 {
            let caller = get_caller_address();
            let current_shrine_id = self.user_shrines.read(caller);
            
            // ユーザーは1つの神社のみ所有可能
            assert(current_shrine_id == 0, 'User already owns a shrine');
            
            let shrine_id = self.shrine_counter.read() + 1;
            self.shrine_counter.write(shrine_id);
            
            let new_shrine = Shrine {
                id: shrine_id,
                name: name,
                owner: caller,
                location: location,
                level: 1,
                cultural_capital: 0,
                visit_count: 0,
                created_at: get_block_timestamp(),
                is_active: true,
            };
            
            self.shrines.write(shrine_id, new_shrine);
            self.user_shrines.write(caller, shrine_id);
            
            // イベント発行
            self.emit(ShrineCreated {
                shrine_id: shrine_id,
                owner: caller,
                name: name,
                location: location,
            });
            
            shrine_id
        }

        // 参拝記録
        fn record_visit(
            ref self: ContractState,
            shrine_id: u256,
            verification_hash: felt252
        ) -> u256 {
            let caller = get_caller_address();
            let shrine = self.shrines.read(shrine_id);
            
            assert(shrine.is_active, 'Shrine is not active');
            assert(shrine.owner != caller, 'Cannot visit own shrine');
            
            // 文化資本報酬計算（神社レベルに基づく）
            let base_reward: u256 = 10;
            let level_bonus: u256 = (shrine.level.into() - 1) * 5;
            let cultural_reward = base_reward + level_bonus;
            
            // 訪問者に文化資本付与
            let current_capital = self.user_cultural_capital.read(caller);
            self.user_cultural_capital.write(caller, current_capital + cultural_reward);
            
            // 神社に文化資本付与（報酬の半分）
            let shrine_reward = cultural_reward / 2;
            let updated_shrine = Shrine {
                id: shrine.id,
                name: shrine.name,
                owner: shrine.owner,
                location: shrine.location,
                level: shrine.level,
                cultural_capital: shrine.cultural_capital + shrine_reward,
                visit_count: shrine.visit_count + 1,
                created_at: shrine.created_at,
                is_active: shrine.is_active,
            };
            
            self.shrines.write(shrine_id, updated_shrine);
            
            // 神社オーナーにも文化資本付与
            let owner_capital = self.user_cultural_capital.read(shrine.owner);
            self.user_cultural_capital.write(shrine.owner, owner_capital + shrine_reward);
            
            // 訪問ID生成（簡易的）
            let visit_id = shrine_id * 1000000 + shrine.visit_count + 1;
            
            // イベント発行
            self.emit(VisitRecorded {
                visit_id: visit_id,
                shrine_id: shrine_id,
                visitor: caller,
                cultural_reward: cultural_reward,
            });
            
            self.emit(CulturalCapitalAwarded {
                user: caller,
                amount: cultural_reward,
                reason: 'shrine_visit',
            });
            
            self.emit(CulturalCapitalAwarded {
                user: shrine.owner,
                amount: shrine_reward,
                reason: 'visit_received',
            });
            
            visit_id
        }

        // 神社アップグレード
        fn upgrade_shrine(ref self: ContractState, shrine_id: u256) -> bool {
            let caller = get_caller_address();
            let shrine = self.shrines.read(shrine_id);
            
            assert(shrine.owner == caller, 'Not shrine owner');
            assert(shrine.level < 10, 'Max level reached');
            
            // アップグレード費用計算
            let upgrade_cost: u256 = (shrine.level.into() * 100).into();
            assert(shrine.cultural_capital >= upgrade_cost, 'Insufficient cultural capital');
            
            // 神社アップグレード
            let upgraded_shrine = Shrine {
                id: shrine.id,
                name: shrine.name,
                owner: shrine.owner,
                location: shrine.location,
                level: shrine.level + 1,
                cultural_capital: shrine.cultural_capital - upgrade_cost,
                visit_count: shrine.visit_count,
                created_at: shrine.created_at,
                is_active: shrine.is_active,
            };
            
            self.shrines.write(shrine_id, upgraded_shrine);
            
            self.emit(ShrineUpgraded {
                shrine_id: shrine_id,
                new_level: shrine.level + 1,
                cultural_capital_required: upgrade_cost,
            });
            
            true
        }

        // 神社情報取得
        fn get_shrine_info(self: @ContractState, shrine_id: u256) -> Shrine {
            self.shrines.read(shrine_id)
        }

        // ユーザーの文化資本取得
        fn get_user_cultural_capital(self: @ContractState, user: ContractAddress) -> u256 {
            self.user_cultural_capital.read(user)
        }

        // ユーザーの神社ID取得
        fn get_user_shrine(self: @ContractState, user: ContractAddress) -> u256 {
            self.user_shrines.read(user)
        }

        // 総神社数取得
        fn get_total_shrines(self: @ContractState) -> u256 {
            self.shrine_counter.read()
        }

        // 文化資本転送
        fn transfer_cultural_capital(
            ref self: ContractState,
            to: ContractAddress,
            amount: u256
        ) -> bool {
            let caller = get_caller_address();
            let sender_balance = self.user_cultural_capital.read(caller);
            
            assert(sender_balance >= amount, 'Insufficient balance');
            
            // 送信者から減算
            self.user_cultural_capital.write(caller, sender_balance - amount);
            
            // 受信者に加算
            let receiver_balance = self.user_cultural_capital.read(to);
            self.user_cultural_capital.write(to, receiver_balance + amount);
            
            true
        }

        // 神社の無効化（管理者のみ）
        fn deactivate_shrine(ref self: ContractState, shrine_id: u256) -> bool {
            let caller = get_caller_address();
            assert(caller == self.admin.read(), 'Only admin can deactivate');
            
            let mut shrine = self.shrines.read(shrine_id);
            shrine.is_active = false;
            self.shrines.write(shrine_id, shrine);
            
            true
        }
    }

    #[starknet::interface]
    trait IShrineManager<TContractState> {
        fn create_shrine(ref self: TContractState, name: felt252, location: felt252) -> u256;
        fn record_visit(ref self: TContractState, shrine_id: u256, verification_hash: felt252) -> u256;
        fn upgrade_shrine(ref self: TContractState, shrine_id: u256) -> bool;
        fn get_shrine_info(self: @TContractState, shrine_id: u256) -> Shrine;
        fn get_user_cultural_capital(self: @TContractState, user: ContractAddress) -> u256;
        fn get_user_shrine(self: @TContractState, user: ContractAddress) -> u256;
        fn get_total_shrines(self: @TContractState) -> u256;
        fn transfer_cultural_capital(ref self: TContractState, to: ContractAddress, amount: u256) -> bool;
        fn deactivate_shrine(ref self: TContractState, shrine_id: u256) -> bool;
    }
}