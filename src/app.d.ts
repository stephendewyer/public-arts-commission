// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { SvelteComponent } from 'svelte';
import type { E164Number } from 'svelte-tel-input/types';
import type { User } from '@auth/core/types';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: {
				id: string;
				email: string;
				role: string;
			} | null | string | JwtPayload;
		}
		// interface PageData {}
		// interface Platform {}
	}

	interface UserCredentials {
		id: string;
		email: string;
		role: string;
	};

	interface LoginCredentials { 
		email: string; 
		password: string;
	};

	interface userID {
		user_ID: number;
	}

	interface CampaignUser {
		date: string;
		email: string;
		password: string;
		reset_token: null | string;
		reset_token_expiration: null | string;
		user_ID: number;
	};

	interface ResponseObj {
        success: string;
        error: string;
        status: number | null;
    };

	interface Success {
        message: string;
        campaign_application_ID: number | null;
    }

	interface ResponseObjWithData {
		success: Success;
		error: string;
        status: number | null;
	}

	interface TimeZone {
		name: string;
		GMT: string;
		city: string;
	};

	interface SessionCongress {
		session: string;
	}

	interface GovernmentLevel {
        name: string;
    };

	interface AccordionTab {
        label: string;
        expandable: boolean;
		slug: string;
        content: AccordionTab[] | null;
    }

	interface Voter {
		ID: number;
		username: string;
		email: string;
		password: string;
	}

	interface tabPanels {
        id: string;
		index: number;
        label: string;
		hasCapitol: boolean;
		panel: typeof SvelteComponent<any>;
		data: any;
    }

	interface GeolocationCoordinates {
		accuracy: number;
		altitude: number;
		altitudeAccuracy: number;
		heading: number | string;
		latitude: string | number;
		longitude: string | number;
		speed: number | string;
	}

	interface GeoLocationPosition {
		coords: GeolocationCoordinates;
		timestamp: number;
	}

	interface summaryReverseGeoLocation {
		queryTime: number;
		numResults: number;
	}

	interface boundingBoxReverseGeoLocation {
		northEast: string;
		southWest: string;
		entity: string;
	}

	interface addressReverseGeoLocation {
		buildingNumber: string;
		streetNumber: string;
		routeNumbers: [];
		street: string;
		streetName: string;
		streetNameAndNumber: string;
		countryCode: string;
		countrySubdivision: string;
		countrySecondarySubdivision: string;
		municipality: string;
		postalCode: string;
		municipalitySubdivision: string;
		country: string;
		countryCodeISO3: string;
		freeformAddress: string;
		boundingBox: boundingBoxReverseGeoLocation;
		extendedPostalCode: string;
		countrySubdivisionName: string;
		countrySubdivisionCode: string;
		localName: string;
	}

	interface addressesReverseGeoLocation {
		address: addressReverseGeoLocation;
		position: string;
		id: string;
	}

	interface ReverseGeoLocation {
		addresses: addressesReverseGeoLocation[];
		summary: summaryReverseGeoLocation;
	}

	interface TeamMember {
        index: number;
        imageSource: string;
        imageAltText: string;
        name: string;
        title: string;
        board_director: boolean;
        staff: boolean;
		bio: string;
		email: string | null;
		urlAddress: string[] | string | null;
    }

	interface State {
		name: string;
		abbreviation: string;
	}

	interface Candidate {
		candidate_ID: number;
		image_ID: number;
		campaign_name: string;
		office_sought_starting_year: number;
		election_date_primary: any;
		election_date_general: any;
		government_level: string;
		state: string;
		county: string;
		city: string;
		party: string;
		website_URL: string;
		running_in_primary: number;
		elected_in_primary: number;
		rejected_in_primary: number;
		running_in_general: number;
		elected_in_general: number;
		rejected_in_general: number;
		campaign_ended: number;
		contact_name_first: string;
		contact_name_last: string;
		contact_phone_number: E164Number | null;
		contact_street_address: string;
		contact_street_address_02: string;
		contact_city: string;
		contact_state: string;
		contact_zip_code: number;
		contact_email: string;
		electorate: string;
	}

	interface CandidateWithImage {
		candidate_ID: number;
		image_ID: number;
		campaign_name: string;
		office_sought_starting_year: number;
		election_date_primary: any;
		election_date_general: any;
		government_level: string;
		state: string;
		county: string;
		city: string;
		party: string;
		website_URL: string;
		running_in_primary: number;
		elected_in_primary: number;
		rejected_in_primary: number;
		running_in_general: number;
		elected_in_general: number;
		rejected_in_general: number;
		campaign_ended: number;
		contact_name_first: string;
		contact_name_last: string;
		contact_phone_number: E164Number | null;
		contact_street_address: string;
		contact_street_address_02: string;
		contact_city: string;
		contact_state: string;
		contact_zip_code: number;
		contact_email: string;
		electorate: string;
		admin_ID: number;
		voter_ID: number;
		campaign_ID: number;
		image_URL: string;
		alt_text: string;
		public_ID: string;
	}

	interface SearchEndorsedCandidateWithImage {
		searchTerms: {
			year: string;
			government_level: string;
			state: string;
			county: string;
			city: string;
			name: string;
		};
		candidate_ID: number;
		image_ID: number;
		campaign_name: string;
		office_sought_starting_year: number;
		election_date_primary: any;
		election_date_general: any;
		government_level: string;
		state: string;
		county: string;
		city: string;
		party: string;
		website_URL: string;
		running_in_primary: number;
		elected_in_primary: number;
		rejected_in_primary: number;
		running_in_general: number;
		elected_in_general: number;
		rejected_in_general: number;
		campaign_ended: number;
		contact_name_first: string;
		contact_name_last: string;
		contact_phone_number: E164Number | null;
		contact_street_address: string;
		contact_street_address_02: string;
		contact_city: string;
		contact_state: string;
		contact_zip_code: number;
		contact_email: string;
		electorate: string;
		admin_ID: number;
		voter_ID: number;
		campaign_ID: number;
		image_URL: string;
		alt_text: string;
		public_ID: string;
	}

	interface CandidateWithImageNominated {
		candidate_ID: number;
		user_ID: number;
		image_ID: number;
		campaign_name: string;
		office_sought_starting_year: number;
		election_date_primary: any;
		election_date_general: any;
		government_level: string;
		state: string;
		county: string;
		city: string;
		party: string;
		website_URL: string;
		electorate: string;
		admin_ID: number;
		voter_ID: number;
		campaign_ID: number;
		image_URL: string;
		alt_text: string;
		public_ID: string;
		date_nominated: Date;
		status: string;
		email: string;
		name_first: string;
		name_last: string;
	}

	interface Legislation {
		legislation_ID: number;
		image_ID: number;
		legislation_name: string;
		year_released: number;
		year_introduced_House: number;
		year_introduced_Senate: number;
		government_level: string;
		state: string;
		county: string;
		city: string;
		website_URL: string;
		details: string;
		session_House: string;
		session_Senate: string;
		passed_in_House: number;
		passed_in_Senate: number;
		rejected_in_House: number;
		rejected_in_Senate: number;
		vetoed_by_Executive: number;
		signed_by_Executive: number;
		contact_name_first: string;
		contact_name_last: string;
		contact_phone_number: E164Number | null;
		contact_street_address: string;
		contact_street_address_02: string;
		contact_city: string;
		contact_state: string;
		contact_zip_code: number;
		contact_email: string;
	}

	interface LegislationWithImage {
		legislation_ID: number;
		image_ID: number;
		legislation_name: string;
		year_released: number;
		year_introduced_House: number;
		year_introduced_Senate: number;
		government_level: string;
		state: string;
		county: string;
		city: string;
		website_URL: string;
		details: string;
		session_House: string;
		session_Senate: string;
		passed_in_House: number;
		passed_in_Senate: number;
		rejected_in_House: number;
		rejected_in_Senate: number;
		vetoed_by_Executive: number;
		signed_by_Executive: number;
		contact_name_first: string;
		contact_name_last: string;
		contact_phone_number: E164Number | null;
		contact_street_address: string;
		contact_street_address_02: string;
		contact_city: string;
		contact_state: string;
		contact_zip_code: number;
		contact_email: string;
		admin_ID: number;
		voter_ID: number;
		campaign_ID: number;
		image_URL: string;
		alt_text: string;
		public_ID: string;
	}

	interface LegislationWithSponsorsAndImage {
		legislation_ID: number;
		image_ID: number;
		legislation_name: string;
		year_released: number;
		year_introduced_House: number;
		year_introduced_Senate: number;
		government_level: string;
		state: string;
		county: string;
		city: string;
		website_URL: string;
		details: string;
		session_House: string;
		session_Senate: string;
		passed_in_House: number;
		passed_in_Senate: number;
		rejected_in_House: number;
		rejected_in_Senate: number;
		vetoed_by_Executive: number;
		signed_by_Executive: number;
		contact_name_first: string;
		contact_name_last: string;
		contact_phone_number: E164Number | null;
		contact_street_address: string;
		contact_street_address_02: string;
		contact_city: string;
		contact_state: string;
		contact_zip_code: number;
		contact_email: string;
		admin_ID: number;
		voter_ID: number;
		campaign_ID: number;
		image_URL: string;
		alt_text: string;
		sponsors_House: SponsorHouse[];
		sponsors_Senate: SponsorsSenate[];
		co_sponsors_House: CoSponsorHouse[];
		co_sponsors_Senate: CoSponsorsSenate[];
		public_ID: string;
	}

	interface SearchLegislationWithSponsorsAndImage {
		searchTerms: {
			year: string;
			government_level: string;
			state: string;
			county: string;
			city: string;
			name: string;
		};
		legislation_ID: number;
		image_ID: number;
		legislation_name: string;
		year_released: number;
		year_introduced_House: number;
		year_introduced_Senate: number;
		government_level: string;
		state: string;
		county: string;
		city: string;
		website_URL: string;
		details: string;
		session_House: string;
		session_Senate: string;
		passed_in_House: number;
		passed_in_Senate: number;
		rejected_in_House: number;
		rejected_in_Senate: number;
		vetoed_by_Executive: number;
		signed_by_Executive: number;
		contact_name_first: string;
		contact_name_last: string;
		contact_phone_number: E164Number | null;
		contact_street_address: string;
		contact_street_address_02: string;
		contact_city: string;
		contact_state: string;
		contact_zip_code: number;
		contact_email: string;
		admin_ID: number;
		voter_ID: number;
		campaign_ID: number;
		image_URL: string;
		alt_text: string;
		sponsors_House: SponsorHouse[];
		sponsors_Senate: SponsorsSenate[];
		co_sponsors_House: CoSponsorHouse[];
		co_sponsors_Senate: CoSponsorsSenate[];
		public_ID: string;
	}

	interface LegislationWithSponsorsAndImageNominated {
		legislation_ID: number;
		image_ID: number;
		legislation_name: string;
		year_released: number;
		year_introduced_House: number;
		year_introduced_Senate: number;
		government_level: string;
		state: string;
		county: string;
		city: string;
		website_URL: string;
		details: string;
		session_House: string;
		session_Senate: string;
		admin_ID: number;
		voter_ID: number;
		campaign_ID: number;
		image_URL: string;
		alt_text: string;
		sponsors_House: SponsorHouse[];
		sponsors_Senate: SponsorsSenate[];
		co_sponsors_House: CoSponsorHouse[];
		co_sponsors_Senate: CoSponsorsSenate[];
		public_ID: string;
		date_nominated: Date;
		status: string;
		email: string;
		name_first: string;
		name_last: string;
	}

	interface Amendment {
		amendment_ID: number;
		image_ID: number;
		amendment_name: string;
		year_released: number;
		year_introduced_House: number;
		year_introduced_Senate: number;
		election_date: number;
		government_level: string;
		state: string;
		county: string;
		city: string;
		website_URL: string;
		details: string;
		introduced_in_House: number;
		introduced_in_Senate: number;
		session_House: string;
		session_Senate: string;
		twothirds_House_and_Senate_passed: number;
		simple_majority_House_and_Senate_passed: number;
		simple_majority_voters_passed: number;
		ratified_by_state_convenctions: number;
		ratified_by_state_legislatures: number;
		contact_name_first: string;
		contact_name_last: string;
		contact_phone_number: E164Number | null;
		contact_street_address: string;
		contact_street_address_02: string;
		contact_city: string;
		contact_state: string;
		contact_zip_code: number;
		contact_email: string;
	}

	interface AmendmentWithImage {
		amendment_ID: number;
		image_ID: number;
		amendment_name: string;
		year_released: number;
		year_introduced_House: number;
		year_introduced_Senate: number;
		election_date: number;
		government_level: string;
		state: string;
		county: string;
		city: string;
		website_URL: string;
		details: string;
		introduced_in_House: number;
		introduced_in_Senate: number;
		session_House: string;
		session_Senate: string;
		twothirds_House_and_Senate_passed: number;
		simple_majority_House_and_Senate_passed: number;
		simple_majority_voters_passed: number;
		ratified_by_state_convenctions: number;
		ratified_by_state_legislatures: number;
		contact_name_first: string;
		contact_name_last: string;
		contact_phone_number: E164Number | null;
		contact_street_address: string;
		contact_street_address_02: string;
		contact_city: string;
		contact_state: string;
		contact_zip_code: number;
		contact_email: string;
		admin_ID: number;
		voter_ID: number;
		campaign_ID: number;
		image_URL: string;
		alt_text: string;
		public_ID: string;
	}

	interface AmendmentWithSponsorsAndImage {
		amendment_ID: number;
		image_ID: number;
		amendment_name: string;
		year_released: number;
		year_introduced_House: number;
		year_introduced_Senate: number;
		election_date: number;
		government_level: string;
		state: string;
		county: string;
		city: string;
		website_URL: string;
		details: string;
		introduced_in_House: number;
		introduced_in_Senate: number;
		session_House: string;
		session_Senate: string;
		twothirds_House_and_Senate_passed: number;
		simple_majority_House_and_Senate_passed: number;
		simple_majority_voters_passed: number;
		ratified_by_state_convenctions: number;
		ratified_by_state_legislatures: number;
		contact_name_first: string;
		contact_name_last: string;
		contact_phone_number: E164Number | null;
		contact_street_address: string;
		contact_street_address_02: string;
		contact_city: string;
		contact_state: string;
		contact_zip_code: number;
		contact_email: string;
		admin_ID: number;
		voter_ID: number;
		campaign_ID: number;
		image_URL: string;
		alt_text: string;
		public_ID: string;
		sponsors_House: SponsorHouse[];
		sponsors_Senate: SponsorsSenate[];
		co_sponsors_House: CoSponsorHouse[];
		co_sponsors_Senate: CoSponsorsSenate[];
	}

	interface SearchAmendmentWithSponsorsAndImage {
		searchTerms: {
			year_election: string;
			year_released: string;
			government_level: string;
			state: string;
			county: string;
			city: string;
			name: string;
		};
		amendment_ID: number;
		image_ID: number;
		amendment_name: string;
		year_released: number;
		year_introduced_House: number;
		year_introduced_Senate: number;
		election_date: number;
		government_level: string;
		state: string;
		county: string;
		city: string;
		website_URL: string;
		details: string;
		introduced_in_House: number;
		introduced_in_Senate: number;
		session_House: string;
		session_Senate: string;
		twothirds_House_and_Senate_passed: number;
		simple_majority_House_and_Senate_passed: number;
		simple_majority_voters_passed: number;
		ratified_by_state_convenctions: number;
		ratified_by_state_legislatures: number;
		contact_name_first: string;
		contact_name_last: string;
		contact_phone_number: E164Number | null;
		contact_street_address: string;
		contact_street_address_02: string;
		contact_city: string;
		contact_state: string;
		contact_zip_code: number;
		contact_email: string;
		admin_ID: number;
		voter_ID: number;
		campaign_ID: number;
		image_URL: string;
		alt_text: string;
		public_ID: string;
		sponsors_House: SponsorHouse[];
		sponsors_Senate: SponsorsSenate[];
		co_sponsors_House: CoSponsorHouse[];
		co_sponsors_Senate: CoSponsorsSenate[];
	}

	interface AmendmentWithSponsorsAndImageNominated {
		amendment_ID: number;
		image_ID: number;
		amendment_name: string;
		year_released: number;
		year_introduced_House: number;
		year_introduced_Senate: number;
		election_date: number;
		government_level: string;
		state: string;
		county: string;
		city: string;
		website_URL: string;
		details: string;
		introduced_in_House: number;
		introduced_in_Senate: number;
		session_House: string;
		session_Senate: string;
		admin_ID: number;
		voter_ID: number;
		campaign_ID: number;
		image_URL: string;
		alt_text: string;
		public_ID: string;
		sponsors_House: SponsorHouse[];
		sponsors_Senate: SponsorsSenate[];
		co_sponsors_House: CoSponsorHouse[];
		co_sponsors_Senate: CoSponsorsSenate[];
		date_nominated: Date;
		status: string;
		email: string;
		name_first: string;
		name_last: string;
	}

	interface Action {
		action_ID: number;
		image_ID: number;
		action_name: string;
		all_day_event: boolean,
		all_day_event_date: Date,
		date_start: any;
		date_end: any;
		time_start: Date;
		time_end: Date;
		time_zone: string;
		action_street_address: string;
		action_street_address_02: string;
		action_city: string;
		action_state: string;
		action_zip_code: number;
		government_level: string;
		website_URL: string;
		details: string;
		contact_name_first: string;
		contact_name_last: string;
		contact_phone_number: E164Number | null;
		contact_street_address: string;
		contact_street_address_02: string;
		contact_city: string;
		contact_state: string;
		contact_zip_code: number;
		contact_email: string;
	}

	interface SearchActionWithImage {
		searchTerms: {
            year: {
                all_day_event_date: string;
                date_start: string;
                date_end: string;
            };
            action_name: string;
            zipcode: string;
			state: string;
			city: string;
            government_level: string;
		};
		action_ID: number;
		image_ID: number;
		action_name: string;
		all_day_event: boolean,
		all_day_event_date: Date,
		date_start: any;
		date_end: any;
		time_start: Date;
		time_end: Date;
		time_zone: string;
		action_street_address: string;
		action_street_address_02: string;
		action_city: string;
		action_state: string;
		action_zip_code: number;
		government_level: string;
		website_URL: string;
		details: string;
		contact_name_first: string;
		contact_name_last: string;
		contact_phone_number: E164Number | null;
		contact_street_address: string;
		contact_street_address_02: string;
		contact_city: string;
		contact_state: string;
		contact_zip_code: number;
		contact_email: string;
		admin_ID: number;
		voter_ID: number;
		campaign_ID: number;
		image_URL: string;
		alt_text: string;
		public_ID: string;
	}

	interface ActionWithImage {
		action_ID: number;
		image_ID: number;
		action_name: string;
		all_day_event: boolean,
		all_day_event_date: Date,
		date_start: any;
		date_end: any;
		time_start: Date;
		time_end: Date;
		time_zone: string;
		action_street_address: string;
		action_street_address_02: string;
		action_city: string;
		action_state: string;
		action_zip_code: number;
		government_level: string;
		website_URL: string;
		details: string;
		contact_name_first: string;
		contact_name_last: string;
		contact_phone_number: E164Number | null;
		contact_street_address: string;
		contact_street_address_02: string;
		contact_city: string;
		contact_state: string;
		contact_zip_code: number;
		contact_email: string;
		admin_ID: number;
		voter_ID: number;
		campaign_ID: number;
		image_URL: string;
		alt_text: string;
		public_ID: string;
	}

	interface ActionWithImageNominated {
		action_ID: number;
		user_ID: number;
		image_ID: number;
		action_name: string;
		all_day_event: boolean,
		all_day_event_date: Date,
		date_start: any;
		date_end: any;
		time_start: Date;
		time_end: Date;
		time_zone: string;
		action_street_address: string;
		action_street_address_02: string;
		action_city: string;
		action_state: string;
		action_zip_code: number;
		government_level: string;
		website_URL: string;
		details: string;
		admin_ID: number;
		voter_ID: number;
		campaign_ID: number;
		image_URL: string;
		alt_text: string;
		public_ID: string;
		date_nominated: Date;
		status: string;
		email: string;
		name_first: string;
		name_last: string;
	}

	interface Referendum {
		referendum_ID: number;
		image_ID: number;
		referendum_name: string;
		starting_year_if_enacted: number;
		election_date: Date;
		government_level: string;
		state: string;
		county: string;
		city: string;
		website_URL: string;
		details: string;
		elected: number;
		rejected: number;
		pending_election: number;
		contact_name_first: string;
		contact_name_last: string;
		contact_phone_number: E164Number | null;
		contact_street_address: string;
		contact_street_address_02: string;
		contact_city: string;
		contact_state: string;
		contact_zip_code: number;
		contact_email: string;
	}

	interface ReferendumWithImage {
		referendum_ID: number;
		image_ID: number;
		referendum_name: string;
		starting_year_if_enacted: number;
		election_date: Date;
		government_level: string;
		state: string;
		county: string;
		city: string;
		website_URL: string;
		details: string;
		elected: number;
		rejected: number;
		pending_election: number;
		contact_name_first: string;
		contact_name_last: string;
		contact_phone_number: E164Number | null;
		contact_street_address: string;
		contact_street_address_02: string;
		contact_city: string;
		contact_state: string;
		contact_zip_code: number;
		contact_email: string;
		admin_ID: number;
		voter_ID: number;
		campaign_ID: number;
		image_URL: string;
		alt_text: string;
		public_ID: string;
	}

	interface SearchReferendumWithImage {
		searchTerms: {
            year: string;
            government_level: string;
            state: string;
            county: string;
            city: string;
            name: string;
        };
		referendum_ID: number;
		image_ID: number;
		referendum_name: string;
		starting_year_if_enacted: number;
		election_date: Date;
		government_level: string;
		state: string;
		county: string;
		city: string;
		website_URL: string;
		details: string;
		elected: number;
		rejected: number;
		pending_election: number;
		contact_name_first: string;
		contact_name_last: string;
		contact_phone_number: E164Number | null;
		contact_street_address: string;
		contact_street_address_02: string;
		contact_city: string;
		contact_state: string;
		contact_zip_code: number;
		contact_email: string;
		admin_ID: number;
		voter_ID: number;
		campaign_ID: number;
		image_URL: string;
		alt_text: string;
		public_ID: string;
	}

	interface ReferendumWithImageNominated {
		referendum_ID: number;
		image_ID: number;
		referendum_name: string;
		starting_year_if_enacted: number;
		election_date: Date;
		government_level: string;
		state: string;
		county: string;
		city: string;
		website_URL: string;
		details: string;
		elected: number;
		rejected: number;
		pending_election: number;
		contact_name_first: string;
		contact_name_last: string;
		contact_phone_number: E164Number | null;
		contact_street_address: string;
		contact_street_address_02: string;
		contact_city: string;
		contact_state: string;
		contact_zip_code: number;
		contact_email: string;
		admin_ID: number;
		voter_ID: number;
		campaign_ID: number;
		image_URL: string;
		alt_text: string;
		public_ID: string;
		date_nominated: Date;
		status: string;
		email: string;
		name_first: string;
		name_last: string;
	}

	interface Image {
		image_ID: number;
		admin_ID: number;
		voter_ID: number;
		campaign_ID: number;
		image_URL: string;
		alt_text: string;
		public_ID: string;
	}

	interface SponsorHouse {
		sponsor_ID: number;
		sponsored_legislation_ID: number;
		sponsored_amendment_ID: number;
		sponsor_name: string;
	}

	interface SponsorSenate {
		sponsor_ID: number;
		sponsored_legislation_ID: number;
		sponsored_amendment_ID: number;
		sponsor_name: string;
	}

	interface CoSponsorHouse {
		co_sponsor_ID: number;
		co_sponsored_legislation_ID: number;
		co_sponsored_amendment_ID: number;
		co_sponsor_name: string;
		original_co_sponsor: number;
		date_co_sponsored: Date;
	}

	interface CoSponsorSenate {
		co_sponsor_ID: number;
		co_sponsored_legislation_ID: number;
		co_sponsored_amendment_ID: number;
		co_sponsor_name: string;
		original_co_sponsor: number;
		date_co_sponsored: Date;
	}

	interface DeleteItem {
		endorsement_name: string | null;
		endorsement_ID: number| null;
		endorsement_image_ID: number| null;
        edorsement_image_public_ID: string| null;
		endorsement_category: string| null;
	}

	interface CoSponsorInputValue {
        co_sponsor: string;
        isValid: boolean;
    };

	interface CityObject {
		zip_code: number;
		latitude: number;
		longitude: number;
		city: string;
		state: string;
		county: string;
	}

	interface CampaignUserInformation {
		campaign_user_information_ID: number;
		user_ID: number;
		name_first: string;
		name_last: string;
		phone_number: E164Number | null;
		street_address: string;
		street_address_02: string;
		city: string;
		state: string;
		zip_code: number;
	}

	interface CampaignApplication {
		campaign_application_ID: number;
		user_ID: number;
		image_ID: number;
		campaign_name: string;
		electorate: string;
		party: string;
		primary_election_date: Date;
		general_election_date: Date;
		starting_year_for_office_sought: number;
		website_URL: string;
		excellent_public_art_for_all: number;
		excellent_public_art_for_all_02: string;
		art_government_seat: number;
		art_government_seat_02: string;
		application_status: string;
		campaign_registered: number;
		campaign_questionnaire_completed: number;
		campaign_application_submitted: number;
		date_submitted: Date;
		authorized_campaign_representative: number;
		government_level: string;
		state: string;
		county: string;
		city: string;
	}

	interface CampaignApplicationWithImageRow {
		campaign_application_ID: number;
		user_ID: number;
		image_ID: number;
		campaign_name: string;
		electorate: string;
		party: string;
		primary_election_date: Date;
		general_election_date: Date;
		starting_year_for_office_sought: number;
		website_URL: string;
		excellent_public_art_for_all: number;
		excellent_public_art_for_all_02: string;
		art_government_seat: number;
		art_government_seat_02: string;
		application_status: string;
		campaign_registered: number;
		campaign_questionnaire_completed: number;
		campaign_application_submitted: number;
		date_submitted: Date;
		authorized_campaign_representative: number;
		image_URL: string;
		alt_text: string;
		public_ID: string;
		government_level: string;
		state: string;
		county: string;
		city: string;
	}

	interface NavPath {
		id: string;
		name: string;
		path: string;
		completed: boolean;
	}

	interface Endorsements {
        currentPageAmendments: number;
        currentPageCandidates: number;
        currentPageLegislation: number;
        currentPageReferendums: number;
        endorsed_amendments: AmendmentWithSponsorsAndImage[];
        endorsed_candidates: CandidateWithImage[];
        endorsed_legislation: LegislationWithSponsorsAndImage[];
        endorsed_referendums: ReferendumWithImage[];
        getEndorsedAmendmentsDataSuccess: boolean | null;
        getEndorsedCandidatesDataSuccess: boolean | null;
        getEndorsedLegislationDataSuccess: boolean | null;
        getEndorsedReferendumsDataSuccess: boolean | null;
        pendingEndorsedAmendmentsData: boolean | null;
        pendingEndorsedCandidatesData: boolean | null;
        pendingEndorsedLegislationData: boolean | null;
        pendingEndorsedReferendumsData: boolean | null;
        user: User | undefined;
    }

}

export {};
