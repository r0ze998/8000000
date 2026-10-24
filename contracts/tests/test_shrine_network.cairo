use shrine_network::ShrineNetwork::{Event, Visited};
use shrine_network::{IShrineNetworkDispatcher, IShrineNetworkDispatcherTrait};
use snforge_std::{
    ContractClassTrait, DeclareResultTrait, EventSpyAssertionsTrait, declare, spy_events, start_cheat_block_timestamp_global,
    start_cheat_caller_address, stop_cheat_caller_address,
};
use starknet::ContractAddress;

const DAY: u64 = 86400;

fn deploy() -> IShrineNetworkDispatcher {
    let contract = declare("ShrineNetwork").unwrap().contract_class();
    let (address, _) = contract.deploy(@array![]).unwrap();
    IShrineNetworkDispatcher { contract_address: address }
}

fn alice() -> ContractAddress {
    'alice'.try_into().unwrap()
}
fn bob() -> ContractAddress {
    'bob'.try_into().unwrap()
}

#[test]
fn visit_counts_and_distinct_shrines() {
    let net = deploy();
    start_cheat_block_timestamp_global(DAY * 20000);
    start_cheat_caller_address(net.contract_address, alice());
    net.record_visit('kasuga-taisha');
    net.record_visit('izumo-taisha');
    start_cheat_block_timestamp_global(DAY * 20001);
    net.record_visit('kasuga-taisha');
    stop_cheat_caller_address(net.contract_address);

    let me = net.visitor_stats(alice());
    assert_eq!(me.visits, 3);
    assert_eq!(me.shrines, 2);
    let kasuga = net.shrine_stats('kasuga-taisha');
    assert_eq!(kasuga.visits, 2);
    assert_eq!(kasuga.visitors, 1);
    assert_eq!(net.visits_at(alice(), 'kasuga-taisha'), 2);
    assert!(net.has_visited_today(alice(), 'kasuga-taisha'));
    assert!(!net.has_visited_today(alice(), 'izumo-taisha'));
}

#[test]
#[should_panic(expected: 'already visited today')]
fn one_visit_per_shrine_per_day() {
    let net = deploy();
    start_cheat_block_timestamp_global(DAY * 20000 + 10);
    start_cheat_caller_address(net.contract_address, alice());
    net.record_visit('kasuga-taisha');
    // 同じ日本時間の日（UTC 15:00 = 日本時間 24:00 の手前）
    start_cheat_block_timestamp_global(DAY * 20000 + 50000);
    net.record_visit('kasuga-taisha');
}

#[test]
fn day_boundary_is_japan_midnight() {
    let net = deploy();
    start_cheat_caller_address(net.contract_address, alice());
    // UTC 14:59 → 日本時間 23:59
    start_cheat_block_timestamp_global(DAY * 20000 + 53940);
    net.record_visit('kasuga-taisha');
    // UTC 15:01 → 日本時間 翌日 0:01
    start_cheat_block_timestamp_global(DAY * 20000 + 54060);
    net.record_visit('kasuga-taisha');
    assert_eq!(net.visits_at(alice(), 'kasuga-taisha'), 2);
}

#[test]
fn visitors_are_counted_per_account() {
    let net = deploy();
    start_cheat_block_timestamp_global(DAY * 20000);
    start_cheat_caller_address(net.contract_address, alice());
    net.record_visit('hie-jinja');
    start_cheat_caller_address(net.contract_address, bob());
    net.record_visit('hie-jinja');
    let s = net.shrine_stats('hie-jinja');
    assert_eq!(s.visits, 2);
    assert_eq!(s.visitors, 2);
}

#[test]
fn emits_visited_event() {
    let net = deploy();
    let mut spy = spy_events();
    start_cheat_block_timestamp_global(DAY * 20000);
    start_cheat_caller_address(net.contract_address, alice());
    net.record_visit('ise-naiku');
    spy
        .assert_emitted(
            @array![
                (
                    net.contract_address,
                    Event::Visited(
                        Visited { shrine_id: 'ise-naiku', visitor: alice(), day: 20000, first_time: true, visitor_shrines: 1 },
                    ),
                ),
            ],
        );
}

#[test]
fn register_and_read_shrine() {
    let net = deploy();
    start_cheat_caller_address(net.contract_address, bob());
    net.register_shrine('c-abc', "Sakanoue Hachiman", 125676, 319699);
    let info = net.shrine_info('c-abc');
    assert!(info.registered);
    assert!(info.name == "Sakanoue Hachiman");
    assert_eq!(info.lat_e3, 125676);
    assert_eq!(info.registrant, bob());
}

#[test]
#[should_panic(expected: 'already registered')]
fn cannot_register_twice() {
    let net = deploy();
    net.register_shrine('c-abc', "A", 1, 1);
    net.register_shrine('c-abc', "B", 1, 1);
}

#[test]
#[should_panic(expected: 'bad coordinates')]
fn rejects_bad_coordinates() {
    let net = deploy();
    net.register_shrine('c-abc', "A", 180001, 1);
}

#[test]
#[should_panic(expected: 'visit before reporting')]
fn report_requires_a_visit() {
    let net = deploy();
    start_cheat_caller_address(net.contract_address, alice());
    net.report_condition('kasuga-taisha', 1, "repair");
}

#[test]
fn report_after_visit_updates_stats() {
    let net = deploy();
    start_cheat_block_timestamp_global(DAY * 20000);
    start_cheat_caller_address(net.contract_address, alice());
    net.record_visit('kasuga-taisha');
    net.report_condition('kasuga-taisha', 1, "roof under repair");
    let s = net.shrine_stats('kasuga-taisha');
    assert_eq!(s.reports, 1);
    assert_eq!(s.last_status, 1);
    assert_eq!(s.last_report_day, 20000);
}

#[test]
#[should_panic(expected: 'bad status')]
fn rejects_unknown_status() {
    let net = deploy();
    start_cheat_caller_address(net.contract_address, alice());
    net.record_visit('kasuga-taisha');
    net.report_condition('kasuga-taisha', 4, "");
}
