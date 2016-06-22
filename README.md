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

## Running unit tests

```
cd atom-build-waf
apm test
```
