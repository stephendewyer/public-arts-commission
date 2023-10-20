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

}

export {};
