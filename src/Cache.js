import * as _ from 'lodash';
import Joi from 'joi';
import fsx from 'fs-extra';
import path from 'path';
import tmpdir from 'os-tmpdir';
import deepFreeze from 'deep-freeze-es6';

import { OPTIONS_VALIDATOR, DEFAULT_OPTIONS } from './options';

export default class Cache {
  constructor(userOptions = {}) {
    const options = _.merge({}, DEFAULT_OPTIONS, userOptions);
    Joi.assert(options, OPTIONS_VALIDATOR, "Invalid settings for cache.");

    this._options = deepFreeze(options);
    this._cacheLocation = options.cacheLocation || tmpdir();

    if (this.options.cleanOnExit) {
      process.on('exit', this.onExit);
    }
  }

  get options() { return this._options; }
  get initialized() { return this._initialized; }

  async initialize() {
    this._initialized = true;
    await fsx.ensureDir(this._cacheLocation);
  }

  onExit() {
    fsx.removeSync(this._cacheLocation);
  }

  cachePath(key) {
    return path.join(this._cacheLocation, key);
  }

  async string(key, fetcher) {
    const keyPath = this.cachePath(key);

    if (await fsx.pathExists(keyPath)) {
      return fsx.readFile(keyPath, { encoding: "utf8" });
    } else {
      const value = await fetcher();

      await fsx.outputFile(keyPath, value, { encoding: "utf8" });
      return value;
    }
  }

  async json(key, fetcher) {
    const keyPath = this.cachePath(key);

    if (await fsx.pathExists(keyPath)) {
      return fsx.readJson(keyPath);
    } else {
      const value = await fetcher();

      await fsx.outputJson(keyPath, value);
      return value;
    }
  }

  async buffer(key, fetcher) {
    const keyPath = this.cachePath(key);

    if (await fsx.pathExists(keyPath)) {
      return fsx.readJson(keyPath);
    } else {
      const value = await fetcher();
      if (!Buffer.isBuffer(value)) {
        throw new Error(`Fetcher returned non-Buffer value for key: ${key}`)
      }

      await fsx.outputFile(keyPath, value);
      return value;
    }
  }
}

Cache.build = async (userOptions = {}) => {
  const cache = new Cache(userOptions);
  await cache.initialize();

  return cache;
}
