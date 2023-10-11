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
		panel: typeof SvelteComponent<any>;
    }
	
}

export {};
