export type TriggerAction =
| OpenUrl
| OpenArticleUrl
| OpenBookmarkedUrl
| FrequentVisits
| NewSavedLogin
| ContentBlocking;

/** List of urls we should match against */
type UrlParams = Array<string>;

/** List of Match pattern compatible strings to match agaist */
type UrlPatterns = Array<string>;

interface BaseTrigger {
    id?: string;
    params?: UrlParams;
    patterns?: UrlPatterns;
}

/** Happens every time the user loads a new URL that matches the provided `hosts` or `patterns` */
export interface OpenUrl extends BaseTrigger {
    id: "openURL";
}

/** Happens every time the user loads a document that is Reader Mode compatible */
export interface OpenArticleUrl extends BaseTrigger {
    id: "openArticleURL";
}

/** Happens every time the user adds a bookmark from the URL bar star icon */
export interface OpenBookmarkedUrl {
    id: "openBookmarkedURL";
}

/** Happens every time a user navigates (or switches tab to) to any of the `hosts` or `patterns` arguments but additionally provides information about the number of accesses to the matched domain. */
export interface FrequentVisits extends BaseTrigger {
    id: "frequentVisits",
}

/** Happens every time the user adds or updates a login */
export interface NewSavedLogin {
    id: "newSavedLogin";
}

/** Happens every time Firefox blocks the loading of a page script/asset/resource that matches the one of the tracking behaviours specifid through params. See https://searchfox.org/mozilla-central/rev/8ccea36c4fb09412609fb738c722830d7098602b/uriloader/base/nsIWebProgressListener.idl#336 */
export interface ContentBlocking {
    id: "contentBlocking";
    params: Array<number>;
}