export const reverseHtmlEntities = (/** @type { string | undefined | null} */ stringData) => {
    if (typeof stringData === "string") {
        return stringData?.replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, `"`).replace(/&apos;/g, `'`);
    } else {
        return "";
    };        
}