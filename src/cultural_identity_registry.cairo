#[starknet::contract]
mod CulturalIdentityRegistry {
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    use alexandria_storage::list::{List, ListTrait};
    use openzeppelin::token::erc721::{ERC721Component, ERC721HooksEmptyImpl};
    use openzeppelin::token::erc1155::{ERC1155Component, ERC1155HooksEmptyImpl};
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::upgrades::UpgradeableComponent;
    use openzeppelin::introspection::src5::SRC5Component;

    component!(path: ERC721Component, storage: erc721, event: ERC721Event);
    component!(path: ERC1155Component, storage: erc1155, event: ERC1155Event);
    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    component!(path: UpgradeableComponent, storage: upgradeable, event: UpgradeableEvent);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);

    // Cultural Token Types
    #[derive(Drop, Serde, starknet::Store)]
    struct VisitData {
        shrine_id: felt252,
        timestamp: u64,
        latitude: u64,  // * 1e6 for precision
        longitude: u64, // * 1e6 for precision
        weather: u8,    // 0=clear, 1=cloudy, 2=rainy, 3=snowy
        season: u8,     // 0=spring, 1=summer, 2=autumn, 3=winter
        time_of_day: u8, // 0=dawn, 1=morning, 2=afternoon, 3=dusk, 4=night
        moon_phase: u8, // 0=new, 1=waxing, 2=full, 3=waning
        streak_count: u32,
        emotional_state: u8, // 0=peaceful, 1=grateful, 2=hopeful, 3=reflective
        prayer_category: u8, // 0=health, 1=prosperity, 2=relationships, 3=wisdom
    }

    #[derive(Drop, Serde, starknet::Store)]
    struct CulturalValue {
        base_value: u32,        // Base cultural significance (1-100)
        rarity_multiplier: u32, // Rarity based on conditions (100-500)
        story_bonus: u32,       // Story/narrative value (0-200)
        community_impact: u32,  // Community contribution (0-300)
        historical_significance: u32, // Historical context (0-100)
    }

    #[derive(Drop, Serde, starknet::Store)]
    struct SoulBoundRole {
        role_type: u8,     // 0=Kannushi, 1=Densetsu, 2=Community_Leader
        shrine_id: felt252, // Associated shrine (0 for global roles)
        granted_at: u64,   // Timestamp when granted
        responsibilities: u32, // Bitmask of responsibilities
        governance_weight: u32, // Voting power in DAO decisions
    }

    #[derive(Drop, Serde, starknet::Store)]
    struct EventParticipation {
        event_id: felt252,
        event_type: u8,    // 0=matsuri, 1=workshop, 2=pilgrimage, 3=ceremony
        location: felt252, // Event location
        timestamp: u64,
        contribution_level: u8, // 0=attendee, 1=volunteer, 2=organizer
    }

    #[storage]
    struct Storage {
        // ERC721 for NFTs (Omamori & Shinkai)
        #[substorage(v0)]
        erc721: ERC721Component::Storage,
        
        // ERC1155 for POAPs
        #[substorage(v0)]
        erc1155: ERC1155Component::Storage,
        
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        
        #[substorage(v0)]
        upgradeable: UpgradeableComponent::Storage,
        
        #[substorage(v0)]
        src5: SRC5Component::Storage,

        // Cultural Identity Storage
        next_token_id: u256,
        next_poap_id: u256,
        
        // Omamori NFTs (Daily visit records)
        omamori_metadata: LegacyMap<u256, VisitData>,
        omamori_cultural_value: LegacyMap<u256, CulturalValue>,
        
        // Shinkai NFTs (Special achievements)
        shinkai_metadata: LegacyMap<u256, felt252>, // Story/achievement data
        shinkai_achievement_type: LegacyMap<u256, u8>,
        
        // Soul Bound Tokens (Non-transferable roles)
        user_sbt_roles: LegacyMap<ContractAddress, List<SoulBoundRole>>,
        sbt_approval_votes: LegacyMap<(ContractAddress, u8), u32>, // (candidate, role_type) -> votes
        
        // POAP Storage
        poap_metadata: LegacyMap<u256, EventParticipation>,
        user_poaps: LegacyMap<ContractAddress, List<u256>>,
        
        // User Statistics
        user_total_visits: LegacyMap<ContractAddress, u32>,
        user_streak_record: LegacyMap<ContractAddress, u32>,
        user_cultural_score: LegacyMap<ContractAddress, u32>,
        
        // Shrine Management
        shrine_managers: LegacyMap<felt252, List<ContractAddress>>, // Kannushi holders
        shrine_stories: LegacyMap<felt252, List<felt252>>, // Shrine narratives
        
        // Governance
        governance_proposals: LegacyMap<u256, felt252>,
        proposal_votes: LegacyMap<(u256, ContractAddress), bool>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC721Event: ERC721Component::Event,
        #[flat] 
        ERC1155Event: ERC1155Component::Event,
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        #[flat]
        UpgradeableEvent: UpgradeableComponent::Event,
        #[flat]
        SRC5Event: SRC5Component::Event,
        
        OmamoriMinted: OmamoriMinted,
        ShinkaiMinted: ShinkaiMinted,
        SoulBoundRoleGranted: SoulBoundRoleGranted,
        POAPMinted: POAPMinted,
        CulturalValueCalculated: CulturalValueCalculated,
    }

    #[derive(Drop, starknet::Event)]
    struct OmamoriMinted {
        #[key]
        user: ContractAddress,
        #[key]
        token_id: u256,
        shrine_id: felt252,
        cultural_value: u32,
        streak_count: u32,
    }

    #[derive(Drop, starknet::Event)]
    struct ShinkaiMinted {
        #[key]
        user: ContractAddress,
        #[key]
        token_id: u256,
        achievement_type: u8,
        story_hash: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct SoulBoundRoleGranted {
        #[key]
        user: ContractAddress,
        role_type: u8,
        shrine_id: felt252,
        governance_weight: u32,
    }

    #[derive(Drop, starknet::Event)]
    struct POAPMinted {
        #[key]
        user: ContractAddress,
        #[key]
        token_id: u256,
        event_id: felt252,
        event_type: u8,
    }

    #[derive(Drop, starknet::Event)]
    struct CulturalValueCalculated {
        #[key]
        token_id: u256,
        base_value: u32,
        total_value: u32,
        rarity_multiplier: u32,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        owner: ContractAddress
    ) {
        self.erc721.initializer("Cultural Identity Omamori", "OMAMORI");
        self.erc1155.initializer("");
        self.ownable.initializer(owner);
        self.next_token_id.write(1);
        self.next_poap_id.write(1);
    }

    #[abi(embed_v0)]
    impl CulturalIdentityRegistryImpl of ICulturalIdentityRegistry<ContractState> {
        
        /// Mint Omamori NFT for daily visit
        fn mint_omamori_nft(
            ref self: ContractState,
            visit_data: VisitData
        ) -> u256 {
            let caller = get_caller_address();
            let token_id = self.next_token_id.read();
            
            // Verify visit authenticity (location, timing, etc.)
            assert(self._verify_visit_authenticity(visit_data), 'Invalid visit data');
            
            // Calculate cultural value
            let cultural_value = self._calculate_cultural_value(visit_data);
            
            // Mint NFT
            self.erc721._mint(caller, token_id);
            
            // Store metadata
            self.omamori_metadata.write(token_id, visit_data);
            self.omamori_cultural_value.write(token_id, cultural_value);
            
            // Update user statistics
            let current_visits = self.user_total_visits.read(caller);
            self.user_total_visits.write(caller, current_visits + 1);
            
            let current_score = self.user_cultural_score.read(caller);
            self.user_cultural_score.write(caller, current_score + cultural_value.base_value);
            
            // Update streak
            self._update_streak(caller, visit_data.streak_count);
            
            // Emit event
            self.emit(OmamoriMinted {
                user: caller,
                token_id: token_id,
                shrine_id: visit_data.shrine_id,
                cultural_value: cultural_value.base_value,
                streak_count: visit_data.streak_count,
            });
            
            self.emit(CulturalValueCalculated {
                token_id: token_id,
                base_value: cultural_value.base_value,
                total_value: cultural_value.base_value + cultural_value.rarity_multiplier,
                rarity_multiplier: cultural_value.rarity_multiplier,
            });
            
            // Increment token ID
            self.next_token_id.write(token_id + 1);
            
            // Check for special achievements
            self._check_and_mint_shinkai(caller, visit_data);
            
            token_id
        }

        /// Mint special achievement NFT (Shinkai)
        fn mint_shinkai_nft(
            ref self: ContractState,
            achievement_type: u8,
            story_hash: felt252
        ) -> u256 {
            let caller = get_caller_address();
            let token_id = self.next_token_id.read();
            
            // Verify achievement eligibility
            assert(self._verify_achievement_eligibility(caller, achievement_type), 'Not eligible');
            
            // Mint special NFT
            self.erc721._mint(caller, token_id);
            
            // Store metadata
            self.shinkai_metadata.write(token_id, story_hash);
            self.shinkai_achievement_type.write(token_id, achievement_type);
            
            // Emit event
            self.emit(ShinkaiMinted {
                user: caller,
                token_id: token_id,
                achievement_type: achievement_type,
                story_hash: story_hash,
            });
            
            self.next_token_id.write(token_id + 1);
            token_id
        }

        /// Grant Soul Bound Role (Kannushi/Densetsu)
        fn grant_sbt_role(
            ref self: ContractState,
            candidate: ContractAddress,
            role_type: u8, // 0=Kannushi, 1=Densetsu
            shrine_id: felt252
        ) {
            let caller = get_caller_address();
            
            // Verify caller has permission to grant roles
            assert(self._has_granting_permission(caller, role_type, shrine_id), 'No permission');
            
            // Check if candidate meets requirements
            assert(self._meets_sbt_requirements(candidate, role_type), 'Requirements not met');
            
            // Create role
            let role = SoulBoundRole {
                role_type: role_type,
                shrine_id: shrine_id,
                granted_at: get_block_timestamp(),
                responsibilities: self._get_role_responsibilities(role_type),
                governance_weight: self._calculate_governance_weight(candidate, role_type),
            };
            
            // Add to user's roles
            let mut user_roles = self.user_sbt_roles.read(candidate);
            user_roles.append(role);
            self.user_sbt_roles.write(candidate, user_roles);
            
            // Add to shrine managers if Kannushi
            if role_type == 0 {
                let mut managers = self.shrine_managers.read(shrine_id);
                managers.append(candidate);
                self.shrine_managers.write(shrine_id, managers);
            }
            
            // Emit event
            self.emit(SoulBoundRoleGranted {
                user: candidate,
                role_type: role_type,
                shrine_id: shrine_id,
                governance_weight: role.governance_weight,
            });
        }

        /// Mint POAP for event participation
        fn mint_poap(
            ref self: ContractState,
            event_data: EventParticipation
        ) -> u256 {
            let caller = get_caller_address();
            let poap_id = self.next_poap_id.read();
            
            // Verify event participation
            assert(self._verify_event_participation(caller, event_data), 'Invalid participation');
            
            // Mint POAP (ERC1155)
            self.erc1155._mint(caller, poap_id, 1, ArrayTrait::new().span());
            
            // Store metadata
            self.poap_metadata.write(poap_id, event_data);
            
            // Add to user's POAPs
            let mut user_poaps = self.user_poaps.read(caller);
            user_poaps.append(poap_id);
            self.user_poaps.write(caller, user_poaps);
            
            // Emit event
            self.emit(POAPMinted {
                user: caller,
                token_id: poap_id,
                event_id: event_data.event_id,
                event_type: event_data.event_type,
            });
            
            self.next_poap_id.write(poap_id + 1);
            poap_id
        }

        /// Get user's cultural identity summary
        fn get_cultural_identity(
            self: @ContractState,
            user: ContractAddress
        ) -> (u32, u32, u32, u32) { // (total_visits, streak, cultural_score, sbt_count)
            let total_visits = self.user_total_visits.read(user);
            let streak = self.user_streak_record.read(user);
            let cultural_score = self.user_cultural_score.read(user);
            let sbt_roles = self.user_sbt_roles.read(user);
            let sbt_count = sbt_roles.len();
            
            (total_visits, streak, cultural_score, sbt_count)
        }
    }

    #[generate_trait]
    impl InternalFunctions of InternalFunctionsTrait {
        
        /// Calculate cultural value based on visit data
        fn _calculate_cultural_value(
            self: @ContractState,
            visit_data: VisitData
        ) -> CulturalValue {
            let mut base_value: u32 = 50; // Base cultural value
            let mut rarity_multiplier: u32 = 100; // Base multiplier (1.0x)
            
            // Time-based bonuses
            if visit_data.time_of_day == 0 { // Dawn
                base_value += 20;
                rarity_multiplier += 50;
            }
            if visit_data.time_of_day == 3 { // Dusk
                base_value += 15;
                rarity_multiplier += 30;
            }
            
            // Weather bonuses
            if visit_data.weather == 2 { // Rainy
                base_value += 25;
                rarity_multiplier += 100;
            }
            if visit_data.weather == 3 { // Snowy
                base_value += 35;
                rarity_multiplier += 150;
            }
            
            // Moon phase bonuses
            if visit_data.moon_phase == 2 { // Full moon
                base_value += 30;
                rarity_multiplier += 200;
            }
            
            // Streak bonuses
            if visit_data.streak_count > 100 {
                base_value += 50;
                rarity_multiplier += 100;
            } else if visit_data.streak_count > 30 {
                base_value += 25;
                rarity_multiplier += 50;
            } else if visit_data.streak_count > 7 {
                base_value += 10;
                rarity_multiplier += 20;
            }
            
            // Seasonal bonuses
            if visit_data.season == 0 { // Spring
                base_value += 10;
            }
            
            CulturalValue {
                base_value: base_value,
                rarity_multiplier: rarity_multiplier,
                story_bonus: 0, // Set later based on user input
                community_impact: 0, // Calculated separately
                historical_significance: 0, // Based on shrine history
            }
        }
        
        /// Verify visit authenticity
        fn _verify_visit_authenticity(
            self: @ContractState,
            visit_data: VisitData
        ) -> bool {
            // Check timestamp is recent (within 1 hour)
            let current_time = get_block_timestamp();
            if visit_data.timestamp + 3600 < current_time {
                return false;
            }
            
            // Verify location is near shrine (simplified)
            // In production, would check GPS coordinates
            
            // Verify one visit per day per user
            // In production, would check against previous visits
            
            true
        }
        
        /// Check and mint special achievement NFTs
        fn _check_and_mint_shinkai(
            ref self: ContractState,
            user: ContractAddress,
            visit_data: VisitData
        ) {
            let total_visits = self.user_total_visits.read(user);
            
            // First visit achievement
            if total_visits == 1 {
                self._mint_achievement_nft(user, 0); // Genesis achievement
            }
            
            // Milestone achievements
            if total_visits == 100 {
                self._mint_achievement_nft(user, 1); // Century achievement
            }
            
            if total_visits == 365 {
                self._mint_achievement_nft(user, 2); // Year achievement
            }
            
            // Special condition achievements
            if visit_data.weather == 3 && visit_data.moon_phase == 2 {
                self._mint_achievement_nft(user, 3); // Snow moon achievement
            }
        }
        
        /// Internal function to mint achievement NFT
        fn _mint_achievement_nft(
            ref self: ContractState,
            user: ContractAddress,
            achievement_type: u8
        ) {
            let token_id = self.next_token_id.read();
            self.erc721._mint(user, token_id);
            
            self.shinkai_achievement_type.write(token_id, achievement_type);
            self.next_token_id.write(token_id + 1);
            
            self.emit(ShinkaiMinted {
                user: user,
                token_id: token_id,
                achievement_type: achievement_type,
                story_hash: 0, // Generated client-side
            });
        }
        
        /// Update user streak
        fn _update_streak(
            ref self: ContractState,
            user: ContractAddress,
            new_streak: u32
        ) {
            let current_record = self.user_streak_record.read(user);
            if new_streak > current_record {
                self.user_streak_record.write(user, new_streak);
            }
        }
        
        /// Verify achievement eligibility
        fn _verify_achievement_eligibility(
            self: @ContractState,
            user: ContractAddress,
            achievement_type: u8
        ) -> bool {
            // Implementation depends on achievement type
            true
        }
        
        /// Check if user meets SBT requirements
        fn _meets_sbt_requirements(
            self: @ContractState,
            candidate: ContractAddress,
            role_type: u8
        ) -> bool {
            let total_visits = self.user_total_visits.read(candidate);
            let cultural_score = self.user_cultural_score.read(candidate);
            
            if role_type == 0 { // Kannushi
                return total_visits >= 300 && cultural_score >= 10000;
            } else if role_type == 1 { // Densetsu
                return total_visits >= 500 && cultural_score >= 20000;
            }
            
            false
        }
        
        /// Check granting permission
        fn _has_granting_permission(
            self: @ContractState,
            caller: ContractAddress,
            role_type: u8,
            shrine_id: felt252
        ) -> bool {
            // Owner can always grant
            if self.ownable.owner() == caller {
                return true;
            }
            
            // Existing Kannushi can grant Kannushi roles for their shrine
            if role_type == 0 {
                let managers = self.shrine_managers.read(shrine_id);
                // Check if caller is in managers list
                // Simplified - would iterate through list
                return true;
            }
            
            false
        }
        
        /// Get role responsibilities bitmask
        fn _get_role_responsibilities(
            self: @ContractState,
            role_type: u8
        ) -> u32 {
            if role_type == 0 { // Kannushi
                return 0b00001111; // Event planning, community management, etc.
            } else if role_type == 1 { // Densetsu
                return 0b11110000; // Story creation, cultural innovation, etc.
            }
            0
        }
        
        /// Calculate governance weight
        fn _calculate_governance_weight(
            self: @ContractState,
            user: ContractAddress,
            role_type: u8
        ) -> u32 {
            let cultural_score = self.user_cultural_score.read(user);
            let base_weight = if role_type == 0 { 100 } else { 200 }; // Densetsu has more weight
            
            base_weight + (cultural_score / 1000) // Additional weight based on cultural contribution
        }
        
        /// Verify event participation
        fn _verify_event_participation(
            self: @ContractState,
            user: ContractAddress,
            event_data: EventParticipation
        ) -> bool {
            // In production, would verify through oracles or event organizers
            true
        }
    }

    #[abi(embed_v0)]
    impl ERC721Impl = ERC721Component::ERC721Impl<ContractState>;
    
    #[abi(embed_v0)]
    impl ERC1155Impl = ERC1155Component::ERC1155Impl<ContractState>;
    
    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
}

// Interface definition
#[starknet::interface]
trait ICulturalIdentityRegistry<TContractState> {
    fn mint_omamori_nft(ref self: TContractState, visit_data: CulturalIdentityRegistry::VisitData) -> u256;
    fn mint_shinkai_nft(ref self: TContractState, achievement_type: u8, story_hash: felt252) -> u256;
    fn grant_sbt_role(ref self: TContractState, candidate: ContractAddress, role_type: u8, shrine_id: felt252);
    fn mint_poap(ref self: TContractState, event_data: CulturalIdentityRegistry::EventParticipation) -> u256;
    fn get_cultural_identity(self: @TContractState, user: ContractAddress) -> (u32, u32, u32, u32);
}