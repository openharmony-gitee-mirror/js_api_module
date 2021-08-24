/*
 * Copyright (c) 2021 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
const urlUtil = requireInternal("url");
let seachParamsArr = [];

class URLSearchParams {
    urlcalss;
    constructor(input) {
        let out = [];
        out = parameterProcessing(input);
        this.urlcalss = new urlUtil.URLSearchParams1();
        this.urlcalss.array = out;
    }
    append(params1, params2) {
        this.urlcalss.append(params1, params2);
    }

    set(setname, setvalues) {
        this.urlcalss.set(setname, setvalues);
    }

    sort() {
        this.urlcalss.sort();
    }

    has(hasname) {
        return this.urlcalss.has(hasname);
    }

    toString() {
        return this.urlcalss.toString();
    }

    keys() {
        return this.urlcalss.keys();
    }

    values() {
        return this.urlcalss.values();
    }

    getAll(getAllname) {
        return this.urlcalss.getAll(getAllname);
    }

    get(getname) {
        return this.urlcalss.get(getname);
    }

    entries() {

        return this.urlcalss.entries();
    }

    delete(deletename) {
        this.urlcalss.delete(deletename);
    }

    forEach(objfun) {
        return this.urlcalss.forEach(objfun);
    }

    [Symbol.iterator]() {
        return this.urlcalss.entries();
    }

    updateParams(input) {
        let out = [];
        out = parameterProcessing(input);
        this.urlcalss.array = out;
    }
}

function toHleString(arg) {
    return arg.toString();
}

function parameterProcessing(input) {
    if (input === null || typeof input === 'undefined') {
        seachParamsArr = [];
        return  seachParamsArr;
    } else if (typeof input === 'object' || typeof input === 'function') {
        return initObjectSeachParams(input);
    } else {
        return initToStringSeachParams(input);
    }
}

function initObjectSeachParams(input) {
    if (typeof input[Symbol.iterator] === 'function') {
        return iteratorMethod(input);
    }
    return recordMethod(input);
}

function recordMethod(input) {
    const keys = Reflect.ownKeys(input);
    seachParamsArr = [];
    for (let i = 0; i <= keys.length; i++) {
        const key = keys[i];
        const desc = Reflect.getOwnPropertyDescriptor(input, key);
        if (desc !== undefined && desc.enumerable) {
            const typedKey = toHleString(key);
            const typedValue = toHleString(input[key]);
            seachParamsArr.push(typedKey, typedValue);
        }
    }
    return  seachParamsArr;
}

function iteratorMethod(input) {
    let pairs = [];
    seachParamsArr = [];
    for (const pair of input) {
        const convertedPair = [];
        for (let element of pair) {
            convertedPair.push(element);
        }
        pairs.push(convertedPair);
    }

    for (const pair of pairs) {
        if (pair.length !== 2) {
            console.log('key-value-is-worong');
        }
        seachParamsArr.push(pair[0], pair[1]);
    }
    return  seachParamsArr;
}

function initToStringSeachParams(input) {
    if (input[0] === '?') {
        input = input.slice(1);
    }
    let strVal = decodeURI(input);
    seachParamsArr = urlUtil.stringParmas(strVal);
    return seachParamsArr;
}

class URL {
    href_;
    search_;
    origin_;
    username_;
    password_;
    hostname_;
    host_;
    hash_;
    protocol_;
    pathname_;
    port_;
    searchParamsClass_;
    c_info;
    constructor() {
        let nativeUrl;
        let inputUrl;
        let inputBase;

        if (arguments.length === 1) {
            inputUrl = arguments[0];
            if (typeof inputUrl === 'string' && inputUrl.length > 0) {
                nativeUrl = new urlUtil.Url(inputUrl);
            } else {
                console.log('Input parameter error');
            }
        }

        if (arguments.length === 2) {
            inputUrl = arguments[0];
            inputBase = arguments[1];
            if (typeof inputUrl === 'string') {
                if (typeof inputBase === 'string') {
                    if (inputBase.length > 0) {
                        nativeUrl = new urlUtil.Url(inputUrl, inputBase);
                    } else {
                        console.log('Input parameter error');
                        return;
                    }
                }
                if (typeof inputBase === 'object') {
                    let nativeBase = inputBase.get_info();
                    nativeUrl = new urlUtil.Url(inputUrl, nativeBase);
                }
            }
        }
        this.c_info = nativeUrl;
        if (nativeUrl.onOrOff) {
            this.search_ = encodeURI(nativeUrl.search);
            this.username_ = encodeURI(nativeUrl.username);
            this.password_ = encodeURI(nativeUrl.password);
            if (nativeUrl.GetIsIpv6) {
                this.hostname_ = nativeUrl.hostname;
                this.host_ = nativeUrl.host;
            } else {
                this.hostname_ = encodeURI(nativeUrl.hostname);
                this.host_ = encodeURI(nativeUrl.host);
            }
            this.hash_ = encodeURI(nativeUrl.hash);
            this.protocol_ = encodeURI(nativeUrl.protocol);
            this.pathname_ = encodeURI(nativeUrl.pathname);
            this.port_ = nativeUrl.port;
            this.origin_ = nativeUrl.protocol + '//' + nativeUrl.host;
            this.searchParamsClass_ = new URLSearchParams(this.search_);
            this.set_href();
        } else {
            console.log('constructor failed');
        }
    }
    get_info() {
        return this.c_info;
    }
    set_href() {
        let temp = this.protocol_;
        if (this.hostname_ !== '') {
            temp += '//';
            if (this.password_ !== '' || this.username_ !== '') {
                if (this.username_ !== '') {
                    temp += this.username_;
                }
                if (this.password_ !== '') {
                    temp += ':';
                    temp += this.password_;
                }
                temp += '@';
            }
            temp += this.hostname_;
            if (this.port_ !== '') {
                temp += ':';
                temp += this.port_;
            }
        } else if (this.protocol_ === 'file:') {
            temp += '//';
        }
        temp += this.pathname_;
        if (this.search_) {
            temp += this.search_;
        }
        if (this.hash_) {
            temp += this.hash_;
        }
        this.href_ = temp;
    }
}

Object.defineProperties(URL.prototype, {

    to_string: {
        writable: true,
        enumerable: true,
        configurable: true,
        value: function toString() {
            return this.href_;
        }
    },
    origin: {
        enumerable: true,
        configurable: true,
        get() {
            let kOpaqueOrigin = 'null';
            switch (this.protocol_) {
                case 'ftp:':
                case 'gopher:':
                case 'http:':
                case 'https:':
                case 'ws:':
                case 'wss:':
                    return this.origin_;
            }
            return kOpaqueOrigin;
        }
    },
    protocol: {
        enumerable: true,
        configurable: true,
        get() {
            return this.protocol_;
        },
        set(scheme) {
            if (scheme.length === 0) {
                return;
            }
            if (this.protocol_ === 'file:'
                && (this.host_ === '' || this.host_ == null)) {
                return;
            }
            this.c_info.protocol = scheme;
            this.protocol_ = this.c_info.protocol;
            this.set_href();
        }
    },
    username: {
        enumerable: true,
        configurable: true,
        get() {
            return this.username_;
        },
        set(input) {
            if (this.host_ == null || this.host_ === '' || this.protocol_ === 'file:') {
                return;
            }
            const usname_ = escape(input);
            this.c_info.username = usname_;
            this.username_ = this.c_info.username;
            this.set_href();
        }
    },
    password: {
        enumerable: true,
        configurable: true,
        get() {
            return this.password_;
        },
        set(input) {
            if (this.host_ == null || this.host_ === '' || this.protocol_ === 'file:') {
                return;
            }
            const passwd_ = escape(input);
            this.c_info.password = passwd_;
            this.password_ = this.c_info.password;
            this.set_href();
        }
    },
    hash: {
        enumerable: true,
        configurable: true,
        get() {
            return this.hash_;
        },
        set(fragment) {
            const fragment_ = encodeURI(fragment);
            this.c_info.hash = fragment_;
            this.hash_ = this.c_info.hash;
            this.set_href();
        }
    },
    search: {
        enumerable: true,
        configurable: true,
        get() {
            return this.search_;
        },
        set(query) {
            const query_ = encodeURI(query);
            this.c_info.search = query_;
            this.search_ = this.c_info.search;
            this.searchParamsClass_.updateParams(this.search_);
            this.set_href();
        }
    },
    hostname: {
        enumerable: true,
        configurable: true,
        get() {
            return this.hostname_;
        },
        set(hostname) {
            this.c_info.hostname = hostname;
            if (this.c_info.GetIsIpv6) {
                this.hostname_ = this.c_info.hostname;
            } else {
                this.hostname_ = encodeURI(this.c_info.hostname);
            }
            this.set_href();
        }
    },
    host: {
        enumerable: true,
        configurable: true,
        get() {
            return this.host_;
        },
        set(host_) {
            this.c_info.host = host_;
            if (this.c_info.GetIsIpv6) {
                this.host_ = this.c_info.host;
                this.hostname_ = this.c_info.hostname;
                this.port_ = this.c_info.port;
            } else {
                this.host_ = encodeURI(this.c_info.host);
                this.hostname_ = encodeURI(this.c_info.hostname);
                this.port_ = this.c_info.port;
            }
            this.set_href();
        }
    },
    port: {
        enumerable: true,
        configurable: true,
        get() {
            return this.port_;
        },
        set(port) {
            if (this.host_ === '' || this.protocol_ === 'file:' || port === '') {
                return;
            }
            this.c_info.port = port;
            this.port_ = this.c_info.port;
            this.set_href();
        }
    },
    href: {
        enumerable: true,
        configurable: true,
        get() {
            return this.href_;
        },
        set(href_) {
            this.c_info.href(href_);
            if (this.c_info.onOrOff) {
                this.search_ = encodeURI(this.c_info.search);
                this.username_ = encodeURI(this.c_info.username);
                this.password_ = encodeURI(this.c_info.password);
                if (this.c_info.GetIsIpv6) {
                    this.hostname_ = this.c_info.hostname;
                    this.host_ = this.c_info.host;
                } else {
                    this.hostname_ = encodeURI(this.c_info.hostname);
                    this.host_ = encodeURI(this.c_info.host);
                }
                this.hash_ = encodeURI(this.c_info.hash);
                this.protocol_ = encodeURI(this.c_info.protocol);
                this.pathname_ = encodeURI(this.c_info.pathname);
                this.port_ = this.c_info.port;
                this.origin_ = this.protocol_ + '//' + this.host_;
                this.searchParamsClass_.updateParams(this.search_);
                this.set_href();
            }
            return this.href_;
        }
    },
    pathname: {
        enumerable: true,
        configurable: true,
        get() {
            return this.pathname_;
        },
        set(path) {
            const path_ = encodeURI(path);
            this.c_info.pathname = path_;
            this.pathname_ = this.c_info.pathname;
            this.set_href();
        }
    },
    toJSON: {
        writable: true,
        enumerable: true,
        configurable: true,
        value: function toJSON() {
            return this.href_;
        }
    },
    searchParams: {
        enumerable: true,
        configurable: true,
        get() {
            return this.searchParamsClass_;
        }
    }
});

export default {
    URLSearchParams: URLSearchParams,
    URL: URL,
}
