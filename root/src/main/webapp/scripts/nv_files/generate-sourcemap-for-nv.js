/**
 * Created by correnti on 24/08/2016.
 */
"use strict";

const os = require("os");
const convertSourceMap = require("convert-source-map");
const SourceMapConsumer = require("source-map").SourceMapConsumer;
const SourceMapGenerator = require("source-map").SourceMapGenerator;
const stableSort = require("stable");

function SourceMapper(src, nodePositions, fragments, inFile, sourceRoot) {
    this.generator = new SourceMapGenerator({ sourceRoot: sourceRoot });
    this.src = src;
    // stableSort does not mutate input array so no need to copy it
    this.nodePositions = stableSort(nodePositions, compareLoc);
    this.fragments = stableSort(fragments, function(a, b) { return a.start - b.start });
    this.inFile = inFile;

    this.generator.setSourceContent(this.inFile, src);
}

SourceMapper.prototype.calculateMappings = function() {
    const self = this;

    // These offsets represent the difference in coordinates between a node in the source
    // and the corresponding position in the output.
    var lineOffset = 0;
    var columnOffset = 0;

    // Since the column position resets to zero after each newline, we have to keep track
    // of the current line that columnOffset refers to in order to know whether to reset it
    var currentLine = 0;

    var frag = 0;
    var pos = 0;

    while (pos < self.nodePositions.length) {
        while (frag < self.fragments.length &&
        compareLoc(self.fragments[frag].loc.start, self.nodePositions[pos]) < 1) {

            const fragmentLines = self.fragments[frag].str.split("\n");
            const addedNewlines = fragmentLines.length - 1;

            const replacedLines = self.fragments[frag].loc.end.line - self.fragments[frag].loc.start.line;
            const replacedColumns = self.fragments[frag].loc.end.column - self.fragments[frag].loc.start.column;

            // If there were any lines added by the fragment string, the line offset should increase;
            // If there were any lines removed by the fragment replacement then the line offset should decrease
            lineOffset = lineOffset + addedNewlines - replacedLines;

            // The column position needs to reset after each newline.  So if the fragment added any
            // newlines then the column offset is the difference between the column of the last line of
            // the fragment, and the column of the end of the replaced section of the source.
            // Otherwise we increment or decrement the column offset just like how the line offset works.
            // Note that "replacedColumns" might be negative in some cases (if the beginning of the source
            // was further right than the end due to a newline); the math still works out.
            columnOffset = fragmentLines.length > 1 ?
            fragmentLines[fragmentLines.length - 1].length - self.fragments[frag].loc.end.column :
            columnOffset + self.fragments[frag].str.length - replacedColumns;

            currentLine = self.fragments[frag].loc.end.line;

            // Skip creating mappings for any source nodes that were replaced by this fragment (and are thus
            // no longer a part of the output)
            while (pos < self.nodePositions.length &&
            compareLoc(self.fragments[frag].loc.end, self.nodePositions[pos]) > 0) {
                ++pos;
            }

            ++frag;
        }

        if (pos < self.nodePositions.length) {
            if (currentLine < self.nodePositions[pos].line)
                columnOffset = 0;
            self.addMapping(self.nodePositions[pos], {
                line: self.nodePositions[pos].line + lineOffset,
                column: self.nodePositions[pos].column + columnOffset
            });
            ++pos;
        }
    }
}

SourceMapper.prototype.addMapping = function(input, output) {
    this.generator.addMapping({
        source: this.inFile,
        original: input,
        generated: output
    });
}

SourceMapper.prototype.applySourceMap = function (consumer) {
    this.generator.applySourceMap(consumer);
}

SourceMapper.prototype.generate = function () {
    return this.generator.toString();
}

function compareLoc(a, b) {
    return (a.line - b.line) || (a.column - b.column);
}

module.exports = function generateSourcemap(result, src, nodePositions, fragments, mapOpts) {
    const existingMap = convertSourceMap.fromSource(src);
    const existingMapObject = existingMap && existingMap.toObject();
    const inFile = (existingMapObject && existingMapObject.file) || mapOpts.inFile || "source.js";
    const sourceRoot = (existingMapObject && existingMapObject.sourceRoot) || mapOpts.sourceRoot;
    src = convertSourceMap.removeMapFileComments(src);

    const mapper = new SourceMapper(src, nodePositions, fragments, inFile, sourceRoot);
    mapper.calculateMappings();

    if (mapOpts.inline) {
        if (existingMapObject)
            mapper.applySourceMap(new SourceMapConsumer(existingMapObject));

        result.src = convertSourceMap.removeMapFileComments(result.src) +
            os.EOL +
            convertSourceMap.fromJSON(mapper.generate()).toComment();
    } else {
        result.map = mapper.generate();
    }
}




//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);
//
///**
// * Created by correnti on 24/08/2016.
// */
///**
// * @license AngularJS v1.5.9-build.4999+sha.3d686a9
// * (c) 2010-2016 Google, Inc. http://angularjs.org
// * License: MIT
// */
//(function(window, angular) {'use strict';
//
//    /**
//     * @ngdoc module
//     * @name ngCookies
//     * @description
//     *
//     * # ngCookies
//     *
//     * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
//     *
//     *
//     * <div doc-module-components="ngCookies"></div>
//     *
//     * See {@link ngCookies.$cookies `$cookies`} for usage.
//     */
//
//
//    angular.module('ngCookies', ['ng']).
//    /**
//     * @ngdoc provider
//     * @name $cookiesProvider
//     * @description
//     * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
//     * */
//    provider('$cookies', [/** @this */function $CookiesProvider() {
//        /**
//         * @ngdoc property
//         * @name $cookiesProvider#defaults
//         * @description
//         *
//         * Object containing default options to pass when setting cookies.
//         *
//         * The object may have following properties:
//         *
//         * - **path** - `{string}` - The cookie will be available only for this path and its
//         *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
//         * - **domain** - `{string}` - The cookie will be available only for this domain and
//         *   its sub-domains. For security reasons the user agent will not accept the cookie
//         *   if the current domain is not a sub-domain of this domain or equal to it.
//         * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
//         *   or a Date object indicating the exact date/time this cookie will expire.
//         * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
//         *   secured connection.
//         *
//         * Note: By default, the address that appears in your `<base>` tag will be used as the path.
//         * This is important so that cookies will be visible for all routes when html5mode is enabled.
//         *
//         **/
//        var defaults = this.defaults = {};
//
//        function calcOptions(options) {
//            return options ? angular.extend({}, defaults, options) : defaults;
//        }
//
//        /**
//         * @ngdoc service
//         * @name $cookies
//         *
//         * @description
//         * Provides read/write access to browser's cookies.
//         *
//         * <div class="alert alert-info">
//         * Up until Angular 1.3, `$cookies` exposed properties that represented the
//         * current browser cookie values. In version 1.4, this behavior has changed, and
//         * `$cookies` now provides a standard api of getters, setters etc.
//         * </div>
//         *
//         * Requires the {@link ngCookies `ngCookies`} module to be installed.
//         *
//         * @example
//         *
//         * ```js
//         * angular.module('cookiesExample', ['ngCookies'])
//         *   .controller('ExampleController', ['$cookies', function($cookies) {
//     *     // Retrieving a cookie
//     *     var favoriteCookie = $cookies.get('myFavorite');
//     *     // Setting a cookie
//     *     $cookies.put('myFavorite', 'oatmeal');
//     *   }]);
//         * ```
//         */
//        this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
//            return {
//                /**
//                 * @ngdoc method
//                 * @name $cookies#get
//                 *
//                 * @description
//                 * Returns the value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {string} Raw cookie value.
//                 */
//                get: function(key) {
//                    return $$cookieReader()[key];
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getObject
//                 *
//                 * @description
//                 * Returns the deserialized value of given cookie key
//                 *
//                 * @param {string} key Id to use for lookup.
//                 * @returns {Object} Deserialized cookie value.
//                 */
//                getObject: function(key) {
//                    var value = this.get(key);
//                    return value ? angular.fromJson(value) : value;
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#getAll
//                 *
//                 * @description
//                 * Returns a key value object with all the cookies
//                 *
//                 * @returns {Object} All cookies
//                 */
//                getAll: function() {
//                    return $$cookieReader();
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#put
//                 *
//                 * @description
//                 * Sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {string} value Raw value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                put: function(key, value, options) {
//                    $$cookieWriter(key, value, calcOptions(options));
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#putObject
//                 *
//                 * @description
//                 * Serializes and sets a value for given cookie key
//                 *
//                 * @param {string} key Id for the `value`.
//                 * @param {Object} value Value to be stored.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                putObject: function(key, value, options) {
//                    this.put(key, angular.toJson(value), options);
//                },
//
//                /**
//                 * @ngdoc method
//                 * @name $cookies#remove
//                 *
//                 * @description
//                 * Remove given cookie
//                 *
//                 * @param {string} key Id of the key-value pair to delete.
//                 * @param {Object=} options Options object.
//                 *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
//                 */
//                remove: function(key, options) {
//                    $$cookieWriter(key, undefined, calcOptions(options));
//                }
//            };
//        }];
//    }]);
//
//    angular.module('ngCookies').
//    /**
//     * @ngdoc service
//     * @name $cookieStore
//     * @deprecated
//     * @requires $cookies
//     *
//     * @description
//     * Provides a key-value (string-object) storage, that is backed by session cookies.
//     * Objects put or retrieved from this storage are automatically serialized or
//     * deserialized by angular's toJson/fromJson.
//     *
//     * Requires the {@link ngCookies `ngCookies`} module to be installed.
//     *
//     * <div class="alert alert-danger">
//     * **Note:** The $cookieStore service is **deprecated**.
//     * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
//     * </div>
//     *
//     * @example
//     *
//     * ```js
//     * angular.module('cookieStoreExample', ['ngCookies'])
//     *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
// *     // Put cookie
// *     $cookieStore.put('myFavorite','oatmeal');
// *     // Get cookie
// *     var favoriteCookie = $cookieStore.get('myFavorite');
// *     // Removing a cookie
// *     $cookieStore.remove('myFavorite');
// *   }]);
//     * ```
//     */
//    factory('$cookieStore', ['$cookies', function($cookies) {
//
//        return {
//            /**
//             * @ngdoc method
//             * @name $cookieStore#get
//             *
//             * @description
//             * Returns the value of given cookie key
//             *
//             * @param {string} key Id to use for lookup.
//             * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
//             */
//            get: function(key) {
//                return $cookies.getObject(key);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#put
//             *
//             * @description
//             * Sets a value for given cookie key
//             *
//             * @param {string} key Id for the `value`.
//             * @param {Object} value Value to be stored.
//             */
//            put: function(key, value) {
//                $cookies.putObject(key, value);
//            },
//
//            /**
//             * @ngdoc method
//             * @name $cookieStore#remove
//             *
//             * @description
//             * Remove given cookie
//             *
//             * @param {string} key Id of the key-value pair to delete.
//             */
//            remove: function(key) {
//                $cookies.remove(key);
//            }
//        };
//
//    }]);
//
//    /**
//     * @name $$cookieWriter
//     * @requires $document
//     *
//     * @description
//     * This is a private service for writing cookies
//     *
//     * @param {string} name Cookie name
//     * @param {string=} value Cookie value (if undefined, cookie will be deleted)
//     * @param {Object=} options Object with options that need to be stored for the cookie.
//     */
//    function $$CookieWriter($document, $log, $browser) {
//        var cookiePath = $browser.baseHref();
//        var rawDocument = $document[0];
//
//        function buildCookieString(name, value, options) {
//            var path, expires;
//            options = options || {};
//            expires = options.expires;
//            path = angular.isDefined(options.path) ? options.path : cookiePath;
//            if (angular.isUndefined(value)) {
//                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
//                value = '';
//            }
//            if (angular.isString(expires)) {
//                expires = new Date(expires);
//            }
//
//            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
//            str += path ? ';path=' + path : '';
//            str += options.domain ? ';domain=' + options.domain : '';
//            str += expires ? ';expires=' + expires.toUTCString() : '';
//            str += options.secure ? ';secure' : '';
//
//            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
//            // - 300 cookies
//            // - 20 cookies per unique domain
//            // - 4096 bytes per cookie
//            var cookieLength = str.length + 1;
//            if (cookieLength > 4096) {
//                $log.warn('Cookie \'' + name +
//                    '\' possibly not set or overflowed because it was too large (' +
//                    cookieLength + ' > 4096 bytes)!');
//            }
//
//            return str;
//        }
//
//        return function(name, value, options) {
//            rawDocument.cookie = buildCookieString(name, value, options);
//        };
//    }
//
//    $$CookieWriter.$inject = ['$document', '$log', '$browser'];
//
//    angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
//        this.$get = $$CookieWriter;
//    });
//
//
//})(window, window.angular);