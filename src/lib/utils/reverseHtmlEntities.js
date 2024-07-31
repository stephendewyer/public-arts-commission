export const reverseHtmlEntities = (/** @type { string | null | undefined } */ stringData) => {
    return stringData?.replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, `"`).replace(/&apos;/g, `'`);
}