var rigmarole=function(t){function e(n){if(r[n])return r[n].exports;var i=r[n]={i:n,l:!1,exports:{}};return t[n].call(i.exports,i,i.exports,e),i.l=!0,i.exports}var r={};return e.m=t,e.c=r,e.d=function(t,r,n){e.o(t,r)||Object.defineProperty(t,r,{configurable:!1,enumerable:!0,get:n})},e.n=function(t){var r=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(r,"a",r),r},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=0)}([function(t,e,r){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t){if(Array.isArray(t)){for(var e=0,r=Array(t.length);e<t.length;e++)r[e]=t[e];return r}return Array.from(t)}function o(t,e){return v.setIn(e,t.keyPath,v(t.value))}function s(t,e){var r=h(t),n=r[0],i=null;if(1===r.length)i=e[n];else if(r.length>1){var o=r.slice(1,r.length);i=s(o,e[n])}return i}function a(t){return t===t}function u(t,e){var r=t.slice(0,t.length-1),n=t.slice(t.length-1)[0],u=a(parseFloat(n))?parseFloat(n):n,h=s(r,e);return o(c(r,Array.isArray(h)?[].concat(i(h.slice(0,u)),i(h.slice(u+1,h.length))):v.without(h,u)),e)}function c(){var t=Array.prototype.slice.call(arguments,0,arguments.length-1),e=void 0;e=1===t.length?t[0]:t;var r=arguments[arguments.length-1];return{keyPath:h(e),value:r}}function h(t){var e=[];return"string"!=typeof arguments&&arguments.length>1?e=Array.prototype.slice.call(arguments,0):"string"!=typeof t&&t.length?e=t:"string"==typeof t&&(e=t.split(/,|\./)),e}function l(t){return h(t).join(".")}Object.defineProperty(e,"__esModule",{value:!0});var f=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),y=r(1),p=function(t){return t&&t.__esModule?t:{default:t}}(y),v=p.default.static,d=function(){function t(e){n(this,t),this.reset(),this._maxSize=e||1e3}return f(t,[{key:"getIndex",value:function(){return this._historyIndex}},{key:"hasUndo",value:function(){return this._historyIndex>0}},{key:"hasRedo",value:function(){return this._historyIndex<this._history.length-1}},{key:"operation",value:function(t,e){this._history=this._history.slice(0,this._historyIndex+1);var r=this._history[this._historyIndex]||{},n=r.data||new v({}),i=e(n);return this._history.push({keyPaths:[l(t)],data:v.isImmutable(i)?i:v(i)}),this._history.length<=this._maxSize?this._historyIndex++:this._history=this._history.slice(1),l(t)}},{key:"mutateOperation",value:function(t,e){var r=this._history[this._historyIndex]||{},n=r.data||new v({}),o=e(n),s=l(t),a=-1===r.keyPaths.indexOf(s)?[].concat(i(r.keyPaths),[s]):r.keyPaths;return this._history.splice(this._historyIndex,1,{keyPaths:a,data:v.isImmutable(o)?o:v(o)}),l(t)}},{key:"ingest",value:function(t){this.operation("",function(){return new v(t)})}},{key:"setDirty",value:function(){this._isDirty=!0}},{key:"clearDirty",value:function(){this._isDirty=!1}},{key:"set",value:function(t,e){var r=c(t,e);return!0===this._isDirty?(this.clearDirty(),this.mutateOperation(r.keyPath,function(t){return o(r,t)})):this.operation(r.keyPath,function(t){return o(r,t)})}},{key:"replace",value:function(t,e){var r=c(t,e);return!1===this._isDirty?(this.setDirty(),this.operation(r.keyPath,function(t){return o(r,t)})):this.mutateOperation(r.keyPath,function(t){return o(r,t)})}},{key:"delete",value:function(t){var e=h(t);return this.operation(e,function(t){return u(e,t)})}},{key:"get",value:function(t){var e=h(t),r=e[0],n=null;if(1===e.length)n=this._history[this._historyIndex]?this._history[this._historyIndex].data[r]:null;else if(e.length>1){var i=e.slice(1,e.length);n=this._history[this._historyIndex]?s(i,this._history[this._historyIndex].data[r]):null}return n}},{key:"getMutable",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{deep:!0};return v.asMutable(this.get(t),e)}},{key:"undo",value:function(){var t=[];return this._historyIndex>0?(t=this._history[this._historyIndex].keyPaths,this._historyIndex--):console.warn("Reached as far back as possible."),t}},{key:"redo",value:function(){var t=[];return this._historyIndex<this._history.length-1?(this._historyIndex++,t=this._history[this._historyIndex].keyPaths):console.warn("Latest state."),t}},{key:"reset",value:function(){this._history=[],this._historyIndex=-1,this._isDirty=!1}}]),t}();e.default=d},function(t,e,r){var n;!function(){"use strict";function i(t){function e(t){var e=Object.getPrototypeOf(t);return e?Object.create(e):{}}function r(t,e,r){Object.defineProperty(t,e,{enumerable:!1,configurable:!1,writable:!1,value:r})}function n(t,e){r(t,e,function(){throw new c("The "+e+" method cannot be invoked on an Immutable data structure.")})}function o(t){r(t,L,!0)}function s(t){return"object"!=typeof t||(null===t||Boolean(Object.getOwnPropertyDescriptor(t,L)))}function a(t,e){return t===e||t!==t&&e!==e}function u(t){return!(null===t||"object"!=typeof t||Array.isArray(t)||t instanceof Date)}function c(t){this.name="MyError",this.message=t,this.stack=(new Error).stack}function h(t,e){o(t);for(var r in e)e.hasOwnProperty(r)&&n(t,e[r]);return Object.freeze(t),t}function l(t,e){var n=t[e];r(t,e,function(){return R(n.apply(t,arguments))})}function f(t,e,r){var n=r&&r.deep;if(t in this&&(n&&this[t]!==e&&u(e)&&u(this[t])&&(e=R.merge(this[t],e,{deep:!0,mode:"replace"})),a(this[t],e)))return this;var i=m.call(this);return i[t]=R(e),p(i)}function y(t,e,r){var n=t[0];if(1===t.length)return f.call(this,n,e,r);var i,o=t.slice(1),s=this[n];if("object"==typeof s&&null!==s)i=R.setIn(s,o,e);else{var a=o[0];i=""!==a&&isFinite(a)?y.call(W,o,e):P.call(X,o,e)}if(n in this&&s===i)return this;var u=m.call(this);return u[n]=i,p(u)}function p(t){for(var e in Q)if(Q.hasOwnProperty(e)){var n=Q[e];l(t,n)}N.use_static||(r(t,"flatMap",g),r(t,"asObject",_),r(t,"asMutable",m),r(t,"set",f),r(t,"setIn",y),r(t,"update",x),r(t,"updateIn",D),r(t,"getIn",M));for(var i=0,o=t.length;i<o;i++)t[i]=R(t[i]);return h(t,K)}function v(t){return N.use_static||r(t,"asMutable",d),h(t,V)}function d(){return new Date(this.getTime())}function g(t){if(0===arguments.length)return this;var e,r=[],n=this.length;for(e=0;e<n;e++){var i=t(this[e],e,this);Array.isArray(i)?r.push.apply(r,i):r.push(i)}return p(r)}function b(t){if(void 0===t&&0===arguments.length)return this;if("function"!=typeof t){var r=Array.isArray(t)?t.slice():Array.prototype.slice.call(arguments);r.forEach(function(t,e,r){"number"==typeof t&&(r[e]=t.toString())}),t=function(t,e){return-1!==r.indexOf(e)}}var n=e(this);for(var i in this)this.hasOwnProperty(i)&&!1===t(this[i],i)&&(n[i]=this[i]);return S(n)}function m(t){var e,r,n=[];if(t&&t.deep)for(e=0,r=this.length;e<r;e++)n.push(w(this[e]));else for(e=0,r=this.length;e<r;e++)n.push(this[e]);return n}function _(t){"function"!=typeof t&&(t=function(t){return t});var e,r={},n=this.length;for(e=0;e<n;e++){var i=t(this[e],e,this),o=i[0],s=i[1];r[o]=s}return S(r)}function w(t){return!t||"object"!=typeof t||!Object.getOwnPropertyDescriptor(t,L)||t instanceof Date?t:R.asMutable(t,{deep:!0})}function O(t,e){for(var r in t)Object.getOwnPropertyDescriptor(t,r)&&(e[r]=t[r]);return e}function I(t,r){function n(t,n,o){var s=R(n[o]),h=l&&l(t[o],s,r),f=t[o];if(void 0!==i||void 0!==h||!t.hasOwnProperty(o)||!a(s,f)){var y;y=h||(c&&u(f)&&u(s)?R.merge(f,s,r):s),a(f,y)&&t.hasOwnProperty(o)||(void 0===i&&(i=O(t,e(t))),i[o]=y)}}if(0===arguments.length)return this;if(null===t||"object"!=typeof t)throw new TypeError("Immutable#merge can only be invoked with objects or arrays, not "+JSON.stringify(t));var i,o,s=Array.isArray(t),c=r&&r.deep,h=r&&r.mode||"merge",l=r&&r.merger;if(s)for(var f=0,y=t.length;f<y;f++){var p=t[f];for(o in p)p.hasOwnProperty(o)&&n(void 0!==i?i:this,p,o)}else{for(o in t)Object.getOwnPropertyDescriptor(t,o)&&n(this,t,o);"replace"===h&&function(t,r){for(var n in t)r.hasOwnProperty(n)||(void 0===i&&(i=O(t,e(t))),delete i[n])}(this,t)}return void 0===i?this:S(i)}function k(t,e){var r=e&&e.deep;if(0===arguments.length)return this;if(null===t||"object"!=typeof t)throw new TypeError("Immutable#replace can only be invoked with objects or arrays, not "+JSON.stringify(t));return R.merge(this,t,{deep:r,mode:"replace"})}function P(t,r,n){if(!Array.isArray(t)||0===t.length)throw new TypeError('The first argument to Immutable#setIn must be an array containing at least one "key" string.');var i=t[0];if(1===t.length)return j.call(this,i,r,n);var o,s=t.slice(1),a=this[i];if(o=this.hasOwnProperty(i)&&"object"==typeof a&&null!==a?R.setIn(a,s,r):P.call(X,s,r),this.hasOwnProperty(i)&&a===o)return this;var u=O(this,e(this));return u[i]=o,S(u)}function j(t,r,n){var i=n&&n.deep;if(this.hasOwnProperty(t)&&(i&&this[t]!==r&&u(r)&&u(this[t])&&(r=R.merge(this[t],r,{deep:!0,mode:"replace"})),a(this[t],r)))return this;var o=O(this,e(this));return o[t]=R(r),S(o)}function x(t,e){var r=Array.prototype.slice.call(arguments,2),n=this[t];return R.set(this,t,e.apply(n,[n].concat(r)))}function A(t,e){for(var r=0,n=e.length;null!=t&&r<n;r++)t=t[e[r]];return r&&r==n?t:void 0}function D(t,e){var r=Array.prototype.slice.call(arguments,2),n=A(this,t);return R.setIn(this,t,e.apply(n,[n].concat(r)))}function M(t,e){var r=A(this,t);return void 0===r?e:r}function T(t){var r,n=e(this);if(t&&t.deep)for(r in this)this.hasOwnProperty(r)&&(n[r]=w(this[r]));else for(r in this)this.hasOwnProperty(r)&&(n[r]=this[r]);return n}function E(){return{}}function S(t){return N.use_static||(r(t,"merge",I),r(t,"replace",k),r(t,"without",b),r(t,"asMutable",T),r(t,"set",j),r(t,"setIn",P),r(t,"update",x),r(t,"updateIn",D),r(t,"getIn",M)),h(t,q)}function C(t){return"object"==typeof t&&null!==t&&(t.$$typeof===J||t.$$typeof===Y)}function U(t){return"undefined"!=typeof File&&t instanceof File}function F(t){return"undefined"!=typeof Blob&&t instanceof Blob}function z(t){return"object"==typeof t&&"function"==typeof t.then}function B(t){return t instanceof Error}function R(t,e,r){if(s(t)||C(t)||U(t)||F(t)||B(t))return t;if(z(t))return t.then(R);if(Array.isArray(t))return p(t.slice());if(t instanceof Date)return v(new Date(t.getTime()));var n=e&&e.prototype,i=n&&n!==Object.prototype?function(){return Object.create(n)}:E,o=i();if(null==r&&(r=64),r<=0)throw new c("Attempt to construct Immutable from a deeply nested object was detected. Have you tried to wrap an object with circular references (e.g. React element)? See https://github.com/rtfeldman/seamless-immutable/wiki/Deeply-nested-object-was-detected for details.");r-=1;for(var a in t)Object.getOwnPropertyDescriptor(t,a)&&(o[a]=R(t[a],void 0,r));return S(o)}function $(t){function e(){var e=[].slice.call(arguments),r=e.shift();return t.apply(r,e)}return e}function H(t,e){function r(){var r=[].slice.call(arguments),n=r.shift();return Array.isArray(n)?e.apply(n,r):t.apply(n,r)}return r}var Y="function"==typeof Symbol&&Symbol.for&&Symbol.for("react.element"),J=60103,N={use_static:!1};(function(t){return"object"==typeof t&&!Array.isArray(t)&&null!==t})(t)&&void 0!==t.use_static&&(N.use_static=Boolean(t.use_static));var L="__immutable_invariants_hold",q=["setPrototypeOf"],G=["keys"],K=q.concat(["push","pop","sort","splice","shift","unshift","reverse"]),Q=G.concat(["map","filter","slice","concat","reduce","reduceRight"]),V=q.concat(["setDate","setFullYear","setHours","setMilliseconds","setMinutes","setMonth","setSeconds","setTime","setUTCDate","setUTCFullYear","setUTCHours","setUTCMilliseconds","setUTCMinutes","setUTCMonth","setUTCSeconds","setYear"]);c.prototype=new Error,c.prototype.constructor=Error;var W=R([]),X=R({});return R.from=R,R.isImmutable=s,R.ImmutableError=c,R.merge=$(I),R.replace=$(k),R.without=$(b),R.asMutable=function(t,e,r){function n(){var n=[].slice.call(arguments),i=n.shift();return Array.isArray(i)?e.apply(i,n):i instanceof Date?r.apply(i,n):t.apply(i,n)}return n}(T,m,d),R.set=H(j,f),R.setIn=H(P,y),R.update=$(x),R.updateIn=$(D),R.getIn=$(M),R.flatMap=$(g),R.asObject=$(_),N.use_static||(R.static=i({use_static:!0})),Object.freeze(R),R}var o=i();void 0!==(n=function(){return o}.call(e,r,e,t))&&(t.exports=n)}()}]).default;