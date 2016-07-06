"use babel";

// The above "use bable"; allows us to use ECMAScript 6 features that are not
// yet implemented in the versions of Chromium and io.js that ships with Atom.
// It must be there very first line. Read more here:
// http://blog.atom.io/2015/02/04/built-in-6to5.html

// The following will import the default export from the module glob.
// Read more about that here: http://stackoverflow.com/a/31098182
//
// I'm relatively sure the module is this one:
// https://www.npmjs.com/package/glob
//
import glob from 'glob';
import {matchError} from './match_error_gcc.js'
import {EventEmitter} from 'events';

// Atom packages can specify settings, this is documented here:
// https://atom.io/docs/api/v1.8.0/Config
export const config = {
  buildArgs: {
    title: 'Additional build arguments',
    description: 'Specify additional arguments to be passed to the build \
                  target.',
    type: 'array',
    default: [],
    items: {
        type: 'string'
    }
  }
};

// This function will be called by the build-package and we should return an
// ES6 class in return. The functions we can implement in the class is
// documented here:
// https://github.com/noseglid/atom-build/blob/v0.64.0/create-provider.md
//
export function provideBuilder() {

  return class WafBuildProvider extends EventEmitter {

    // @param cwd is the project root this provider will operate in, so store
    //       cwd in this.
    constructor(cwd) {
        super();
        this.cwd = cwd;

        // Ensure we update if the settings change
        atom.config.observe('atom-build-waf.buildArgs', () => this.emit('refresh'))
    }

    // @return A nice readable name of this provider
    getNiceName() {
      return 'Waf'
    }

    // @return True if the provider can build the project in cwd (which was
    //         specified in the constructor).
    isEligible() {

      console.log("okok");

      console.log(this.cwd);

      // Glob for the waf file (synchronously)
      if (glob.sync('waf', { cwd: this.cwd }).length >= 1) {
        // We found a waf file
        console.log("is eligible 1");
        return true;
      }
      console.log("not eligible");
      return false;
    }

    // @return An array of objects which each define a build description
    settings() {

      const buildArgs = ['waf','build'].concat(
          atom.config.get('atom-build-waf.buildArgs'));

      console.log(buildArgs);

      return [
        {
          name: 'waf build',
          // We should use exec insead of cmd for now this is being fixed in
          // Atom build. Such that this should be cmd in the future:
          // https://gitter.im/noseglid/atom-build?at=57587d2d2eaa837d71e79b3d
          exec: 'python',
          args: buildArgs,
          functionMatch: [matchError]
        },
        {
        name: 'waf clean',
        // We should use exec insead of cmd for now this is being fixed in
        // Atom build. Such that this should be cmd in the future:
        // https://gitter.im/noseglid/atom-build?at=57587d2d2eaa837d71e79b3d
        exec: 'python',
        args: ['waf', 'clean']
      }
      ];
    }

  }
}
