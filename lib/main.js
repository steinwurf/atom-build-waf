// Allows us to use ECMAScript 6 features that are not yet implemented in the
// versions of Chromium and io.js that ships with Atom.
// Read more here: http://blog.atom.io/2015/02/04/built-in-6to5.html

"use babel";

// The following will import the default export from the module glob.
// Read more about that here: http://stackoverflow.com/a/31098182
//
// I'm relatively sure the module is this one:
// https://www.npmjs.com/package/glob
//
import glob from 'glob'

// This function will be called by the build-package and we should return an
// ES6 class in return. The functions we can implement in the class is
// documented here:
// https://github.com/noseglid/atom-build/blob/v0.64.0/create-provider.md
//
export function provideBuilder() {

  return class WafBuildProvider {

    // @param cwd is the project root this provider will operate in, so store
    //       cwd in this.
    constructor(cwd) {
        this.cwd = cwd;
    }

    // @return A nice readable name of this provider
    getNiceName() {
      return 'Waf'
    }

    // @return True if the provider can build the project in cwd (which was
    //         specified in the constructor).
    isEligible() {

      // Glob for the waf file (synchronously)
      if (glob.sync('waf', { cwd: this.cwd }).length >= 1) {
        // We found a waf file
        return true;
      }
      return false;
    }

    // @return An array of objects which each define a build description
    settings() {
      return [
        {
          name: 'waf build',
          // We should use exec insead of cmd for now this is being fixed in
          // Atom build. Such that this should be cmd in the future
          exec: 'python', 
          args: ['waf']
        }
      ];
    }

  }
}
