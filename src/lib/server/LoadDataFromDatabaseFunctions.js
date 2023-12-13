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

    res.end();

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

    res.end();

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

    res.end();

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

    res.end();

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

    res.end();

    return actions;

    // end load actions

};

export const LoadAllEndorsedCandidatesImages = async (/** @type {number[]} */ image_IDs) => {
    // select images from image_collection table where image_ID == image_ID
    //image ids comma separated list
    const listImageIds = image_IDs.join(", ");

    const loadImagesStatement = `SELECT * FROM image_collection WHERE image_ID in(${listImageIds})`;

    /**
     * @type {Image[]}
     */
    let candidatesImages = [];

    let res = await mysqlConnection();

    await res.query(loadImagesStatement)
    .then(([ rows ]) => {

        candidatesImages = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    res.end();

    return candidatesImages;

};

export const LoadAllEndorsedActionsImages = async (/** @type {number[]} */ image_IDs) => {
    const listImageIds = image_IDs.join(", ");

    const loadImagesStatement = `SELECT * FROM image_collection WHERE image_ID in(${listImageIds})`;

    /**
     * @type {Image[]}
     */
    let actionsImages = [];

    let res = await mysqlConnection();

    await res.query(loadImagesStatement)
    .then(([ rows ]) => {

        actionsImages = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    res.end();

    return actionsImages;
    
};

export const LoadAllEndorsedReferendumsImages = async (/** @type {number[]} */ image_IDs) => {

    const listImageIds = image_IDs.join(", ");

    const loadImagesStatement = `SELECT * FROM image_collection WHERE image_ID in(${listImageIds})`;

    /**
     * @type {Image[]}
     */
    let referendumsImages = [];

    let res = await mysqlConnection();

    await res.query(loadImagesStatement)
    .then(([ rows ]) => {

        referendumsImages = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    res.end();

    return referendumsImages;

};

export const LoadAllEndorsedLegislationImages = async (/** @type {number[]} */ image_IDs) => {
    const listImageIds = image_IDs.join(", ");

    const loadImagesStatement = `SELECT * FROM image_collection WHERE image_ID in(${listImageIds})`;

    /**
     * @type {Image[]}
     */
    let legislationImages = [];

    let res = await mysqlConnection();

    await res.query(loadImagesStatement)
    .then(([ rows ]) => {

        legislationImages = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    res.end();

    return legislationImages;
    
};

export const LoadAllEndorsedAmendmentsImages = async (/** @type {number[]} */ image_IDs) => {
    const listImageIds = image_IDs.join(", ");

    const loadImagesStatement = `SELECT * FROM image_collection WHERE image_ID in(${listImageIds})`;

    /**
     * @type {Image[]}
     */
    let amendmentsImages = [];

    let res = await mysqlConnection();

    await res.query(loadImagesStatement)
    .then(([ rows ]) => {

        amendmentsImages = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    res.end();

    return amendmentsImages;
    
};




