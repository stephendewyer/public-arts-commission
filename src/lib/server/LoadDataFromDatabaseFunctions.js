import { mysqlConnection } from "$lib/server/db/mysql";

export const LoadAllEndorsedCandidates = async () => {

    // begin load candidates

    const loadEndorsedCandidatesStatement = "SELECT * FROM endorsed_candidates";

    /**
     * @type {Candidate[]}
     */
    let candidates = [];

    let res = await mysqlConnection();

    await res.query(loadEndorsedCandidatesStatement)
    .then(([ rows ]) => {

        candidates = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    return candidates;

    // end load candidates
};

export const LoadAllEndorsedLegislation = async () => {

    // begin load legislation

    const loadEndorsedLegislationStatement = "SELECT * FROM endorsed_legislation";

    /**
     * @type {Legislation[]}
     */
    let legislation = [];

    let res = await mysqlConnection();

    await res.query(loadEndorsedLegislationStatement)
    .then(([ rows ]) => {

        legislation = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    return legislation;

    // end load legislation

};

    
export const LoadAllEndorsedReferendums = async () => {

    // begin load referendums

    const loadEndorsedReferendumsStatement = "SELECT * FROM endorsed_referendums";

    /**
     * @type {Referendum[]}
     */
    let referendums = [];

    let res = await mysqlConnection();

    await res.query(loadEndorsedReferendumsStatement)
    .then(([ rows ]) => {

        referendums = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    return referendums;

    // end load referendums

};

export const LoadAllEndorsedAmendments = async () => {

    // begin loaad amendments 

    const loadEndorsedAmendmentsStatement = "SELECT * FROM endorsed_amendments";

    /**
     * @type {Amendment[]}
     */
    let amendments = [];

    let res = await mysqlConnection();

    await res.query(loadEndorsedAmendmentsStatement)
    .then(([ rows ]) => {

        amendments = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    return amendments;

    // end load amendments

};

export const LoadAllEndorsedActions = async () => {

    // begin load actions
    
    const loadEndorsedActionsStatement = "SELECT * FROM endorsed_actions";

    /**
     * @type {Action[]}
     */
    let actions = [];

    let res = await mysqlConnection();

    await res.query(loadEndorsedActionsStatement)
    .then(([ rows ]) => {

        actions = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    return actions;

    // end load actions

};




