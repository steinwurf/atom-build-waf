'use babel';

import * as path from 'path';

// We can use the same approach as show in the Atom Build readme:
// https://atom.io/packages/build
// The code below is modified version of that.
//
export let matchError = (output) => {

    const enter_dir = /^Waf: Entering directory `([^']+)'$/;
    const error = /([\/0-9a-zA-Z\._-]+):(\d+):(\d+):\s+error:(.+)/;

    // This is the list of error matches that atom-build will process
    const array = [];

    // Stores the current directory
    var dir = null;

    // Iterate over the output by lines
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

        // Map the regex match to the error object that atom-build expects
        array.push({
            file: filename,
            line: error_match[2],
            col: error_match[3],
            message: error_match[4]
        });
    });

    console.log('ok works');

    return array;
}
