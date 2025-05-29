use starknet::ContractAddress;
use starknet::storage::Map;

#[derive(Drop, Serde, starknet::Store)]
pub struct Habit {
    id: u64,
    name: felt252,
    description: felt252,
    frequency: u8,
    current_streak: u64,
    best_streak: u64,
    last_completed: u64,
    total_completions: u64,
    is_active: bool,
}

#[starknet::interface]
pub trait IHabitTracker<TContractState> {
    fn create_habit(
        ref self: TContractState, 
        name: felt252, 
        description: felt252, 
        frequency: u8
    ) -> u64;
    fn complete_habit(ref self: TContractState, habit_id: u64);
    fn get_habit(self: @TContractState, habit_id: u64) -> Habit;
    fn get_user_habits(self: @TContractState) -> Array<Habit>;
    fn get_user_stats(self: @TContractState) -> (u64, u64);
    fn get_user_game_stats(self: @TContractState) -> (u64, u64, u64);
    fn delete_habit(ref self: TContractState, habit_id: u64);
}

#[starknet::contract]
mod HabitTracker {
    use super::{Habit, IHabitTracker};
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use starknet::get_block_timestamp;
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess, Map};

    #[storage]
    struct Storage {
        habits: Map<(ContractAddress, u64), Habit>,
        user_habit_count: Map<ContractAddress, u64>,
        user_trees: Map<ContractAddress, u64>,
        user_total_completions: Map<ContractAddress, u64>,
        user_level: Map<ContractAddress, u64>,
        user_experience: Map<ContractAddress, u64>,
        user_forest_size: Map<ContractAddress, u64>,
        user_achievements: Map<(ContractAddress, u64), bool>,
        user_special_trees: Map<(ContractAddress, u64), u64>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        HabitCreated: HabitCreated,
        HabitCompleted: HabitCompleted,
        TreeEarned: TreeEarned,
        HabitDeleted: HabitDeleted,
        LevelUp: LevelUp,
        AchievementUnlocked: AchievementUnlocked,
        SpecialTreeEarned: SpecialTreeEarned,
    }

    #[derive(Drop, starknet::Event)]
    struct HabitCreated {
        #[key]
        user: ContractAddress,
        habit_id: u64,
        name: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct HabitCompleted {
        #[key]
        user: ContractAddress,
        habit_id: u64,
        streak: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct TreeEarned {
        #[key]
        user: ContractAddress,
        total_trees: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct HabitDeleted {
        #[key]
        user: ContractAddress,
        habit_id: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct LevelUp {
        #[key]
        user: ContractAddress,
        new_level: u64,
        forest_size: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct AchievementUnlocked {
        #[key]
        user: ContractAddress,
        achievement_id: u64,
        name: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct SpecialTreeEarned {
        #[key]
        user: ContractAddress,
        tree_type: u64,
        count: u64,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {}

    #[abi(embed_v0)]
    impl HabitTrackerImpl of super::IHabitTracker<ContractState> {
        fn create_habit(
            ref self: ContractState, 
            name: felt252, 
            description: felt252, 
            frequency: u8
        ) -> u64 {
            let caller = get_caller_address();
            let habit_count = self.user_habit_count.read(caller);
            let new_habit_id = habit_count + 1;

            let habit = Habit {
                id: new_habit_id,
                name: name,
                description: description,
                frequency: frequency,
                current_streak: 0,
                best_streak: 0,
                last_completed: 0,
                total_completions: 0,
                is_active: true,
            };

            self.habits.write((caller, new_habit_id), habit);
            self.user_habit_count.write(caller, new_habit_id);

            self.emit(HabitCreated { user: caller, habit_id: new_habit_id, name: name });

            new_habit_id
        }

        fn complete_habit(ref self: ContractState, habit_id: u64) {
            let caller = get_caller_address();
            let mut habit = self.habits.read((caller, habit_id));
            
            assert(habit.is_active, 'Habit does not exist');

            let current_timestamp = get_block_timestamp();
            let one_day: u64 = 86400;
            
            if habit.last_completed == 0 {
                habit.current_streak = 1;
            } else {
                let time_diff = current_timestamp - habit.last_completed;
                
                if time_diff <= one_day * 2 {
                    habit.current_streak += 1;
                } else {
                    habit.current_streak = 1;
                }
            }

            if habit.current_streak > habit.best_streak {
                habit.best_streak = habit.current_streak;
            }

            habit.last_completed = current_timestamp;
            habit.total_completions += 1;

            let current_streak = habit.current_streak;
            self.habits.write((caller, habit_id), habit);
            
            let total_completions = self.user_total_completions.read(caller) + 1;
            self.user_total_completions.write(caller, total_completions);

            // 経験値を付与
            let exp_gained = 10 + (current_streak / 7) * 5;
            let current_exp = self.user_experience.read(caller);
            let new_exp = current_exp + exp_gained;
            self.user_experience.write(caller, new_exp);

            // レベルアップチェック
            let current_level = self.user_level.read(caller);
            let required_exp = (current_level + 1) * 100;
            if new_exp >= required_exp {
                let new_level = current_level + 1;
                self.user_level.write(caller, new_level);
                
                // 森のサイズを拡張
                let forest_size = self.user_forest_size.read(caller) + 10;
                self.user_forest_size.write(caller, forest_size);
                
                self.emit(LevelUp { 
                    user: caller, 
                    new_level: new_level, 
                    forest_size: forest_size 
                });
            }

            // 木を獲得
            if current_streak % 7 == 0 {
                let trees = self.user_trees.read(caller) + 1;
                self.user_trees.write(caller, trees);
                self.emit(TreeEarned { user: caller, total_trees: trees });
                
                // 特別な木をチェック
                if current_streak == 30 {
                    let special_trees = self.user_special_trees.read((caller, 1)) + 1;
                    self.user_special_trees.write((caller, 1), special_trees);
                    self.emit(SpecialTreeEarned { 
                        user: caller, 
                        tree_type: 1, 
                        count: special_trees 
                    });
                } else if current_streak == 100 {
                    let special_trees = self.user_special_trees.read((caller, 2)) + 1;
                    self.user_special_trees.write((caller, 2), special_trees);
                    self.emit(SpecialTreeEarned { 
                        user: caller, 
                        tree_type: 2, 
                        count: special_trees 
                    });
                }
            }

            // アチーブメントチェック
            if total_completions == 100 && !self.user_achievements.read((caller, 1)) {
                self.user_achievements.write((caller, 1), true);
                self.emit(AchievementUnlocked { 
                    user: caller, 
                    achievement_id: 1, 
                    name: 'Century' 
                });
            }

            self.emit(HabitCompleted { 
                user: caller, 
                habit_id: habit_id, 
                streak: current_streak 
            });
        }

        fn get_habit(self: @ContractState, habit_id: u64) -> super::Habit {
            let caller = get_caller_address();
            self.habits.read((caller, habit_id))
        }

        fn get_user_habits(self: @ContractState) -> Array<super::Habit> {
            let caller = get_caller_address();
            let habit_count = self.user_habit_count.read(caller);
            let mut habits = ArrayTrait::new();
            
            let mut i: u64 = 1;
            loop {
                if i > habit_count {
                    break;
                }
                let habit = self.habits.read((caller, i));
                if habit.is_active {
                    habits.append(habit);
                }
                i += 1;
            };
            
            habits
        }

        fn get_user_stats(self: @ContractState) -> (u64, u64) {
            let caller = get_caller_address();
            let trees = self.user_trees.read(caller);
            let total_completions = self.user_total_completions.read(caller);
            (trees, total_completions)
        }

        fn get_user_game_stats(self: @ContractState) -> (u64, u64, u64) {
            let caller = get_caller_address();
            let level = self.user_level.read(caller);
            let experience = self.user_experience.read(caller);
            let forest_size = self.user_forest_size.read(caller);
            (level, experience, forest_size)
        }

        fn delete_habit(ref self: ContractState, habit_id: u64) {
            let caller = get_caller_address();
            let mut habit = self.habits.read((caller, habit_id));
            
            assert(habit.is_active, 'Habit does not exist');
            
            habit.is_active = false;
            self.habits.write((caller, habit_id), habit);
            
            self.emit(HabitDeleted { user: caller, habit_id: habit_id });
        }
    }
}