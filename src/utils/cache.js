/* eslint-disable no-void */
'use strict';
const __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === 'm') throw new TypeError('Private method is not writable');
    if (kind === 'a' && !f) throw new TypeError('Private accessor was defined without a setter');
    if (typeof state === 'function' ? receiver !== state || !f : !state.has(receiver)) throw new TypeError('Cannot write private member to an object whose class did not declare it');
    return (kind === 'a' ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value; // eslint-disable-line
};
const __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === 'a' && !f) throw new TypeError('Private accessor was defined without a getter');
    if (typeof state === 'function' ? receiver !== state || !f : !state.has(receiver)) throw new TypeError('Cannot read private member from an object whose class did not declare it');
    return kind === 'm' ? f : kind === 'a' ? f.call(receiver) : f ? f.value : state.get(receiver);
};
let _a, _CacheInstance, _CacheEnabled, _CacheHits, _CacheLookups; // eslint-disable-line

/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
export class Cache extends Map {
    constructor () {
        super();
        _CacheHits.set(this, void 0);
        _CacheLookups.set(this, void 0);
        __classPrivateFieldSet(this, _CacheHits, 0, 'f');
        __classPrivateFieldSet(this, _CacheLookups, 0, 'f');
    }

    static get hits () {
        return __classPrivateFieldGet(Cache.instance(), _CacheHits, 'f');
    }

    static get lookups () {
        return __classPrivateFieldGet(Cache.instance(), _CacheLookups, 'f');
    }

    static instance () {
        if (!__classPrivateFieldGet(Cache, _a, 'f', _CacheInstance)) {
            __classPrivateFieldSet(Cache, _a, true, 'f', _CacheEnabled);
            __classPrivateFieldSet(Cache, _a, new Cache(), 'f', _CacheInstance);
        }
        return __classPrivateFieldGet(Cache, _a, 'f', _CacheInstance);
    }

    static set (key, value) {
        if (__classPrivateFieldGet(Cache, _a, 'f', _CacheEnabled)) {
            Cache.instance().set(key, value);
        }
    }

    static get (key) {
        let _b, _c, _d;
        if (!__classPrivateFieldGet(Cache, _a, 'f', _CacheEnabled)) {
            return undefined;
        }
        __classPrivateFieldSet(_b = Cache.instance(), _CacheLookups, (_c = __classPrivateFieldGet(_b, _CacheLookups, 'f'), _c++, _c), 'f');
        __classPrivateFieldSet(_d = Cache.instance(), _CacheHits, __classPrivateFieldGet(_d, _CacheHits, 'f') + (Cache.instance().has(key) ? 1 : 0), 'f');
        return __classPrivateFieldGet(Cache, _a, 'f', _CacheInstance).get(key);
    }

    static disable () {
        __classPrivateFieldSet(Cache, _a, false, 'f', _CacheEnabled);
    }

    static enable () {
        __classPrivateFieldSet(Cache, _a, true, 'f', _CacheEnabled);
    }
}

_a = Cache;
_CacheHits = new WeakMap();
_CacheLookups = new WeakMap();

_CacheInstance = { value: void 0 };
_CacheEnabled = { value: true };
// # sourceMappingURL=cache.js.map
