#[starknet::contract]
mod SimpleShrine {
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use starknet::storage::Map;
    use core::num::traits::Zero;

    #[storage]
    struct Storage {
        // 神社データ
        shrine_counter: u256,
        shrine_owners: Map<u256, ContractAddress>,
        shrine_names: Map<u256, felt252>,
        shrine_visits: Map<u256, u256>,
        
        // ユーザーデータ
        user_shrines: Map<ContractAddress, u256>,
        user_cultural_capital: Map<ContractAddress, u256>,
        
        // 管理者
        admin: ContractAddress,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        ShrineCreated: ShrineCreated,
        VisitRecorded: VisitRecorded,
    }

    #[derive(Drop, starknet::Event)]
    struct ShrineCreated {
        #[key]
        shrine_id: u256,
        #[key]
        owner: ContractAddress,
        name: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct VisitRecorded {
        #[key]
        shrine_id: u256,
        #[key]
        visitor: ContractAddress,
        reward: u256,
    }

    #[constructor]
    fn constructor(ref self: ContractState, admin: ContractAddress) {
        self.admin.write(admin);
        self.shrine_counter.write(0);
    }

    #[abi(embed_v0)]
    impl SimpleShrineImpl of ISimpleShrine<ContractState> {
        // 神社作成
        fn create_shrine(ref self: ContractState, name: felt252) -> u256 {
            let caller = get_caller_address();
            let current_shrine = self.user_shrines.read(caller);
            assert(current_shrine == 0, 'Already has shrine');
            
            let shrine_id = self.shrine_counter.read() + 1;
            self.shrine_counter.write(shrine_id);
            
            self.shrine_owners.write(shrine_id, caller);
            self.shrine_names.write(shrine_id, name);
            self.user_shrines.write(caller, shrine_id);
            
            self.emit(ShrineCreated {
                shrine_id: shrine_id,
                owner: caller,
                name: name,
            });
            
            shrine_id
        }

        // 参拝記録
        fn record_visit(ref self: ContractState, shrine_id: u256) -> u256 {
            let caller = get_caller_address();
            let owner = self.shrine_owners.read(shrine_id);
            assert(owner != caller, 'Cannot visit own shrine');
            assert(!owner.is_zero(), 'Shrine not exists');
            
            // 報酬計算
            let reward: u256 = 10;
            
            // 訪問者に報酬
            let current = self.user_cultural_capital.read(caller);
            self.user_cultural_capital.write(caller, current + reward);
            
            // 神社の訪問数増加
            let visits = self.shrine_visits.read(shrine_id) + 1;
            self.shrine_visits.write(shrine_id, visits);
            
            // オーナーにも報酬
            let owner_current = self.user_cultural_capital.read(owner);
            self.user_cultural_capital.write(owner, owner_current + reward / 2);
            
            self.emit(VisitRecorded {
                shrine_id: shrine_id,
                visitor: caller,
                reward: reward,
            });
            
            visits
        }

        // 神社情報取得
        fn get_shrine_info(self: @ContractState, shrine_id: u256) -> (ContractAddress, felt252, u256) {
            let owner = self.shrine_owners.read(shrine_id);
            let name = self.shrine_names.read(shrine_id);
            let visits = self.shrine_visits.read(shrine_id);
            (owner, name, visits)
        }

        // ユーザー情報取得
        fn get_user_info(self: @ContractState, user: ContractAddress) -> (u256, u256) {
            let shrine_id = self.user_shrines.read(user);
            let cultural_capital = self.user_cultural_capital.read(user);
            (shrine_id, cultural_capital)
        }

        // 総神社数
        fn get_total_shrines(self: @ContractState) -> u256 {
            self.shrine_counter.read()
        }
    }

    #[starknet::interface]
    trait ISimpleShrine<TContractState> {
        fn create_shrine(ref self: TContractState, name: felt252) -> u256;
        fn record_visit(ref self: TContractState, shrine_id: u256) -> u256;
        fn get_shrine_info(self: @TContractState, shrine_id: u256) -> (ContractAddress, felt252, u256);
        fn get_user_info(self: @TContractState, user: ContractAddress) -> (u256, u256);
        fn get_total_shrines(self: @TContractState) -> u256;
    }
}