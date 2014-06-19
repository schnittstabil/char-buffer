(function (root, factory) {
  // Browser globals
  var cbSuite = factory();
  root.CharBuffer = cbSuite.global;
  root.CharBuffer.require = cbSuite.require;
  root.CharBuffer.define = cbSuite.define;
}(this, function () {
/**
 * @license almond 0.2.9 Copyright (c) 2011-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);
                name = name.split('/');
                lastIndex = name.length - 1;

                // Node .js allowance:
                if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                    name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                }

                name = baseParts.concat(name);

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("../../node_modules/almond/almond", function(){});

define('char-buffer/abstract-char-buffer',['require','exports','module'],function (require, exports, module) {
/**
  * @class CharBuffer.AbstractCharBuffer
  * @abstract
  *
  * Base class for all CharBuffers.
  */

/**
  * @method constructor
  *
  * @param {Number} initCapacity The initial capacity (i.e. the expected
  *     {@link String#length length} of the {@link String} represented by this
  *     buffer).
  */
function AbstractCharBuffer(initCapacity) {
  if (!(this instanceof AbstractCharBuffer)) {
    return new AbstractCharBuffer(initCapacity);
  }
}

/* istanbul ignore if: IE-fix */
if (!AbstractCharBuffer.name) {
  AbstractCharBuffer.name = 'AbstractCharBuffer';
}

/**
  * @chainable
  * @abstract
  *
  * Appends a charCode to the buffer. The length of the buffer increases by 1.
  *
  * @param {Number} charCode The charCode to append.
  */
AbstractCharBuffer.prototype.append = undefined;

/**
  * @chainable
  * @abstract
  *
  * Write a charCode to the buffer at an offset.
  *
  * @param {Number} charCode The charCode to write.
  * @param {Number} offset The zero based offset to write at.
  * @throws {Error} if offset < 0 or offset > this.length
  */
AbstractCharBuffer.prototype.write = undefined;

/**
  * @abstract
  *
  * Read the charCode at an offset.
  *
  * @param {Number} offset The zero based offset.
  * @return {Number} The charCode.
  * @throws {Error} if offset < 0 or offset >= this.length
  */
AbstractCharBuffer.prototype.read = undefined;

/**
  * @abstract
  *
  * Read the charCode at an offset.
  *
  * @param {Number} offset The zero based offset.
  * @return {Number} The charCode.
  * @throws {Error} if offset < 0 or offset >= this.length
  */
AbstractCharBuffer.prototype.charCodeAt = undefined;

/**
  * @abstract
  *
  * Read the char at an offset.
  *
  * @param {Number} offset The zero based offset.
  * @return {String} The char.
  * @throws {Error} if offset < 0 or offset >= this.length
  */
AbstractCharBuffer.prototype.charAt = undefined;

/**
  * @property {Number} length Length of the {@link String} represented by this buffer.
  * @readonly
  */
AbstractCharBuffer.prototype.length = 0;

/**
  * @abstract
  *
  * Gets the length of the {@link String} represented by this buffer.
  * @return {Number} The length of the {@link String}.
  */
AbstractCharBuffer.prototype.getLength = function() {
  return this.length;
};

/**
  * @chainable
  *
  * Sets the length of the {@link String} represented by this buffer.
  * @param {Number} newLength The new length.
  * @throws {RangeError} if `newLength < 0 || newLength > this.length`
  */
AbstractCharBuffer.prototype.setLength = function(newLength) {
  var msg;
  if (newLength < 0 || newLength > this.length) {
    msg = 'newLength must be between 0 and ' + (this.length);
    msg += ', ' + newLength + ' given.';
    throw new RangeError(msg);
  }
  this.length = newLength;
  return this;
};

/**
  * @abstract
  *
  * Returns the {@link String} represented by this buffer.
  * @return {String} The string.
  */
AbstractCharBuffer.prototype.toString = undefined;

/**
  * @property {Boolean}
  * @static
  * @template
  * Indicates whether this AbstractCharBuffer is supported by the current platform.
  */
AbstractCharBuffer.isSupported = false;

module.exports = AbstractCharBuffer;

});

define('char-buffer/string-buffer',['require','exports','module','./abstract-char-buffer'],function (require, exports, module) {
var AbstractCharBuffer = require('./abstract-char-buffer');

/**
  * @class CharBuffer.StringBuffer
  * @extends CharBuffer.AbstractCharBuffer
  *
  * {@link CharBuffer.AbstractCharBuffer} implementation using a single {@link String}.
  */

/**
  * @method constructor
  *
  * Constructs a StringBuffer representing an empty string.
  */
function StringBuffer() {
  if (!(this instanceof StringBuffer)) {
    return new StringBuffer();
  }
  AbstractCharBuffer.call(this);
  this._buffer = '';
}

StringBuffer.prototype = new AbstractCharBuffer();

/* istanbul ignore if: IE-fix */
if (!StringBuffer.name) {
  StringBuffer.name = 'StringBuffer';
}

/**
  * Write a charCode to the buffer using
  * {@link String#fromCharCode} and {@link String#concat +}.
  *
  * @param {Number} charCode The charCode to append.
  * @param {Number} offset The zero based offset to write at.
  */
StringBuffer.prototype.write = function(charCode, offset) {
  if (typeof offset === 'undefined' || offset === this.length) {
    return this.append(charCode);
  }
  var pre  = this._buffer.slice(0, offset),
      post = this._buffer.slice(offset + 1);
  this._buffer = pre + String.fromCharCode(charCode) + post;
  this.length = this._buffer.length;
  return this;
};

/** */
StringBuffer.prototype.append = function(charCode) {
  this._buffer += String.fromCharCode(charCode);
  this.length = this._buffer.length;
  return this;
};

/** */
StringBuffer.prototype.charCodeAt = function(offset) {
  return this._buffer.charCodeAt(offset);
};

/** */
StringBuffer.prototype.charAt = function(offset) {
  return this._buffer.charAt(offset);
};

/** */
StringBuffer.prototype.read = StringBuffer.prototype.charCodeAt;

/** */
StringBuffer.prototype.setLength = function(newLength) {
  this.constructor.prototype.setLength.call(this, newLength);
  this._buffer = this._buffer.slice(0, this.length);
  return this;
};

/**
  * Returns the internal {@link String}.
  * @return {String} The string.
  */
StringBuffer.prototype.toString = function() {
  return this._buffer;
};

/**
  * @inheritdoc CharBuffer.AbstractCharBuffer#isSupported
  * @static
  */
StringBuffer.isSupported = true;

module.exports = StringBuffer;

});

define('char-buffer/string-array-buffer',['require','exports','module','./abstract-char-buffer'],function (require, exports, module) {
var AbstractCharBuffer = require('./abstract-char-buffer');

/**
  * @class CharBuffer.StringArrayBuffer
  * @extends CharBuffer.AbstractCharBuffer
  *
  * {@link CharBuffer.AbstractCharBuffer} implementation using an {@link Array} of
  * {@link String}s.
  */

/**
  * @method constructor
  *
  * Constructs a StringArrayBuffer representing an empty {@link String}.
  * @param {Number} initCapacity The initial capacity (i.e. the expected
  *     {@link String#length length} of the {@link String} represented by this
  *     buffer).
  */
function StringArrayBuffer(initCapacity) {
  if (!(this instanceof StringArrayBuffer)) {
    return new StringArrayBuffer(initCapacity);
  }
  AbstractCharBuffer.call(this);
  initCapacity = initCapacity || 16;
  this._buffer = new Array(initCapacity);
}

StringArrayBuffer.prototype = new AbstractCharBuffer();

/* istanbul ignore if: IE-fix */
if (!StringArrayBuffer.name) {
  StringArrayBuffer.name = 'StringArrayBuffer';
}

/**
  * Write a charCode to the buffer using
  * {@link String#fromCharCode} and {@link Array#push []}.
  *
  * @param {Number} charCode The charCode to append.
  * @param {Number} offset The zero based offset to write at.
  */
StringArrayBuffer.prototype.write = function(charCode, offset) {
  if (typeof offset === 'undefined') {
    offset = this.length;
  }
  this._buffer[offset] = String.fromCharCode(charCode);
  this.length = offset + 1 > this.length ? offset + 1 : this.length;
  return this;
};

/** */
StringArrayBuffer.prototype.append = StringArrayBuffer.prototype.write;

/** */
StringArrayBuffer.prototype.read = function(offset) {
  return this._buffer[offset].charCodeAt(0);
};

/** */
StringArrayBuffer.prototype.charAt = function(offset) {
  return this._buffer[offset];
};

/** */
StringArrayBuffer.prototype.charCodeAt = StringArrayBuffer.prototype.read;

/**
  * Returns the {@link String} represented by this buffer.
  * @return {String} The string.
  */
StringArrayBuffer.prototype.toString = function() {
  return this._buffer.slice(0, this.length).join('');
};

/**
  * @inheritdoc CharBuffer.AbstractCharBuffer#isSupported
  * @static
  */
StringArrayBuffer.isSupported = true;

module.exports = StringArrayBuffer;

});

define('char-buffer/typed-array-buffer',['require','exports','module','./abstract-char-buffer'],function (require, exports, module) {
var AbstractCharBuffer = require('./abstract-char-buffer');

/**
  * @class CharBuffer.TypedArrayBuffer
  * @extends CharBuffer.AbstractCharBuffer
  *
  * {@link CharBuffer.AbstractCharBuffer} implementation using a [Typed Array][1]
  * (more precisely an [Uint16Array][2]]).
  *
  * [1]: https://www.khronos.org/registry/typedarray/specs/latest/
  * [2]: https://developer.mozilla.org/en-US/docs/Web/API/Uint16Array
  */

/**
  * @method constructor
  *
  * Constructs a NodeBuffer representing an empty {@link String}.
  * @param {Number} initCapacity The initial capacity (i.e. the expected
  *     {@link String#length length} of the {@link String} represented by this
  *     buffer).
  */
function TypedArrayBuffer(initCapacity) {
  if (!(this instanceof TypedArrayBuffer)) {
    return new TypedArrayBuffer(initCapacity);
  }
  AbstractCharBuffer.call(this);
  initCapacity = initCapacity || 16;
  this._buffer = new Uint16Array(initCapacity);
}

TypedArrayBuffer.prototype = new AbstractCharBuffer();

/* istanbul ignore if: IE-fix */
if (!TypedArrayBuffer.name) {
  TypedArrayBuffer.name = 'TypedArrayBuffer';
}

/**
  * @method _ensureCapacity
  * @protected
  *
  * Ensures a minimum capacity.
  * @param {Number} minCapacity The minimum capacity (i.e. the expected
  *     {@link String#length length} of the {@link String} this buffer may
  *     represent).
  */
TypedArrayBuffer.prototype._ensureCapacity = function(minCapacity) {
  if (this._buffer.length < minCapacity) {
    if (minCapacity < this._buffer.length * 2) {
      minCapacity = this._buffer.length * 2; // i.e. double the capacity (!)
    }
    var buffer = new Uint16Array(minCapacity);
    buffer.set(this._buffer);
    this._buffer = buffer;
  }
};

/**
  * Appends a charCode to the buffer using [...].
  *
  * @param {Number} charCode The charCode to append.
  * @param {Number} offset The zero based offset to write at.
  */
TypedArrayBuffer.prototype.write = function(charCode, offset) {
  if (typeof offset === 'undefined') {
    offset = this.length;
  }
  this._ensureCapacity(offset + 1);
  this._buffer[offset] = charCode;
  this.length = offset + 1 > this.length ? offset + 1 : this.length;
  return this;
};

/** */
TypedArrayBuffer.prototype.append = TypedArrayBuffer.prototype.write;

/** */
TypedArrayBuffer.prototype.read = function(offset) {
  return this._buffer[offset];
};

/** */
TypedArrayBuffer.prototype.charCodeAt = TypedArrayBuffer.prototype.read;

/** */
TypedArrayBuffer.prototype.charAt = function(offset) {
  return String.fromCharCode(this.read(offset));
};

// jshint -W101
/**
  * Returns the {@link String} represented by this buffer using
  * {@link String#fromCharCode}.
  *
  * For details see:
  *
  * - [How to convert ArrayBuffer to and from String][1]
  * - [WebKit Bug 80797 - Argument length limited to 65536 ][2]
  *
  * [1]: http://updates.html5rocks.com/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
  * [2]: https://bugs.webkit.org/show_bug.cgi?id=80797
  *
  * @return {String} The string.
  */
TypedArrayBuffer.prototype.toString = function() {
// jshint +W101
  var ARGS_MAX = 65535,
      len = this.length,
      buf = '',
      startPos = 0,
      endPos = 0;

  if (len <= ARGS_MAX) {
    return String.fromCharCode.apply(
        null,
        this._buffer.subarray(startPos, len)
      );
  }

  do {
    startPos = endPos;
    endPos += ARGS_MAX;
    if (endPos > len) {
      endPos = len;
    }
    buf += String.fromCharCode.apply(
        null,
        this._buffer.subarray(startPos, endPos)
      );
  } while (endPos < len);

  return buf;
};

/**
  * @inheritdoc CharBuffer.AbstractCharBuffer#isSupported
  * @static
  */
TypedArrayBuffer.isSupported = (function() {
  try {
    return String.fromCharCode.apply(null, new Uint16Array()) === '';
  } catch (err) {
    /* istanbul ignore next */
    return false;
  }
}());

module.exports = TypedArrayBuffer;

});

define('char-buffer/node-buffer',['require','exports','module','./abstract-char-buffer'],function (require, exports, module) {
var AbstractCharBuffer = require('./abstract-char-buffer');

/**
  * @class CharBuffer.NodeBuffer
  * @extends CharBuffer.AbstractCharBuffer
  *
  * {@link CharBuffer.AbstractCharBuffer} implementation using a [Node.js Buffer][1].
  *
  * [1]: http://nodejs.org/api/buffer.html
  */

/**
  * @method constructor
  *
  * Constructs a NodeBuffer representing an empty {@link String}.
  * @param {Number} initCapacity The initial capacity (i.e. the expected
  *     {@link String#length length} of the {@link String} represented by this
  *     buffer).
  */
function NodeBuffer(initCapacity) {
  if (!(this instanceof NodeBuffer)) {
    return new NodeBuffer(initCapacity);
  }
  AbstractCharBuffer.call(this);
  initCapacity = initCapacity || 16;
  this._buffer = new Buffer(initCapacity * 2);
}

NodeBuffer.prototype = new AbstractCharBuffer();

/* istanbul ignore if: IE-fix */
if (!NodeBuffer.name) {
  NodeBuffer.name = 'NodeBuffer';
}

/**
  * @method _ensureCapacity
  * @protected
  *
  * Ensures a minimum capacity.
  * @param {Number} minCapacity The minimum capacity (i.e. the expected
  *     {@link String#length length} of the {@link String} this buffer may
  *     represent).
  */
NodeBuffer.prototype._ensureCapacity = function(minCapacity) {
  if (this._buffer.length < minCapacity * 2) {
    if (minCapacity < this._buffer.length) {
      minCapacity = this._buffer.length; // i.e. double the capacity (!)
    }
    var buffer = new Buffer(minCapacity * 2);
    this._buffer.copy(buffer);
    this._buffer = buffer;
  }
};

/**
  * Write a charCode to the buffer using
  * [Buffer.writeUInt16LE(charCode, ...)][1].
  *
  * [1]: http://nodejs.org/api/buffer.html#buffer_buf_writeuint16le_value_offset_noassert
  * @param {Number} charCode The charCode to append.
  * @param {Number} offset The zero based offset to write at.
  */
NodeBuffer.prototype.write = function(charCode, offset) {
  if (typeof offset === 'undefined') {
    offset = this.length;
  }
  this._ensureCapacity(offset + 1);
  this._buffer.writeUInt16LE(charCode, offset * 2);
  this.length = offset + 1 > this.length ? offset + 1 : this.length;
  return this;
};

/** */
NodeBuffer.prototype.append = NodeBuffer.prototype.write;

/** */
NodeBuffer.prototype.read = function(offset) {
  return this._buffer.readUInt16LE(offset * 2);
};

/** */
NodeBuffer.prototype.charCodeAt = NodeBuffer.prototype.read;

/** */
NodeBuffer.prototype.charAt = function(offset) {
  return String.fromCharCode(this.read(offset));
};

/**
  * Returns the {@link String} represented by this buffer using
  * [Buffer.toString('utf16le', ...)][1].
  *
  * [1]: http://nodejs.org/api/buffer.html#buffer_buf_tostring_encoding_start_end
  *
  * @return {String} The string.
  */
NodeBuffer.prototype.toString = function() {
  return this._buffer.toString('utf16le', 0, this.length * 2);
};

/**
  * @inheritdoc CharBuffer.AbstractCharBuffer#isSupported
  * @static
  */
NodeBuffer.isSupported = (function() {
  try {
    var buffer = new Buffer('A', 'utf16le');
    return buffer.readUInt16LE(0) === 65;
  } catch (e) {
    /* istanbul ignore next */
    return false;
  }
}());

module.exports = NodeBuffer;

});

define('char-buffer/index',['require','exports','module','./abstract-char-buffer','./string-buffer','./string-array-buffer','./typed-array-buffer','./node-buffer'],function (require, exports, module) {
var AbstractCharBuffer = require('./abstract-char-buffer');
var StringBuffer = require('./string-buffer');
var StringArrayBuffer = require('./string-array-buffer');
var TypedArrayBuffer = require('./typed-array-buffer');
var NodeBuffer = require('./node-buffer');

/**
  * @class CharBuffer
  */

/**
  * @method constructor
  *
  * Construct the {@link CharBuffer#_default} object.
  *
  * @param {Number} initCapacity The initial capacity (i.e. the expected
  *   {@link String#length length} of the {@link String} represented by this
  *   buffer).
  */
function CharBuffer(initCapacity) {
  return CharBuffer._default.call(this, initCapacity);
}

/* istanbul ignore if: IE-fix */
if (!CharBuffer.name) {
  CharBuffer.name = 'CharBuffer';
}

/**
  * @property {CharBuffer[]} CharBuffers
  * @static
  *
  * Array of all {@link CharBuffer.AbstractCharBuffer} implementations.
  */
CharBuffer.CharBuffers = [
  AbstractCharBuffer,
  StringBuffer,
  StringArrayBuffer,
  TypedArrayBuffer,
  NodeBuffer
];

/**
  * @property {String[]} [supported=["StringBuffer", "StringArrayBuffer",
  *   "TypedArrayBuffer", "NodeBuffer"]]
  * @static
  *
  * Names of the supported {@link CharBuffer.AbstractCharBuffer} implementations of the
  * current platform.
  */
CharBuffer.supported = [];

/**
  * @property {CharBuffer.AbstractCharBuffer} [_default=
  *   CharBuffers.filter(isSupported).last()]
  * @static
  * @private
  *
  * The default implementation of the current platform.
  * See [High-performance String Concatenation in JavaScript][1].
  *
  * [1]: http://www.sitepoint.com/javascript-fast-string-concatenation
  */
CharBuffer._default = null;

var i,
    buffer;

// last supported {@link CharBuffer.CharBuffers} becomes
// {@link CharBuffer._default}
for (i = 0; i < CharBuffer.CharBuffers.length; i++) {
  buffer = CharBuffer.CharBuffers[i];

  /* istanbul ignore else */
  if (buffer.isSupported) {
    CharBuffer.supported.push(buffer.name);
    CharBuffer._default = buffer;
  }

  // export buffer
  CharBuffer[buffer.name] = buffer;
}

/* istanbul ignore next */
/**
  * @property {Boolean}
  * @static
  * Indicates whether any CharBuffer is supported by the current platform.
  */
CharBuffer.isSupported = CharBuffer._default ? CharBuffer._default.isSupported : false;

module.exports = CharBuffer;

});

define('char-buffer',['require','exports','module','./char-buffer/index'],function (require, exports, module) {
/*
 * Facade for AMD etc.
 */
var Facade = require('./char-buffer/index');
module.exports = Facade;

});

  return {
    global: require('char-buffer'),
    require: require,
    define: define
  };
}));
