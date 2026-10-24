// 8000000 Shrine Network — 神社への参拝と、神社の情報を集める DePIN の記録台帳。
//
// - record_visit:      参拝の記録（同じ神社は 1 アカウント 1 日 1 回まで）
// - register_shrine:   まだ台帳にない神社の登録（名前と、約100m単位に丸めた座標）
// - report_condition:  神社の状況の報告（その神社に参拝したことがあるアカウントだけ）
//
// 記録は公開される。座標は神社の位置だけで、参拝者の位置は記録しない。
// トークンや資金の移動は一切ない。

use starknet::ContractAddress;

/// 座標は (緯度 + 90) * 1000、(経度 + 180) * 1000 の整数で持つ（小数第3位 ≒ 約100m）
#[derive(Drop, Serde, Clone, PartialEq, Debug)]
pub struct ShrineInfo {
    pub registered: bool,
    pub name: ByteArray,
    pub lat_e3: u32,
    pub lng_e3: u32,
    pub registrant: ContractAddress,
}

#[derive(Drop, Serde, Copy, PartialEq, Debug)]
pub struct ShrineStats {
    pub visits: u64,
    pub visitors: u64,
    pub reports: u64,
    pub last_status: u8,
    pub last_report_day: u64,
}

#[derive(Drop, Serde, Copy, PartialEq, Debug)]
pub struct VisitorStats {
    pub visits: u64,
    pub shrines: u64,
}

#[starknet::interface]
pub trait IShrineNetwork<T> {
    fn record_visit(ref self: T, shrine_id: felt252);
    fn register_shrine(ref self: T, shrine_id: felt252, name: ByteArray, lat_e3: u32, lng_e3: u32);
    fn report_condition(ref self: T, shrine_id: felt252, status: u8, note: ByteArray);
    fn shrine_info(self: @T, shrine_id: felt252) -> ShrineInfo;
    fn shrine_stats(self: @T, shrine_id: felt252) -> ShrineStats;
    fn visitor_stats(self: @T, visitor: ContractAddress) -> VisitorStats;
    fn visits_at(self: @T, visitor: ContractAddress, shrine_id: felt252) -> u64;
    fn has_visited_today(self: @T, visitor: ContractAddress, shrine_id: felt252) -> bool;
    fn current_day(self: @T) -> u64;
}

pub const MAX_NAME_BYTES: u32 = 120;
pub const MAX_NOTE_BYTES: u32 = 280;
/// 0: ふだんどおり参拝できる / 1: 工事・修復中 / 2: 立ち入りできない場所がある / 3: 閉鎖・参拝できない
pub const MAX_STATUS: u8 = 3;
const SECONDS_PER_DAY: u64 = 86400;
/// 日付の区切りは日本時間（UTC+9）の0時
const DAY_OFFSET: u64 = 32400;
const MAX_LAT_E3: u32 = 180000;
const MAX_LNG_E3: u32 = 360000;

#[starknet::contract]
pub mod ShrineNetwork {
    use starknet::storage::{Map, StorageMapReadAccess, StorageMapWriteAccess, StoragePathEntry, StoragePointerReadAccess, StoragePointerWriteAccess};
    use starknet::{ContractAddress, get_block_timestamp, get_caller_address};
    use super::{
        DAY_OFFSET, IShrineNetwork, MAX_LAT_E3, MAX_LNG_E3, MAX_NAME_BYTES, MAX_NOTE_BYTES, MAX_STATUS, SECONDS_PER_DAY,
        ShrineInfo, ShrineStats, VisitorStats,
    };

    #[storage]
    struct Storage {
        registered: Map<felt252, bool>,
        names: Map<felt252, ByteArray>,
        lat_e3: Map<felt252, u32>,
        lng_e3: Map<felt252, u32>,
        registrant: Map<felt252, ContractAddress>,
        shrine_visits: Map<felt252, u64>,
        shrine_visitors: Map<felt252, u64>,
        shrine_reports: Map<felt252, u64>,
        last_status: Map<felt252, u8>,
        last_report_day: Map<felt252, u64>,
        visitor_visits: Map<ContractAddress, u64>,
        visitor_shrines: Map<ContractAddress, u64>,
        visits_at: Map<ContractAddress, Map<felt252, u64>>,
        /// 最後に参拝した日 + 1（0 は「まだない」）
        last_visit_day_plus1: Map<ContractAddress, Map<felt252, u64>>,
        registered_count: u64,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        Visited: Visited,
        ShrineRegistered: ShrineRegistered,
        ConditionReported: ConditionReported,
    }

    #[derive(Drop, starknet::Event)]
    pub struct Visited {
        #[key]
        pub shrine_id: felt252,
        #[key]
        pub visitor: ContractAddress,
        pub day: u64,
        pub first_time: bool,
        pub visitor_shrines: u64,
    }

    #[derive(Drop, starknet::Event)]
    pub struct ShrineRegistered {
        #[key]
        pub shrine_id: felt252,
        pub registrant: ContractAddress,
        pub name: ByteArray,
        pub lat_e3: u32,
        pub lng_e3: u32,
    }

    #[derive(Drop, starknet::Event)]
    pub struct ConditionReported {
        #[key]
        pub shrine_id: felt252,
        #[key]
        pub reporter: ContractAddress,
        pub day: u64,
        pub status: u8,
        pub note: ByteArray,
    }

    fn today() -> u64 {
        (get_block_timestamp() + DAY_OFFSET) / SECONDS_PER_DAY
    }

    #[abi(embed_v0)]
    impl ShrineNetworkImpl of IShrineNetwork<ContractState> {
        fn record_visit(ref self: ContractState, shrine_id: felt252) {
            assert(shrine_id != 0, 'shrine id is zero');
            let visitor = get_caller_address();
            let day = today();
            let last = self.last_visit_day_plus1.entry(visitor).entry(shrine_id).read();
            assert(last != day + 1, 'already visited today');

            let count_here = self.visits_at.entry(visitor).entry(shrine_id).read();
            let first_time = count_here == 0;
            self.visits_at.entry(visitor).entry(shrine_id).write(count_here + 1);
            self.last_visit_day_plus1.entry(visitor).entry(shrine_id).write(day + 1);

            self.shrine_visits.write(shrine_id, self.shrine_visits.read(shrine_id) + 1);
            self.visitor_visits.write(visitor, self.visitor_visits.read(visitor) + 1);
            let mut shrines = self.visitor_shrines.read(visitor);
            if first_time {
                self.shrine_visitors.write(shrine_id, self.shrine_visitors.read(shrine_id) + 1);
                shrines += 1;
                self.visitor_shrines.write(visitor, shrines);
            }
            self.emit(Visited { shrine_id, visitor, day, first_time, visitor_shrines: shrines });
        }

        fn register_shrine(ref self: ContractState, shrine_id: felt252, name: ByteArray, lat_e3: u32, lng_e3: u32) {
            assert(shrine_id != 0, 'shrine id is zero');
            assert(!self.registered.read(shrine_id), 'already registered');
            let len = name.len();
            assert(len > 0 && len <= MAX_NAME_BYTES, 'bad name length');
            assert(lat_e3 <= MAX_LAT_E3 && lng_e3 <= MAX_LNG_E3, 'bad coordinates');
            let registrant = get_caller_address();
            self.registered.write(shrine_id, true);
            self.names.write(shrine_id, name.clone());
            self.lat_e3.write(shrine_id, lat_e3);
            self.lng_e3.write(shrine_id, lng_e3);
            self.registrant.write(shrine_id, registrant);
            self.registered_count.write(self.registered_count.read() + 1);
            self.emit(ShrineRegistered { shrine_id, registrant, name, lat_e3, lng_e3 });
        }

        fn report_condition(ref self: ContractState, shrine_id: felt252, status: u8, note: ByteArray) {
            assert(status <= MAX_STATUS, 'bad status');
            assert(note.len() <= MAX_NOTE_BYTES, 'note too long');
            let reporter = get_caller_address();
            assert(self.visits_at.entry(reporter).entry(shrine_id).read() > 0, 'visit before reporting');
            let day = today();
            self.shrine_reports.write(shrine_id, self.shrine_reports.read(shrine_id) + 1);
            self.last_status.write(shrine_id, status);
            self.last_report_day.write(shrine_id, day);
            self.emit(ConditionReported { shrine_id, reporter, day, status, note });
        }

        fn shrine_info(self: @ContractState, shrine_id: felt252) -> ShrineInfo {
            ShrineInfo {
                registered: self.registered.read(shrine_id),
                name: self.names.read(shrine_id),
                lat_e3: self.lat_e3.read(shrine_id),
                lng_e3: self.lng_e3.read(shrine_id),
                registrant: self.registrant.read(shrine_id),
            }
        }

        fn shrine_stats(self: @ContractState, shrine_id: felt252) -> ShrineStats {
            ShrineStats {
                visits: self.shrine_visits.read(shrine_id),
                visitors: self.shrine_visitors.read(shrine_id),
                reports: self.shrine_reports.read(shrine_id),
                last_status: self.last_status.read(shrine_id),
                last_report_day: self.last_report_day.read(shrine_id),
            }
        }

        fn visitor_stats(self: @ContractState, visitor: ContractAddress) -> VisitorStats {
            VisitorStats { visits: self.visitor_visits.read(visitor), shrines: self.visitor_shrines.read(visitor) }
        }

        fn visits_at(self: @ContractState, visitor: ContractAddress, shrine_id: felt252) -> u64 {
            self.visits_at.entry(visitor).entry(shrine_id).read()
        }

        fn has_visited_today(self: @ContractState, visitor: ContractAddress, shrine_id: felt252) -> bool {
            self.last_visit_day_plus1.entry(visitor).entry(shrine_id).read() == today() + 1
        }

        fn current_day(self: @ContractState) -> u64 {
            today()
        }
    }
}
