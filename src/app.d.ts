// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { SvelteComponent } from 'svelte';

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}

	interface SessionUser {
		email: string,
		name: string,
	}

	interface ResponseObj {
        success: string;
        error: string;
        status: number | null
    };

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
		elected_in_primary_and_general: number;
		elected_in_primary_proceeding_general: number;
		rejected_in_primary_proceeding_general: number;
		contact_name_first: string;
		contact_name_last: string;
		contact_phone_number: number;
		contact_street_address: string;
		contact_street_address_02: string;
		contact_city: string;
		contact_state: string;
		contact_zip_code: number;
		contact_email: string;
		elected_in_primary_rejected_in_general: number;
    	rejected_in_primary_campaign_ended: number;
    	rejected_in_primary_rejected_in_general: number;
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
		elected_in_primary_and_general: number;
		elected_in_primary_proceeding_general: number;
		rejected_in_primary_proceeding_general: number;
		elected_in_primary_rejected_in_general: number;
    	rejected_in_primary_campaign_ended: number;
    	rejected_in_primary_rejected_in_general: number;
		contact_name_first: string;
		contact_name_last: string;
		contact_phone_number: number;
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
		contact_phone_number: number;
		contact_street_address: string;
		contact_street_address: string;
		contact_city: string;
		contact_state: string;
		contact_zip_code: number;
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
		contact_phone_number: number;
		contact_street_address: string;
		contact_street_address: string;
		contact_city: string;
		contact_state: string;
		contact_zip_code: number;
		admin_ID: number;
		voter_ID: number;
		campaign_ID: number;
		image_URL: string;
		alt_text: string;
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
		contact_phone_number: number;
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
		contact_phone_number: number;
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
		contact_phone_number: number;
		contact_street_address: string;
		contact_street_address_02: string;
		contact_city: string;
		contact_state: string;
		contact_zip_code: number;
		contact_email: string;
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
		contact_phone_number: number;
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
		contact_phone_number: number;
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
		contact_phone_number: number;
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
	}

	interface Image {
		image_ID: number;
		admin_ID: number;
		voter_ID: number;
		campaign_ID: number;
		image_URL: string;
		alt_text: string;
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

}

export {};
