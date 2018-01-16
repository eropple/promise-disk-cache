# `promise-disk-cache` #
Sometimes you need a cache.

Sometimes it needs to be on disk.

This is not rocket science.

But it does target Node 8.0.0 and later.

## Installation ##
You know the drill.

```
npm install @eropple/promise-disk-cache
yarn add @eropple/promise-disk-cache
```

## Usage ##
### Initialization ###
Create a `Cache` object and `initialize` it. `initialize` is an asynchronous
method; it's also wrapped by `Cache.build`.

```js
import Cache from '@eropple/promise-disk-cache';

async function start() {
  // these are moral equivalents, though with different options
  const cache1 = await Cache.build({
    cacheLocation: "/tmp/foo",
    cleanOnExit: true // if true, hooks process.on('exit') to remove the cache
  });

  // if cacheLocation isn't provided, uses a random temp directory.
  // if cleanOnExit is false (default), cache persists across runs.
  const cache2 = new Cache();
  await cache2.initialize();
}
```

### Use ###
`Cache` has four main methods: `string`, `json`, `buffer`, and `invalidate`.

Below, `key` is always a string. It should conform to the rules of a file path
in Unix (no `NUL` characters, spaces OK, subdirectories are delineated by the
forward slash `/`). You can put a file extension on it of you want (I tend to do
this for images in my disk cache) but it's not required.

#### `string(key, fetcher)` ####
Fetches a string from cache if `key` exists. If not, executes `fetcher`, which
is of type `() -> any`; it will be saved to disk (via `.toString()`) and then
returned out of cache.

All strings will be saved to disk as `utf8`.

#### `json(key, fetcher)` ####
As per `string`, but `fetcher` is of type `() -> any` and will be stringified
via `JSON.stringify` before storage.

#### `buffer(key, fetcher)` ####
As per `string`, but `fetcher` is of type `() -> Buffer` and will be written to
disk as binary data.


#### `invalidate(key)` ####
Deletes `key` from the cache if it exists.

### License ###
Copyright (c) 2018 Ed Ropple. Released under the [MIT license]().

[MIT license]: https://spdx.org/licenses/MIT.html
