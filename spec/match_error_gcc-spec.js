import match_error_gcc from "../lib/match_error_gcc.js"

describe("Match errors from gcc", () => {
    it("find errors", () => {
        expect(matchError()).toEqual("Hello world");
    });
});
