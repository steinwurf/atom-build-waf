"use babel";

import fs from 'fs-extra';
import {matchError} from "../lib/match_error_gcc.js"

describe("Match errors from gcc", () => {
    it("find errors", () => {

        let output = fs.readFileSync(`${__dirname}/error_gcc.txt`, 'utf-8')

        expect(matchError(output)).toEqual([
            {file: '/lib-core/test/src/test_select_type.cpp',
             line: '31',
             col: '71',
             message: ' type/value mismatch ‘template<class BaseType, class DefaultType> struct kodo_core::select_type’'},
            {file: '/lib-core/src/lib_core/select_symbol_id_writer_layers.hpp',
             line: '35',
             col: '9',
             message: ' expected nested-name-specifier before ‘select_type2’'},
            {file: '/lib-core/src/lib_core/full_vector_decoder.hpp',
             line: '19',
             col: '45',
             message: ' kodo_core/select_storage_type.hpp: No such file or directory'}]
        );
    });
});
