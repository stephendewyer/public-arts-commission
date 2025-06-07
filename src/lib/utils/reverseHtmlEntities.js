export const reverseHtmlEntities = (/** @type { string } */ stringData) => {
    return stringData?.replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, `"`).replace(/&apos;/g, `'`);
}