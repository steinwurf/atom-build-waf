'use babel';

import * as path from 'path';
import XRegExp from 'xregexp'

// Error containing information about the errors found. We've mostly created
// this class to be able to provide the equals(...) function, such that we can
// prune out duplicate errors. If at some point we find a better way of doing
// this, we may kill this class again
export class Error {
    constructor(file, line, column, message) {
        this.file = file;
        this.line = line;
        this.col = column;
        this.message = message;
    }

    equals(otherError)
    {
        if (this.file != otherError.file)
            return false;

        if (this.line != otherError.line)
            return false;

        if (this.col != otherError.col)
            return false;

        if (this.message != otherError.message)
            return false;

        return true;

    }

    toString() {
        return '(' + this.file + ', ' + this.line + ', '+ this.column +', ' + this.message +')';
    }
}

// We can use the same approach as show in the Atom Build readme:
// https://atom.io/packages/build
// The code below is modified version of that.
//
export let matchError = (output) => {

    // The regex is documented below as outlined in:
    //     https://www.infoq.com/presentations/regex
    //
    // The whole talk is worth a look, but there are some JavaScript specific
    // examples at 32:45 into the talk.
    //
    // We are using the XRegExp regular expression library which allows us to
    // use "extended" mode. This basically means that we can add spaces and
    // comments into the regular expressions, hopefully making the regular
    // expressions more readable and maintainable :)
    //
    // Read more about extended mode here: http://xregexp.com/flags/

    // Regexp that figures out what directory waf is using for the build..
    const enter_dir = XRegExp(
        "^                         # Match the beginning of a line           \n\
         Waf:                      # Match the string 'Waf:                  \n\
         \\s                       # Match a space                           \n\
         Entering                  # Match the string 'Entering'             \n\
         \\s                       # Match a space                           \n\
         directory                 # Match the string 'directory'            \n\
         \\s                       # Match a space                           \n\
         `                         # Match the backtick character '`'        \n\
         (                         # Group and capture the following:        \n\
             [^']+                 #   One or more characters except '       \n\
         )                         # End of group                            \n\
         '                         # Match the ' character                   \n\
         $                         # Match the end of line                   \n\
        ", "x" // The "x" enables extended mode, read about it above.
    );

    // Regexp that matches an error string produced by gcc/g++ or clang..
    //
    // Typically errors have the following pattern:
    //
    //    <file-path>:<line-number>:<column-number> error: <error-message>
    //
    // Where <file-path> is an relative or absolute path to the file where an
    // error occured. If it is relative, we use the enter_dir regex to figure
    // out in which directory waf ran the compiler.
    //
    // <line-number> is the line number in the file where there error occured
    // <column-number> is the colum numer in the file where the error occured
    // <error-message> is the error reported by the compiler.
    //
    // See example output in the spec/error_gcc.txt file.
    const error = XRegExp(
        "(                         # Group and capture the following...      \n\
           [^:]+                   #   Match one-or-more characters except : \n\
         )                         # End of group                            \n\
         :                         # Match a colon                           \n\
         (                         # Then group and capture the following    \n\
            \\d+                   #   Match one-or-more digits              \n\
         )                         # End of the group                        \n\
         :                         # Match a colon                           \n\
         (                         # Then group and capture the following    \n\
            \\d+                   #   Match one-or-more digits              \n\
         )                         # End of the group                        \n\
         :                         # Match a colon                           \n\
         \\s+                      # Match one-or-more spaces                \n\
         (?:                       # Group the following but do not capture  \n\
            error:                 #   Match one-or-more digits              \n\
         |                         # or...                                   \n\
            fatal                  #   Match one-or-more digits              \n\
            \\s                    #   Match a space                         \n\
            error:                 #   Match one-or-more digits              \n\
         )                         # End of the group                        \n\
         (                         # Then group and capture the following    \n\
            .+                     #   One-or-more characters until newline  \n\
         )                         # End of the group                        \n\
        ", "x" // The "x" enables extended mode, read about it above.
    );

    // This is the list of error matches that atom-build will process
    const error_array = [];

    // Stores the current directory
    var dir = null;

    // Iterate over the output line-by-line
    output.split(/\r?\n/).forEach(line => {

        // Update the current directory on lines with `Entering directory`
        const dir_match = enter_dir.exec(line);
        if (dir_match) {
            dir = dir_match[1];
            return;
        }

        // Process possible error messages
        const error_match = error.exec(line);
        if (!error_match) {
            return;
        }

        // Check if the file path is absolute
        let filename = error_match[1];

        if (!path.isAbsolute(filename))
        {
            filename = dir ? path.join(dir, filename) : filename;
        }

        const new_error = new Error(filename, error_match[2],
            error_match[3], error_match[4]);

        // Remove duplicates in the error array. We do this by looping over all
        // recorded errors. Would be nice to find a better way to do this.
        let found = false;
        for (let old_error of error_array)
        {
            if (old_error.equals(new_error))
            {
                found = true;
                break;
            }
        }

        if (found == false)
        {
            // If we have not already see the error record it.
            error_array.push(new_error);
        }
    });

    console.log('ok works');

    return error_array;
}
