# atom-build-waf

Uses the [atom-build](https://github.com/noseglid/atom-build) package to
execute `waf` builds inside the `Atom` editor.

This package requires [atom-build](https://github.com/noseglid/atom-build) to
be installed.

We detect whether the builder can be activated by looking for the `waf` binary
in the project root folder. Find the code for this in `lib/main.js`.

Since `waf` can build projects using many different compilers, the error output
will depend on which compiler is used. Current version is tested only with:

* gcc/g++
* clang (reported to work)

If you run into problems with other compilers, which is likely, you can add the
sample output to the `spec` folder and make the unit test pass. It may require
that we re-write the `match_error_gcc` function to first detect the compiler
used.

## Usage

We have not yet published this as an atom package so until then you can do the
following to use it:

```
git clone git@github.com:steinwurf/atom-build-waf.git
```

### For every-day use

Assuming you did the checkout in `atom-build-waf`:

```
cd atom-build-waf
apm link
```

This will create a symlink to the package in `.atom/packages/` such that when
you launch `atom` it will load the package.

If you want to remove the package again you can run:

```
cd atom-build-waf
apm unlink
```

### For development

Assuming you did the checkout in `atom-build-waf`:

```
cd atom-build-waf
apm link --dev
```

This will create a symlink to the package in `.atom/dev/packages/` such that
when you launch in development mode using `atom -d` it will load the development
packages.

If you want to remove the package again you can run:

```
cd atom-build-waf
apm unlink --dev
```

#### Development work-flow

In case you need to fix something in the package, this work-flow seems to work
pretty well:

1. Go to the sources `cd atom-build-waf`
1. Create a new branch for your feature/tests
1. Open Atom in the source folder `atom .`
1. Code stuff
1. Run unit tests using the `Spec Suite` directly by pressing `ctrl-alt-p`
  1. In case you need logging you can put `colsole.log("message");` in the code
  1. The log output is visible in the `Spec Suite` window by pressing
     `ctrl-shift-i`
1. When everything works, merge branch and celebrate!

## Running unit tests

The first time you run the tests or if the dependencies are
updated you need to run:

```
cd atom-build-waf
apm install
```

Subsequently you can run the tests with:

```
cd atom-build-waf
apm test
```

Another convenient way of running the unit tests is directly from with Atom
using the short-cut `ctrl-alt-p`.
