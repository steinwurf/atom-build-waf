"use babel";

import fs from 'fs-extra';
import {matchError, Error} from "../lib/match_error_gcc.js"

describe("Match errors from gcc", () => {
    it("find errors", () => {

        let output = fs.readFileSync(`${__dirname}/error_gcc.txt`, 'utf-8')

        expect(matchError(output)).toEqual([
            new Error('/lib-core/test/src/test_select_type.cpp',
                      '31', '71',
                      ' type/value mismatch ‘template<class BaseType, class DefaultType> struct kodo_core::select_type’'),
            new Error('/lib-core/src/lib_core/select_symbol_id_writer_layers.hpp',
                      '35', '9',
                      ' expected nested-name-specifier before ‘select_type2’'),
            new Error('/lib-core/src/lib_core/full_vector_decoder.hpp',
                      '19', '45',
                      ' kodo_core/select_storage_type.hpp: No such file or directory')]
        );
    });
});


describe("Check Error class", () => {
    it("equals works", () => {

        let e1 = new Error('test.txt', '12','13','error message');
        let e2 = new Error('test.txt', '12','14','error message');

        expect(e1.equals(e1)).toEqual(true);
        expect(e1.equals(e2)).toEqual(false);
    });
});
1
