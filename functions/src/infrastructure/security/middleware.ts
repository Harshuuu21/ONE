import { CallableRequest, HttpsError } from "firebase-functions/v2/https";

export const requireAuth = (request: CallableRequest) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }
    return request.auth;
};

export const requireAppCheck = (request: CallableRequest) => {
    if (request.app == undefined) {
        throw new HttpsError('failed-precondition', 'The function must be called from an App Check verified app.');
    }
};

export const withSecurity = (request: CallableRequest) => {
    // TODO: Uncomment when App Check is fully configured on frontend
    // requireAppCheck(request); 
    return requireAuth(request);
};
