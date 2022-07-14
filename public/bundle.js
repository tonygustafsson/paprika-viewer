
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function not_equal(a, b) {
        return a != a ? b == b : a !== b;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.24.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev("SvelteDOMSetProperty", { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const initValue = {
        loading: true,
        referenceCurrency: 'usd',
        currencySymbol: '$'
    };

    const globalStore = () => {
        const { subscribe, set, update } = writable(initValue);

        return {
            subscribe,
            isLoading: isLoading => {
                update(global => {
                    let newGlobal = { ...global };
                    newGlobal.loading = isLoading;
                    return newGlobal;
                });
            },
            setReferenceCurrency: currency => {
                if (currency !== 'usd' && currency !== 'btc') return;

                update(global => {
                    let newGlobal = { ...global };
                    newGlobal.referenceCurrency = currency;
                    newGlobal.currencySymbol = currency === 'usd' ? '$' : '₿';
                    return newGlobal;
                });
            }
        };
    };

    const global$1 = globalStore();

    const initValue$1 = [];

    const getQuotes = quotes => {
        return {
            price: quotes.price.toFixed(8),
            volume24h: quotes.volume_24h,
            marketCap: quotes.market_cap,
            change1h: quotes.percent_change_1h,
            change12h: quotes.percent_change_12h,
            change24h: quotes.percent_change_24h,
            change7d: quotes.percent_change_7d,
            change30d: quotes.percent_change_30d,
            fromAth: quotes.percent_from_price_ath !== null ? quotes.percent_from_price_ath : '?'
        };
    };

    const getTickerData = ticker => {
        return {
            id: ticker.id,
            symbol: ticker.symbol,
            name: ticker.name,
            rank: ticker.rank,
            usd: getQuotes(ticker.quotes.USD),
            btc: getQuotes(ticker.quotes.BTC),
            exchanges: ticker.exchanges
        };
    };

    const tickersStore = () => {
        const { subscribe, set } = writable(initValue$1);

        return {
            subscribe,
            save: data => {
                const newData = [];
                data.forEach(ticker => newData.push(getTickerData(ticker)));
                set(newData);
            }
        };
    };

    const tickers = tickersStore();

    const apiUrls = {
        tickers: 'https://api.coinpaprika.com/v1/tickers?quotes=USD,BTC',
        globalMarket: 'https://api.coinpaprika.com/v1/global',
        markets: {
            binance: 'https://api.coinpaprika.com/v1/exchanges/binance/markets',
            idex: 'https://api.coinpaprika.com/v1/exchanges/idex/markets',
            idax: 'https://api.coinpaprika.com/v1/exchanges/idax/markets',
            coinbasePro: 'https://api.coinpaprika.com/v1/exchanges/coinbase-pro/markets',
            kraken: 'https://api.coinpaprika.com/v1/exchanges/kraken/markets',
            kucoin: 'https://api.coinpaprika.com/v1/exchanges/kucoin/markets',
            okex: 'https://api.coinpaprika.com/v1/exchanges/okex/markets',
            uniswap: 'https://api.coinpaprika.com/v1/exchanges/uniswap/markets'
        }
    };

    const minVolumeToView = 100; // USD
    const minMarketCapToView = 1000; // USD
    const localStorageDatabaseName = 'paprika-viewer';
    const localStorageTickersTable = 'tickers';
    const localStorageGlobalMarketTable = 'globalMarket';
    const localStorageFavoritesTable = 'favorites';
    const localStorageFetchTimeTablePrefix = 'fetchTime';

    const localStorageCacheTimeout = {
        tickers: 5 * 60 * 1000, // 5 minutes,
        globalMarket: 5 * 60 * 1000, // 5 minutes,
        favorites: 0
    };

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function commonjsRequire () {
    	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
    }

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var localforage = createCommonjsModule(function (module, exports) {
    /*!
        localForage -- Offline Storage, Improved
        Version 1.7.4
        https://localforage.github.io/localForage
        (c) 2013-2017 Mozilla, Apache License 2.0
    */
    (function(f){{module.exports=f();}})(function(){return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof commonjsRequire=="function"&&commonjsRequire;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw (f.code="MODULE_NOT_FOUND", f)}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r);}return n[o].exports}var i=typeof commonjsRequire=="function"&&commonjsRequire;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
    (function (global){
    var Mutation = global.MutationObserver || global.WebKitMutationObserver;

    var scheduleDrain;

    {
      if (Mutation) {
        var called = 0;
        var observer = new Mutation(nextTick);
        var element = global.document.createTextNode('');
        observer.observe(element, {
          characterData: true
        });
        scheduleDrain = function () {
          element.data = (called = ++called % 2);
        };
      } else if (!global.setImmediate && typeof global.MessageChannel !== 'undefined') {
        var channel = new global.MessageChannel();
        channel.port1.onmessage = nextTick;
        scheduleDrain = function () {
          channel.port2.postMessage(0);
        };
      } else if ('document' in global && 'onreadystatechange' in global.document.createElement('script')) {
        scheduleDrain = function () {

          // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
          // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
          var scriptEl = global.document.createElement('script');
          scriptEl.onreadystatechange = function () {
            nextTick();

            scriptEl.onreadystatechange = null;
            scriptEl.parentNode.removeChild(scriptEl);
            scriptEl = null;
          };
          global.document.documentElement.appendChild(scriptEl);
        };
      } else {
        scheduleDrain = function () {
          setTimeout(nextTick, 0);
        };
      }
    }

    var draining;
    var queue = [];
    //named nextTick for less confusing stack traces
    function nextTick() {
      draining = true;
      var i, oldQueue;
      var len = queue.length;
      while (len) {
        oldQueue = queue;
        queue = [];
        i = -1;
        while (++i < len) {
          oldQueue[i]();
        }
        len = queue.length;
      }
      draining = false;
    }

    module.exports = immediate;
    function immediate(task) {
      if (queue.push(task) === 1 && !draining) {
        scheduleDrain();
      }
    }

    }).call(this,typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    },{}],2:[function(_dereq_,module,exports){
    var immediate = _dereq_(1);

    /* istanbul ignore next */
    function INTERNAL() {}

    var handlers = {};

    var REJECTED = ['REJECTED'];
    var FULFILLED = ['FULFILLED'];
    var PENDING = ['PENDING'];

    module.exports = Promise;

    function Promise(resolver) {
      if (typeof resolver !== 'function') {
        throw new TypeError('resolver must be a function');
      }
      this.state = PENDING;
      this.queue = [];
      this.outcome = void 0;
      if (resolver !== INTERNAL) {
        safelyResolveThenable(this, resolver);
      }
    }

    Promise.prototype["catch"] = function (onRejected) {
      return this.then(null, onRejected);
    };
    Promise.prototype.then = function (onFulfilled, onRejected) {
      if (typeof onFulfilled !== 'function' && this.state === FULFILLED ||
        typeof onRejected !== 'function' && this.state === REJECTED) {
        return this;
      }
      var promise = new this.constructor(INTERNAL);
      if (this.state !== PENDING) {
        var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
        unwrap(promise, resolver, this.outcome);
      } else {
        this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
      }

      return promise;
    };
    function QueueItem(promise, onFulfilled, onRejected) {
      this.promise = promise;
      if (typeof onFulfilled === 'function') {
        this.onFulfilled = onFulfilled;
        this.callFulfilled = this.otherCallFulfilled;
      }
      if (typeof onRejected === 'function') {
        this.onRejected = onRejected;
        this.callRejected = this.otherCallRejected;
      }
    }
    QueueItem.prototype.callFulfilled = function (value) {
      handlers.resolve(this.promise, value);
    };
    QueueItem.prototype.otherCallFulfilled = function (value) {
      unwrap(this.promise, this.onFulfilled, value);
    };
    QueueItem.prototype.callRejected = function (value) {
      handlers.reject(this.promise, value);
    };
    QueueItem.prototype.otherCallRejected = function (value) {
      unwrap(this.promise, this.onRejected, value);
    };

    function unwrap(promise, func, value) {
      immediate(function () {
        var returnValue;
        try {
          returnValue = func(value);
        } catch (e) {
          return handlers.reject(promise, e);
        }
        if (returnValue === promise) {
          handlers.reject(promise, new TypeError('Cannot resolve promise with itself'));
        } else {
          handlers.resolve(promise, returnValue);
        }
      });
    }

    handlers.resolve = function (self, value) {
      var result = tryCatch(getThen, value);
      if (result.status === 'error') {
        return handlers.reject(self, result.value);
      }
      var thenable = result.value;

      if (thenable) {
        safelyResolveThenable(self, thenable);
      } else {
        self.state = FULFILLED;
        self.outcome = value;
        var i = -1;
        var len = self.queue.length;
        while (++i < len) {
          self.queue[i].callFulfilled(value);
        }
      }
      return self;
    };
    handlers.reject = function (self, error) {
      self.state = REJECTED;
      self.outcome = error;
      var i = -1;
      var len = self.queue.length;
      while (++i < len) {
        self.queue[i].callRejected(error);
      }
      return self;
    };

    function getThen(obj) {
      // Make sure we only access the accessor once as required by the spec
      var then = obj && obj.then;
      if (obj && (typeof obj === 'object' || typeof obj === 'function') && typeof then === 'function') {
        return function appyThen() {
          then.apply(obj, arguments);
        };
      }
    }

    function safelyResolveThenable(self, thenable) {
      // Either fulfill, reject or reject with error
      var called = false;
      function onError(value) {
        if (called) {
          return;
        }
        called = true;
        handlers.reject(self, value);
      }

      function onSuccess(value) {
        if (called) {
          return;
        }
        called = true;
        handlers.resolve(self, value);
      }

      function tryToUnwrap() {
        thenable(onSuccess, onError);
      }

      var result = tryCatch(tryToUnwrap);
      if (result.status === 'error') {
        onError(result.value);
      }
    }

    function tryCatch(func, value) {
      var out = {};
      try {
        out.value = func(value);
        out.status = 'success';
      } catch (e) {
        out.status = 'error';
        out.value = e;
      }
      return out;
    }

    Promise.resolve = resolve;
    function resolve(value) {
      if (value instanceof this) {
        return value;
      }
      return handlers.resolve(new this(INTERNAL), value);
    }

    Promise.reject = reject;
    function reject(reason) {
      var promise = new this(INTERNAL);
      return handlers.reject(promise, reason);
    }

    Promise.all = all;
    function all(iterable) {
      var self = this;
      if (Object.prototype.toString.call(iterable) !== '[object Array]') {
        return this.reject(new TypeError('must be an array'));
      }

      var len = iterable.length;
      var called = false;
      if (!len) {
        return this.resolve([]);
      }

      var values = new Array(len);
      var resolved = 0;
      var i = -1;
      var promise = new this(INTERNAL);

      while (++i < len) {
        allResolver(iterable[i], i);
      }
      return promise;
      function allResolver(value, i) {
        self.resolve(value).then(resolveFromAll, function (error) {
          if (!called) {
            called = true;
            handlers.reject(promise, error);
          }
        });
        function resolveFromAll(outValue) {
          values[i] = outValue;
          if (++resolved === len && !called) {
            called = true;
            handlers.resolve(promise, values);
          }
        }
      }
    }

    Promise.race = race;
    function race(iterable) {
      var self = this;
      if (Object.prototype.toString.call(iterable) !== '[object Array]') {
        return this.reject(new TypeError('must be an array'));
      }

      var len = iterable.length;
      var called = false;
      if (!len) {
        return this.resolve([]);
      }

      var i = -1;
      var promise = new this(INTERNAL);

      while (++i < len) {
        resolver(iterable[i]);
      }
      return promise;
      function resolver(value) {
        self.resolve(value).then(function (response) {
          if (!called) {
            called = true;
            handlers.resolve(promise, response);
          }
        }, function (error) {
          if (!called) {
            called = true;
            handlers.reject(promise, error);
          }
        });
      }
    }

    },{"1":1}],3:[function(_dereq_,module,exports){
    (function (global){
    if (typeof global.Promise !== 'function') {
      global.Promise = _dereq_(2);
    }

    }).call(this,typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    },{"2":2}],4:[function(_dereq_,module,exports){

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function getIDB() {
        /* global indexedDB,webkitIndexedDB,mozIndexedDB,OIndexedDB,msIndexedDB */
        try {
            if (typeof indexedDB !== 'undefined') {
                return indexedDB;
            }
            if (typeof webkitIndexedDB !== 'undefined') {
                return webkitIndexedDB;
            }
            if (typeof mozIndexedDB !== 'undefined') {
                return mozIndexedDB;
            }
            if (typeof OIndexedDB !== 'undefined') {
                return OIndexedDB;
            }
            if (typeof msIndexedDB !== 'undefined') {
                return msIndexedDB;
            }
        } catch (e) {
            return;
        }
    }

    var idb = getIDB();

    function isIndexedDBValid() {
        try {
            // Initialize IndexedDB; fall back to vendor-prefixed versions
            // if needed.
            if (!idb || !idb.open) {
                return false;
            }
            // We mimic PouchDB here;
            //
            // We test for openDatabase because IE Mobile identifies itself
            // as Safari. Oh the lulz...
            var isSafari = typeof openDatabase !== 'undefined' && /(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent) && !/BlackBerry/.test(navigator.platform);

            var hasFetch = typeof fetch === 'function' && fetch.toString().indexOf('[native code') !== -1;

            // Safari <10.1 does not meet our requirements for IDB support
            // (see: https://github.com/pouchdb/pouchdb/issues/5572).
            // Safari 10.1 shipped with fetch, we can use that to detect it.
            // Note: this creates issues with `window.fetch` polyfills and
            // overrides; see:
            // https://github.com/localForage/localForage/issues/856
            return (!isSafari || hasFetch) && typeof indexedDB !== 'undefined' &&
            // some outdated implementations of IDB that appear on Samsung
            // and HTC Android devices <4.4 are missing IDBKeyRange
            // See: https://github.com/mozilla/localForage/issues/128
            // See: https://github.com/mozilla/localForage/issues/272
            typeof IDBKeyRange !== 'undefined';
        } catch (e) {
            return false;
        }
    }

    // Abstracts constructing a Blob object, so it also works in older
    // browsers that don't support the native Blob constructor. (i.e.
    // old QtWebKit versions, at least).
    // Abstracts constructing a Blob object, so it also works in older
    // browsers that don't support the native Blob constructor. (i.e.
    // old QtWebKit versions, at least).
    function createBlob(parts, properties) {
        /* global BlobBuilder,MSBlobBuilder,MozBlobBuilder,WebKitBlobBuilder */
        parts = parts || [];
        properties = properties || {};
        try {
            return new Blob(parts, properties);
        } catch (e) {
            if (e.name !== 'TypeError') {
                throw e;
            }
            var Builder = typeof BlobBuilder !== 'undefined' ? BlobBuilder : typeof MSBlobBuilder !== 'undefined' ? MSBlobBuilder : typeof MozBlobBuilder !== 'undefined' ? MozBlobBuilder : WebKitBlobBuilder;
            var builder = new Builder();
            for (var i = 0; i < parts.length; i += 1) {
                builder.append(parts[i]);
            }
            return builder.getBlob(properties.type);
        }
    }

    // This is CommonJS because lie is an external dependency, so Rollup
    // can just ignore it.
    if (typeof Promise === 'undefined') {
        // In the "nopromises" build this will just throw if you don't have
        // a global promise object, but it would throw anyway later.
        _dereq_(3);
    }
    var Promise$1 = Promise;

    function executeCallback(promise, callback) {
        if (callback) {
            promise.then(function (result) {
                callback(null, result);
            }, function (error) {
                callback(error);
            });
        }
    }

    function executeTwoCallbacks(promise, callback, errorCallback) {
        if (typeof callback === 'function') {
            promise.then(callback);
        }

        if (typeof errorCallback === 'function') {
            promise["catch"](errorCallback);
        }
    }

    function normalizeKey(key) {
        // Cast the key to a string, as that's all we can set as a key.
        if (typeof key !== 'string') {
            console.warn(key + ' used as a key, but it is not a string.');
            key = String(key);
        }

        return key;
    }

    function getCallback() {
        if (arguments.length && typeof arguments[arguments.length - 1] === 'function') {
            return arguments[arguments.length - 1];
        }
    }

    // Some code originally from async_storage.js in
    // [Gaia](https://github.com/mozilla-b2g/gaia).

    var DETECT_BLOB_SUPPORT_STORE = 'local-forage-detect-blob-support';
    var supportsBlobs = void 0;
    var dbContexts = {};
    var toString = Object.prototype.toString;

    // Transaction Modes
    var READ_ONLY = 'readonly';
    var READ_WRITE = 'readwrite';

    // Transform a binary string to an array buffer, because otherwise
    // weird stuff happens when you try to work with the binary string directly.
    // It is known.
    // From http://stackoverflow.com/questions/14967647/ (continues on next line)
    // encode-decode-image-with-base64-breaks-image (2013-04-21)
    function _binStringToArrayBuffer(bin) {
        var length = bin.length;
        var buf = new ArrayBuffer(length);
        var arr = new Uint8Array(buf);
        for (var i = 0; i < length; i++) {
            arr[i] = bin.charCodeAt(i);
        }
        return buf;
    }

    //
    // Blobs are not supported in all versions of IndexedDB, notably
    // Chrome <37 and Android <5. In those versions, storing a blob will throw.
    //
    // Various other blob bugs exist in Chrome v37-42 (inclusive).
    // Detecting them is expensive and confusing to users, and Chrome 37-42
    // is at very low usage worldwide, so we do a hacky userAgent check instead.
    //
    // content-type bug: https://code.google.com/p/chromium/issues/detail?id=408120
    // 404 bug: https://code.google.com/p/chromium/issues/detail?id=447916
    // FileReader bug: https://code.google.com/p/chromium/issues/detail?id=447836
    //
    // Code borrowed from PouchDB. See:
    // https://github.com/pouchdb/pouchdb/blob/master/packages/node_modules/pouchdb-adapter-idb/src/blobSupport.js
    //
    function _checkBlobSupportWithoutCaching(idb) {
        return new Promise$1(function (resolve) {
            var txn = idb.transaction(DETECT_BLOB_SUPPORT_STORE, READ_WRITE);
            var blob = createBlob(['']);
            txn.objectStore(DETECT_BLOB_SUPPORT_STORE).put(blob, 'key');

            txn.onabort = function (e) {
                // If the transaction aborts now its due to not being able to
                // write to the database, likely due to the disk being full
                e.preventDefault();
                e.stopPropagation();
                resolve(false);
            };

            txn.oncomplete = function () {
                var matchedChrome = navigator.userAgent.match(/Chrome\/(\d+)/);
                var matchedEdge = navigator.userAgent.match(/Edge\//);
                // MS Edge pretends to be Chrome 42:
                // https://msdn.microsoft.com/en-us/library/hh869301%28v=vs.85%29.aspx
                resolve(matchedEdge || !matchedChrome || parseInt(matchedChrome[1], 10) >= 43);
            };
        })["catch"](function () {
            return false; // error, so assume unsupported
        });
    }

    function _checkBlobSupport(idb) {
        if (typeof supportsBlobs === 'boolean') {
            return Promise$1.resolve(supportsBlobs);
        }
        return _checkBlobSupportWithoutCaching(idb).then(function (value) {
            supportsBlobs = value;
            return supportsBlobs;
        });
    }

    function _deferReadiness(dbInfo) {
        var dbContext = dbContexts[dbInfo.name];

        // Create a deferred object representing the current database operation.
        var deferredOperation = {};

        deferredOperation.promise = new Promise$1(function (resolve, reject) {
            deferredOperation.resolve = resolve;
            deferredOperation.reject = reject;
        });

        // Enqueue the deferred operation.
        dbContext.deferredOperations.push(deferredOperation);

        // Chain its promise to the database readiness.
        if (!dbContext.dbReady) {
            dbContext.dbReady = deferredOperation.promise;
        } else {
            dbContext.dbReady = dbContext.dbReady.then(function () {
                return deferredOperation.promise;
            });
        }
    }

    function _advanceReadiness(dbInfo) {
        var dbContext = dbContexts[dbInfo.name];

        // Dequeue a deferred operation.
        var deferredOperation = dbContext.deferredOperations.pop();

        // Resolve its promise (which is part of the database readiness
        // chain of promises).
        if (deferredOperation) {
            deferredOperation.resolve();
            return deferredOperation.promise;
        }
    }

    function _rejectReadiness(dbInfo, err) {
        var dbContext = dbContexts[dbInfo.name];

        // Dequeue a deferred operation.
        var deferredOperation = dbContext.deferredOperations.pop();

        // Reject its promise (which is part of the database readiness
        // chain of promises).
        if (deferredOperation) {
            deferredOperation.reject(err);
            return deferredOperation.promise;
        }
    }

    function _getConnection(dbInfo, upgradeNeeded) {
        return new Promise$1(function (resolve, reject) {
            dbContexts[dbInfo.name] = dbContexts[dbInfo.name] || createDbContext();

            if (dbInfo.db) {
                if (upgradeNeeded) {
                    _deferReadiness(dbInfo);
                    dbInfo.db.close();
                } else {
                    return resolve(dbInfo.db);
                }
            }

            var dbArgs = [dbInfo.name];

            if (upgradeNeeded) {
                dbArgs.push(dbInfo.version);
            }

            var openreq = idb.open.apply(idb, dbArgs);

            if (upgradeNeeded) {
                openreq.onupgradeneeded = function (e) {
                    var db = openreq.result;
                    try {
                        db.createObjectStore(dbInfo.storeName);
                        if (e.oldVersion <= 1) {
                            // Added when support for blob shims was added
                            db.createObjectStore(DETECT_BLOB_SUPPORT_STORE);
                        }
                    } catch (ex) {
                        if (ex.name === 'ConstraintError') {
                            console.warn('The database "' + dbInfo.name + '"' + ' has been upgraded from version ' + e.oldVersion + ' to version ' + e.newVersion + ', but the storage "' + dbInfo.storeName + '" already exists.');
                        } else {
                            throw ex;
                        }
                    }
                };
            }

            openreq.onerror = function (e) {
                e.preventDefault();
                reject(openreq.error);
            };

            openreq.onsuccess = function () {
                resolve(openreq.result);
                _advanceReadiness(dbInfo);
            };
        });
    }

    function _getOriginalConnection(dbInfo) {
        return _getConnection(dbInfo, false);
    }

    function _getUpgradedConnection(dbInfo) {
        return _getConnection(dbInfo, true);
    }

    function _isUpgradeNeeded(dbInfo, defaultVersion) {
        if (!dbInfo.db) {
            return true;
        }

        var isNewStore = !dbInfo.db.objectStoreNames.contains(dbInfo.storeName);
        var isDowngrade = dbInfo.version < dbInfo.db.version;
        var isUpgrade = dbInfo.version > dbInfo.db.version;

        if (isDowngrade) {
            // If the version is not the default one
            // then warn for impossible downgrade.
            if (dbInfo.version !== defaultVersion) {
                console.warn('The database "' + dbInfo.name + '"' + " can't be downgraded from version " + dbInfo.db.version + ' to version ' + dbInfo.version + '.');
            }
            // Align the versions to prevent errors.
            dbInfo.version = dbInfo.db.version;
        }

        if (isUpgrade || isNewStore) {
            // If the store is new then increment the version (if needed).
            // This will trigger an "upgradeneeded" event which is required
            // for creating a store.
            if (isNewStore) {
                var incVersion = dbInfo.db.version + 1;
                if (incVersion > dbInfo.version) {
                    dbInfo.version = incVersion;
                }
            }

            return true;
        }

        return false;
    }

    // encode a blob for indexeddb engines that don't support blobs
    function _encodeBlob(blob) {
        return new Promise$1(function (resolve, reject) {
            var reader = new FileReader();
            reader.onerror = reject;
            reader.onloadend = function (e) {
                var base64 = btoa(e.target.result || '');
                resolve({
                    __local_forage_encoded_blob: true,
                    data: base64,
                    type: blob.type
                });
            };
            reader.readAsBinaryString(blob);
        });
    }

    // decode an encoded blob
    function _decodeBlob(encodedBlob) {
        var arrayBuff = _binStringToArrayBuffer(atob(encodedBlob.data));
        return createBlob([arrayBuff], { type: encodedBlob.type });
    }

    // is this one of our fancy encoded blobs?
    function _isEncodedBlob(value) {
        return value && value.__local_forage_encoded_blob;
    }

    // Specialize the default `ready()` function by making it dependent
    // on the current database operations. Thus, the driver will be actually
    // ready when it's been initialized (default) *and* there are no pending
    // operations on the database (initiated by some other instances).
    function _fullyReady(callback) {
        var self = this;

        var promise = self._initReady().then(function () {
            var dbContext = dbContexts[self._dbInfo.name];

            if (dbContext && dbContext.dbReady) {
                return dbContext.dbReady;
            }
        });

        executeTwoCallbacks(promise, callback, callback);
        return promise;
    }

    // Try to establish a new db connection to replace the
    // current one which is broken (i.e. experiencing
    // InvalidStateError while creating a transaction).
    function _tryReconnect(dbInfo) {
        _deferReadiness(dbInfo);

        var dbContext = dbContexts[dbInfo.name];
        var forages = dbContext.forages;

        for (var i = 0; i < forages.length; i++) {
            var forage = forages[i];
            if (forage._dbInfo.db) {
                forage._dbInfo.db.close();
                forage._dbInfo.db = null;
            }
        }
        dbInfo.db = null;

        return _getOriginalConnection(dbInfo).then(function (db) {
            dbInfo.db = db;
            if (_isUpgradeNeeded(dbInfo)) {
                // Reopen the database for upgrading.
                return _getUpgradedConnection(dbInfo);
            }
            return db;
        }).then(function (db) {
            // store the latest db reference
            // in case the db was upgraded
            dbInfo.db = dbContext.db = db;
            for (var i = 0; i < forages.length; i++) {
                forages[i]._dbInfo.db = db;
            }
        })["catch"](function (err) {
            _rejectReadiness(dbInfo, err);
            throw err;
        });
    }

    // FF doesn't like Promises (micro-tasks) and IDDB store operations,
    // so we have to do it with callbacks
    function createTransaction(dbInfo, mode, callback, retries) {
        if (retries === undefined) {
            retries = 1;
        }

        try {
            var tx = dbInfo.db.transaction(dbInfo.storeName, mode);
            callback(null, tx);
        } catch (err) {
            if (retries > 0 && (!dbInfo.db || err.name === 'InvalidStateError' || err.name === 'NotFoundError')) {
                return Promise$1.resolve().then(function () {
                    if (!dbInfo.db || err.name === 'NotFoundError' && !dbInfo.db.objectStoreNames.contains(dbInfo.storeName) && dbInfo.version <= dbInfo.db.version) {
                        // increase the db version, to create the new ObjectStore
                        if (dbInfo.db) {
                            dbInfo.version = dbInfo.db.version + 1;
                        }
                        // Reopen the database for upgrading.
                        return _getUpgradedConnection(dbInfo);
                    }
                }).then(function () {
                    return _tryReconnect(dbInfo).then(function () {
                        createTransaction(dbInfo, mode, callback, retries - 1);
                    });
                })["catch"](callback);
            }

            callback(err);
        }
    }

    function createDbContext() {
        return {
            // Running localForages sharing a database.
            forages: [],
            // Shared database.
            db: null,
            // Database readiness (promise).
            dbReady: null,
            // Deferred operations on the database.
            deferredOperations: []
        };
    }

    // Open the IndexedDB database (automatically creates one if one didn't
    // previously exist), using any options set in the config.
    function _initStorage(options) {
        var self = this;
        var dbInfo = {
            db: null
        };

        if (options) {
            for (var i in options) {
                dbInfo[i] = options[i];
            }
        }

        // Get the current context of the database;
        var dbContext = dbContexts[dbInfo.name];

        // ...or create a new context.
        if (!dbContext) {
            dbContext = createDbContext();
            // Register the new context in the global container.
            dbContexts[dbInfo.name] = dbContext;
        }

        // Register itself as a running localForage in the current context.
        dbContext.forages.push(self);

        // Replace the default `ready()` function with the specialized one.
        if (!self._initReady) {
            self._initReady = self.ready;
            self.ready = _fullyReady;
        }

        // Create an array of initialization states of the related localForages.
        var initPromises = [];

        function ignoreErrors() {
            // Don't handle errors here,
            // just makes sure related localForages aren't pending.
            return Promise$1.resolve();
        }

        for (var j = 0; j < dbContext.forages.length; j++) {
            var forage = dbContext.forages[j];
            if (forage !== self) {
                // Don't wait for itself...
                initPromises.push(forage._initReady()["catch"](ignoreErrors));
            }
        }

        // Take a snapshot of the related localForages.
        var forages = dbContext.forages.slice(0);

        // Initialize the connection process only when
        // all the related localForages aren't pending.
        return Promise$1.all(initPromises).then(function () {
            dbInfo.db = dbContext.db;
            // Get the connection or open a new one without upgrade.
            return _getOriginalConnection(dbInfo);
        }).then(function (db) {
            dbInfo.db = db;
            if (_isUpgradeNeeded(dbInfo, self._defaultConfig.version)) {
                // Reopen the database for upgrading.
                return _getUpgradedConnection(dbInfo);
            }
            return db;
        }).then(function (db) {
            dbInfo.db = dbContext.db = db;
            self._dbInfo = dbInfo;
            // Share the final connection amongst related localForages.
            for (var k = 0; k < forages.length; k++) {
                var forage = forages[k];
                if (forage !== self) {
                    // Self is already up-to-date.
                    forage._dbInfo.db = dbInfo.db;
                    forage._dbInfo.version = dbInfo.version;
                }
            }
        });
    }

    function getItem(key, callback) {
        var self = this;

        key = normalizeKey(key);

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                    if (err) {
                        return reject(err);
                    }

                    try {
                        var store = transaction.objectStore(self._dbInfo.storeName);
                        var req = store.get(key);

                        req.onsuccess = function () {
                            var value = req.result;
                            if (value === undefined) {
                                value = null;
                            }
                            if (_isEncodedBlob(value)) {
                                value = _decodeBlob(value);
                            }
                            resolve(value);
                        };

                        req.onerror = function () {
                            reject(req.error);
                        };
                    } catch (e) {
                        reject(e);
                    }
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    // Iterate over all items stored in database.
    function iterate(iterator, callback) {
        var self = this;

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                    if (err) {
                        return reject(err);
                    }

                    try {
                        var store = transaction.objectStore(self._dbInfo.storeName);
                        var req = store.openCursor();
                        var iterationNumber = 1;

                        req.onsuccess = function () {
                            var cursor = req.result;

                            if (cursor) {
                                var value = cursor.value;
                                if (_isEncodedBlob(value)) {
                                    value = _decodeBlob(value);
                                }
                                var result = iterator(value, cursor.key, iterationNumber++);

                                // when the iterator callback returns any
                                // (non-`undefined`) value, then we stop
                                // the iteration immediately
                                if (result !== void 0) {
                                    resolve(result);
                                } else {
                                    cursor["continue"]();
                                }
                            } else {
                                resolve();
                            }
                        };

                        req.onerror = function () {
                            reject(req.error);
                        };
                    } catch (e) {
                        reject(e);
                    }
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);

        return promise;
    }

    function setItem(key, value, callback) {
        var self = this;

        key = normalizeKey(key);

        var promise = new Promise$1(function (resolve, reject) {
            var dbInfo;
            self.ready().then(function () {
                dbInfo = self._dbInfo;
                if (toString.call(value) === '[object Blob]') {
                    return _checkBlobSupport(dbInfo.db).then(function (blobSupport) {
                        if (blobSupport) {
                            return value;
                        }
                        return _encodeBlob(value);
                    });
                }
                return value;
            }).then(function (value) {
                createTransaction(self._dbInfo, READ_WRITE, function (err, transaction) {
                    if (err) {
                        return reject(err);
                    }

                    try {
                        var store = transaction.objectStore(self._dbInfo.storeName);

                        // The reason we don't _save_ null is because IE 10 does
                        // not support saving the `null` type in IndexedDB. How
                        // ironic, given the bug below!
                        // See: https://github.com/mozilla/localForage/issues/161
                        if (value === null) {
                            value = undefined;
                        }

                        var req = store.put(value, key);

                        transaction.oncomplete = function () {
                            // Cast to undefined so the value passed to
                            // callback/promise is the same as what one would get out
                            // of `getItem()` later. This leads to some weirdness
                            // (setItem('foo', undefined) will return `null`), but
                            // it's not my fault localStorage is our baseline and that
                            // it's weird.
                            if (value === undefined) {
                                value = null;
                            }

                            resolve(value);
                        };
                        transaction.onabort = transaction.onerror = function () {
                            var err = req.error ? req.error : req.transaction.error;
                            reject(err);
                        };
                    } catch (e) {
                        reject(e);
                    }
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    function removeItem(key, callback) {
        var self = this;

        key = normalizeKey(key);

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                createTransaction(self._dbInfo, READ_WRITE, function (err, transaction) {
                    if (err) {
                        return reject(err);
                    }

                    try {
                        var store = transaction.objectStore(self._dbInfo.storeName);
                        // We use a Grunt task to make this safe for IE and some
                        // versions of Android (including those used by Cordova).
                        // Normally IE won't like `.delete()` and will insist on
                        // using `['delete']()`, but we have a build step that
                        // fixes this for us now.
                        var req = store["delete"](key);
                        transaction.oncomplete = function () {
                            resolve();
                        };

                        transaction.onerror = function () {
                            reject(req.error);
                        };

                        // The request will be also be aborted if we've exceeded our storage
                        // space.
                        transaction.onabort = function () {
                            var err = req.error ? req.error : req.transaction.error;
                            reject(err);
                        };
                    } catch (e) {
                        reject(e);
                    }
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    function clear(callback) {
        var self = this;

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                createTransaction(self._dbInfo, READ_WRITE, function (err, transaction) {
                    if (err) {
                        return reject(err);
                    }

                    try {
                        var store = transaction.objectStore(self._dbInfo.storeName);
                        var req = store.clear();

                        transaction.oncomplete = function () {
                            resolve();
                        };

                        transaction.onabort = transaction.onerror = function () {
                            var err = req.error ? req.error : req.transaction.error;
                            reject(err);
                        };
                    } catch (e) {
                        reject(e);
                    }
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    function length(callback) {
        var self = this;

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                    if (err) {
                        return reject(err);
                    }

                    try {
                        var store = transaction.objectStore(self._dbInfo.storeName);
                        var req = store.count();

                        req.onsuccess = function () {
                            resolve(req.result);
                        };

                        req.onerror = function () {
                            reject(req.error);
                        };
                    } catch (e) {
                        reject(e);
                    }
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    function key(n, callback) {
        var self = this;

        var promise = new Promise$1(function (resolve, reject) {
            if (n < 0) {
                resolve(null);

                return;
            }

            self.ready().then(function () {
                createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                    if (err) {
                        return reject(err);
                    }

                    try {
                        var store = transaction.objectStore(self._dbInfo.storeName);
                        var advanced = false;
                        var req = store.openKeyCursor();

                        req.onsuccess = function () {
                            var cursor = req.result;
                            if (!cursor) {
                                // this means there weren't enough keys
                                resolve(null);

                                return;
                            }

                            if (n === 0) {
                                // We have the first key, return it if that's what they
                                // wanted.
                                resolve(cursor.key);
                            } else {
                                if (!advanced) {
                                    // Otherwise, ask the cursor to skip ahead n
                                    // records.
                                    advanced = true;
                                    cursor.advance(n);
                                } else {
                                    // When we get here, we've got the nth key.
                                    resolve(cursor.key);
                                }
                            }
                        };

                        req.onerror = function () {
                            reject(req.error);
                        };
                    } catch (e) {
                        reject(e);
                    }
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    function keys(callback) {
        var self = this;

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                    if (err) {
                        return reject(err);
                    }

                    try {
                        var store = transaction.objectStore(self._dbInfo.storeName);
                        var req = store.openKeyCursor();
                        var keys = [];

                        req.onsuccess = function () {
                            var cursor = req.result;

                            if (!cursor) {
                                resolve(keys);
                                return;
                            }

                            keys.push(cursor.key);
                            cursor["continue"]();
                        };

                        req.onerror = function () {
                            reject(req.error);
                        };
                    } catch (e) {
                        reject(e);
                    }
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    function dropInstance(options, callback) {
        callback = getCallback.apply(this, arguments);

        var currentConfig = this.config();
        options = typeof options !== 'function' && options || {};
        if (!options.name) {
            options.name = options.name || currentConfig.name;
            options.storeName = options.storeName || currentConfig.storeName;
        }

        var self = this;
        var promise;
        if (!options.name) {
            promise = Promise$1.reject('Invalid arguments');
        } else {
            var isCurrentDb = options.name === currentConfig.name && self._dbInfo.db;

            var dbPromise = isCurrentDb ? Promise$1.resolve(self._dbInfo.db) : _getOriginalConnection(options).then(function (db) {
                var dbContext = dbContexts[options.name];
                var forages = dbContext.forages;
                dbContext.db = db;
                for (var i = 0; i < forages.length; i++) {
                    forages[i]._dbInfo.db = db;
                }
                return db;
            });

            if (!options.storeName) {
                promise = dbPromise.then(function (db) {
                    _deferReadiness(options);

                    var dbContext = dbContexts[options.name];
                    var forages = dbContext.forages;

                    db.close();
                    for (var i = 0; i < forages.length; i++) {
                        var forage = forages[i];
                        forage._dbInfo.db = null;
                    }

                    var dropDBPromise = new Promise$1(function (resolve, reject) {
                        var req = idb.deleteDatabase(options.name);

                        req.onerror = req.onblocked = function (err) {
                            var db = req.result;
                            if (db) {
                                db.close();
                            }
                            reject(err);
                        };

                        req.onsuccess = function () {
                            var db = req.result;
                            if (db) {
                                db.close();
                            }
                            resolve(db);
                        };
                    });

                    return dropDBPromise.then(function (db) {
                        dbContext.db = db;
                        for (var i = 0; i < forages.length; i++) {
                            var _forage = forages[i];
                            _advanceReadiness(_forage._dbInfo);
                        }
                    })["catch"](function (err) {
                        (_rejectReadiness(options, err) || Promise$1.resolve())["catch"](function () {});
                        throw err;
                    });
                });
            } else {
                promise = dbPromise.then(function (db) {
                    if (!db.objectStoreNames.contains(options.storeName)) {
                        return;
                    }

                    var newVersion = db.version + 1;

                    _deferReadiness(options);

                    var dbContext = dbContexts[options.name];
                    var forages = dbContext.forages;

                    db.close();
                    for (var i = 0; i < forages.length; i++) {
                        var forage = forages[i];
                        forage._dbInfo.db = null;
                        forage._dbInfo.version = newVersion;
                    }

                    var dropObjectPromise = new Promise$1(function (resolve, reject) {
                        var req = idb.open(options.name, newVersion);

                        req.onerror = function (err) {
                            var db = req.result;
                            db.close();
                            reject(err);
                        };

                        req.onupgradeneeded = function () {
                            var db = req.result;
                            db.deleteObjectStore(options.storeName);
                        };

                        req.onsuccess = function () {
                            var db = req.result;
                            db.close();
                            resolve(db);
                        };
                    });

                    return dropObjectPromise.then(function (db) {
                        dbContext.db = db;
                        for (var j = 0; j < forages.length; j++) {
                            var _forage2 = forages[j];
                            _forage2._dbInfo.db = db;
                            _advanceReadiness(_forage2._dbInfo);
                        }
                    })["catch"](function (err) {
                        (_rejectReadiness(options, err) || Promise$1.resolve())["catch"](function () {});
                        throw err;
                    });
                });
            }
        }

        executeCallback(promise, callback);
        return promise;
    }

    var asyncStorage = {
        _driver: 'asyncStorage',
        _initStorage: _initStorage,
        _support: isIndexedDBValid(),
        iterate: iterate,
        getItem: getItem,
        setItem: setItem,
        removeItem: removeItem,
        clear: clear,
        length: length,
        key: key,
        keys: keys,
        dropInstance: dropInstance
    };

    function isWebSQLValid() {
        return typeof openDatabase === 'function';
    }

    // Sadly, the best way to save binary data in WebSQL/localStorage is serializing
    // it to Base64, so this is how we store it to prevent very strange errors with less
    // verbose ways of binary <-> string data storage.
    var BASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    var BLOB_TYPE_PREFIX = '~~local_forage_type~';
    var BLOB_TYPE_PREFIX_REGEX = /^~~local_forage_type~([^~]+)~/;

    var SERIALIZED_MARKER = '__lfsc__:';
    var SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER.length;

    // OMG the serializations!
    var TYPE_ARRAYBUFFER = 'arbf';
    var TYPE_BLOB = 'blob';
    var TYPE_INT8ARRAY = 'si08';
    var TYPE_UINT8ARRAY = 'ui08';
    var TYPE_UINT8CLAMPEDARRAY = 'uic8';
    var TYPE_INT16ARRAY = 'si16';
    var TYPE_INT32ARRAY = 'si32';
    var TYPE_UINT16ARRAY = 'ur16';
    var TYPE_UINT32ARRAY = 'ui32';
    var TYPE_FLOAT32ARRAY = 'fl32';
    var TYPE_FLOAT64ARRAY = 'fl64';
    var TYPE_SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER_LENGTH + TYPE_ARRAYBUFFER.length;

    var toString$1 = Object.prototype.toString;

    function stringToBuffer(serializedString) {
        // Fill the string into a ArrayBuffer.
        var bufferLength = serializedString.length * 0.75;
        var len = serializedString.length;
        var i;
        var p = 0;
        var encoded1, encoded2, encoded3, encoded4;

        if (serializedString[serializedString.length - 1] === '=') {
            bufferLength--;
            if (serializedString[serializedString.length - 2] === '=') {
                bufferLength--;
            }
        }

        var buffer = new ArrayBuffer(bufferLength);
        var bytes = new Uint8Array(buffer);

        for (i = 0; i < len; i += 4) {
            encoded1 = BASE_CHARS.indexOf(serializedString[i]);
            encoded2 = BASE_CHARS.indexOf(serializedString[i + 1]);
            encoded3 = BASE_CHARS.indexOf(serializedString[i + 2]);
            encoded4 = BASE_CHARS.indexOf(serializedString[i + 3]);

            /*jslint bitwise: true */
            bytes[p++] = encoded1 << 2 | encoded2 >> 4;
            bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
            bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
        }
        return buffer;
    }

    // Converts a buffer to a string to store, serialized, in the backend
    // storage library.
    function bufferToString(buffer) {
        // base64-arraybuffer
        var bytes = new Uint8Array(buffer);
        var base64String = '';
        var i;

        for (i = 0; i < bytes.length; i += 3) {
            /*jslint bitwise: true */
            base64String += BASE_CHARS[bytes[i] >> 2];
            base64String += BASE_CHARS[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
            base64String += BASE_CHARS[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
            base64String += BASE_CHARS[bytes[i + 2] & 63];
        }

        if (bytes.length % 3 === 2) {
            base64String = base64String.substring(0, base64String.length - 1) + '=';
        } else if (bytes.length % 3 === 1) {
            base64String = base64String.substring(0, base64String.length - 2) + '==';
        }

        return base64String;
    }

    // Serialize a value, afterwards executing a callback (which usually
    // instructs the `setItem()` callback/promise to be executed). This is how
    // we store binary data with localStorage.
    function serialize(value, callback) {
        var valueType = '';
        if (value) {
            valueType = toString$1.call(value);
        }

        // Cannot use `value instanceof ArrayBuffer` or such here, as these
        // checks fail when running the tests using casper.js...
        //
        // TODO: See why those tests fail and use a better solution.
        if (value && (valueType === '[object ArrayBuffer]' || value.buffer && toString$1.call(value.buffer) === '[object ArrayBuffer]')) {
            // Convert binary arrays to a string and prefix the string with
            // a special marker.
            var buffer;
            var marker = SERIALIZED_MARKER;

            if (value instanceof ArrayBuffer) {
                buffer = value;
                marker += TYPE_ARRAYBUFFER;
            } else {
                buffer = value.buffer;

                if (valueType === '[object Int8Array]') {
                    marker += TYPE_INT8ARRAY;
                } else if (valueType === '[object Uint8Array]') {
                    marker += TYPE_UINT8ARRAY;
                } else if (valueType === '[object Uint8ClampedArray]') {
                    marker += TYPE_UINT8CLAMPEDARRAY;
                } else if (valueType === '[object Int16Array]') {
                    marker += TYPE_INT16ARRAY;
                } else if (valueType === '[object Uint16Array]') {
                    marker += TYPE_UINT16ARRAY;
                } else if (valueType === '[object Int32Array]') {
                    marker += TYPE_INT32ARRAY;
                } else if (valueType === '[object Uint32Array]') {
                    marker += TYPE_UINT32ARRAY;
                } else if (valueType === '[object Float32Array]') {
                    marker += TYPE_FLOAT32ARRAY;
                } else if (valueType === '[object Float64Array]') {
                    marker += TYPE_FLOAT64ARRAY;
                } else {
                    callback(new Error('Failed to get type for BinaryArray'));
                }
            }

            callback(marker + bufferToString(buffer));
        } else if (valueType === '[object Blob]') {
            // Conver the blob to a binaryArray and then to a string.
            var fileReader = new FileReader();

            fileReader.onload = function () {
                // Backwards-compatible prefix for the blob type.
                var str = BLOB_TYPE_PREFIX + value.type + '~' + bufferToString(this.result);

                callback(SERIALIZED_MARKER + TYPE_BLOB + str);
            };

            fileReader.readAsArrayBuffer(value);
        } else {
            try {
                callback(JSON.stringify(value));
            } catch (e) {
                console.error("Couldn't convert value into a JSON string: ", value);

                callback(null, e);
            }
        }
    }

    // Deserialize data we've inserted into a value column/field. We place
    // special markers into our strings to mark them as encoded; this isn't
    // as nice as a meta field, but it's the only sane thing we can do whilst
    // keeping localStorage support intact.
    //
    // Oftentimes this will just deserialize JSON content, but if we have a
    // special marker (SERIALIZED_MARKER, defined above), we will extract
    // some kind of arraybuffer/binary data/typed array out of the string.
    function deserialize(value) {
        // If we haven't marked this string as being specially serialized (i.e.
        // something other than serialized JSON), we can just return it and be
        // done with it.
        if (value.substring(0, SERIALIZED_MARKER_LENGTH) !== SERIALIZED_MARKER) {
            return JSON.parse(value);
        }

        // The following code deals with deserializing some kind of Blob or
        // TypedArray. First we separate out the type of data we're dealing
        // with from the data itself.
        var serializedString = value.substring(TYPE_SERIALIZED_MARKER_LENGTH);
        var type = value.substring(SERIALIZED_MARKER_LENGTH, TYPE_SERIALIZED_MARKER_LENGTH);

        var blobType;
        // Backwards-compatible blob type serialization strategy.
        // DBs created with older versions of localForage will simply not have the blob type.
        if (type === TYPE_BLOB && BLOB_TYPE_PREFIX_REGEX.test(serializedString)) {
            var matcher = serializedString.match(BLOB_TYPE_PREFIX_REGEX);
            blobType = matcher[1];
            serializedString = serializedString.substring(matcher[0].length);
        }
        var buffer = stringToBuffer(serializedString);

        // Return the right type based on the code/type set during
        // serialization.
        switch (type) {
            case TYPE_ARRAYBUFFER:
                return buffer;
            case TYPE_BLOB:
                return createBlob([buffer], { type: blobType });
            case TYPE_INT8ARRAY:
                return new Int8Array(buffer);
            case TYPE_UINT8ARRAY:
                return new Uint8Array(buffer);
            case TYPE_UINT8CLAMPEDARRAY:
                return new Uint8ClampedArray(buffer);
            case TYPE_INT16ARRAY:
                return new Int16Array(buffer);
            case TYPE_UINT16ARRAY:
                return new Uint16Array(buffer);
            case TYPE_INT32ARRAY:
                return new Int32Array(buffer);
            case TYPE_UINT32ARRAY:
                return new Uint32Array(buffer);
            case TYPE_FLOAT32ARRAY:
                return new Float32Array(buffer);
            case TYPE_FLOAT64ARRAY:
                return new Float64Array(buffer);
            default:
                throw new Error('Unkown type: ' + type);
        }
    }

    var localforageSerializer = {
        serialize: serialize,
        deserialize: deserialize,
        stringToBuffer: stringToBuffer,
        bufferToString: bufferToString
    };

    /*
     * Includes code from:
     *
     * base64-arraybuffer
     * https://github.com/niklasvh/base64-arraybuffer
     *
     * Copyright (c) 2012 Niklas von Hertzen
     * Licensed under the MIT license.
     */

    function createDbTable(t, dbInfo, callback, errorCallback) {
        t.executeSql('CREATE TABLE IF NOT EXISTS ' + dbInfo.storeName + ' ' + '(id INTEGER PRIMARY KEY, key unique, value)', [], callback, errorCallback);
    }

    // Open the WebSQL database (automatically creates one if one didn't
    // previously exist), using any options set in the config.
    function _initStorage$1(options) {
        var self = this;
        var dbInfo = {
            db: null
        };

        if (options) {
            for (var i in options) {
                dbInfo[i] = typeof options[i] !== 'string' ? options[i].toString() : options[i];
            }
        }

        var dbInfoPromise = new Promise$1(function (resolve, reject) {
            // Open the database; the openDatabase API will automatically
            // create it for us if it doesn't exist.
            try {
                dbInfo.db = openDatabase(dbInfo.name, String(dbInfo.version), dbInfo.description, dbInfo.size);
            } catch (e) {
                return reject(e);
            }

            // Create our key/value table if it doesn't exist.
            dbInfo.db.transaction(function (t) {
                createDbTable(t, dbInfo, function () {
                    self._dbInfo = dbInfo;
                    resolve();
                }, function (t, error) {
                    reject(error);
                });
            }, reject);
        });

        dbInfo.serializer = localforageSerializer;
        return dbInfoPromise;
    }

    function tryExecuteSql(t, dbInfo, sqlStatement, args, callback, errorCallback) {
        t.executeSql(sqlStatement, args, callback, function (t, error) {
            if (error.code === error.SYNTAX_ERR) {
                t.executeSql('SELECT name FROM sqlite_master ' + "WHERE type='table' AND name = ?", [dbInfo.storeName], function (t, results) {
                    if (!results.rows.length) {
                        // if the table is missing (was deleted)
                        // re-create it table and retry
                        createDbTable(t, dbInfo, function () {
                            t.executeSql(sqlStatement, args, callback, errorCallback);
                        }, errorCallback);
                    } else {
                        errorCallback(t, error);
                    }
                }, errorCallback);
            } else {
                errorCallback(t, error);
            }
        }, errorCallback);
    }

    function getItem$1(key, callback) {
        var self = this;

        key = normalizeKey(key);

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                var dbInfo = self._dbInfo;
                dbInfo.db.transaction(function (t) {
                    tryExecuteSql(t, dbInfo, 'SELECT * FROM ' + dbInfo.storeName + ' WHERE key = ? LIMIT 1', [key], function (t, results) {
                        var result = results.rows.length ? results.rows.item(0).value : null;

                        // Check to see if this is serialized content we need to
                        // unpack.
                        if (result) {
                            result = dbInfo.serializer.deserialize(result);
                        }

                        resolve(result);
                    }, function (t, error) {
                        reject(error);
                    });
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    function iterate$1(iterator, callback) {
        var self = this;

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                var dbInfo = self._dbInfo;

                dbInfo.db.transaction(function (t) {
                    tryExecuteSql(t, dbInfo, 'SELECT * FROM ' + dbInfo.storeName, [], function (t, results) {
                        var rows = results.rows;
                        var length = rows.length;

                        for (var i = 0; i < length; i++) {
                            var item = rows.item(i);
                            var result = item.value;

                            // Check to see if this is serialized content
                            // we need to unpack.
                            if (result) {
                                result = dbInfo.serializer.deserialize(result);
                            }

                            result = iterator(result, item.key, i + 1);

                            // void(0) prevents problems with redefinition
                            // of `undefined`.
                            if (result !== void 0) {
                                resolve(result);
                                return;
                            }
                        }

                        resolve();
                    }, function (t, error) {
                        reject(error);
                    });
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    function _setItem(key, value, callback, retriesLeft) {
        var self = this;

        key = normalizeKey(key);

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                // The localStorage API doesn't return undefined values in an
                // "expected" way, so undefined is always cast to null in all
                // drivers. See: https://github.com/mozilla/localForage/pull/42
                if (value === undefined) {
                    value = null;
                }

                // Save the original value to pass to the callback.
                var originalValue = value;

                var dbInfo = self._dbInfo;
                dbInfo.serializer.serialize(value, function (value, error) {
                    if (error) {
                        reject(error);
                    } else {
                        dbInfo.db.transaction(function (t) {
                            tryExecuteSql(t, dbInfo, 'INSERT OR REPLACE INTO ' + dbInfo.storeName + ' ' + '(key, value) VALUES (?, ?)', [key, value], function () {
                                resolve(originalValue);
                            }, function (t, error) {
                                reject(error);
                            });
                        }, function (sqlError) {
                            // The transaction failed; check
                            // to see if it's a quota error.
                            if (sqlError.code === sqlError.QUOTA_ERR) {
                                // We reject the callback outright for now, but
                                // it's worth trying to re-run the transaction.
                                // Even if the user accepts the prompt to use
                                // more storage on Safari, this error will
                                // be called.
                                //
                                // Try to re-run the transaction.
                                if (retriesLeft > 0) {
                                    resolve(_setItem.apply(self, [key, originalValue, callback, retriesLeft - 1]));
                                    return;
                                }
                                reject(sqlError);
                            }
                        });
                    }
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    function setItem$1(key, value, callback) {
        return _setItem.apply(this, [key, value, callback, 1]);
    }

    function removeItem$1(key, callback) {
        var self = this;

        key = normalizeKey(key);

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                var dbInfo = self._dbInfo;
                dbInfo.db.transaction(function (t) {
                    tryExecuteSql(t, dbInfo, 'DELETE FROM ' + dbInfo.storeName + ' WHERE key = ?', [key], function () {
                        resolve();
                    }, function (t, error) {
                        reject(error);
                    });
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    // Deletes every item in the table.
    // TODO: Find out if this resets the AUTO_INCREMENT number.
    function clear$1(callback) {
        var self = this;

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                var dbInfo = self._dbInfo;
                dbInfo.db.transaction(function (t) {
                    tryExecuteSql(t, dbInfo, 'DELETE FROM ' + dbInfo.storeName, [], function () {
                        resolve();
                    }, function (t, error) {
                        reject(error);
                    });
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    // Does a simple `COUNT(key)` to get the number of items stored in
    // localForage.
    function length$1(callback) {
        var self = this;

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                var dbInfo = self._dbInfo;
                dbInfo.db.transaction(function (t) {
                    // Ahhh, SQL makes this one soooooo easy.
                    tryExecuteSql(t, dbInfo, 'SELECT COUNT(key) as c FROM ' + dbInfo.storeName, [], function (t, results) {
                        var result = results.rows.item(0).c;
                        resolve(result);
                    }, function (t, error) {
                        reject(error);
                    });
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    // Return the key located at key index X; essentially gets the key from a
    // `WHERE id = ?`. This is the most efficient way I can think to implement
    // this rarely-used (in my experience) part of the API, but it can seem
    // inconsistent, because we do `INSERT OR REPLACE INTO` on `setItem()`, so
    // the ID of each key will change every time it's updated. Perhaps a stored
    // procedure for the `setItem()` SQL would solve this problem?
    // TODO: Don't change ID on `setItem()`.
    function key$1(n, callback) {
        var self = this;

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                var dbInfo = self._dbInfo;
                dbInfo.db.transaction(function (t) {
                    tryExecuteSql(t, dbInfo, 'SELECT key FROM ' + dbInfo.storeName + ' WHERE id = ? LIMIT 1', [n + 1], function (t, results) {
                        var result = results.rows.length ? results.rows.item(0).key : null;
                        resolve(result);
                    }, function (t, error) {
                        reject(error);
                    });
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    function keys$1(callback) {
        var self = this;

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                var dbInfo = self._dbInfo;
                dbInfo.db.transaction(function (t) {
                    tryExecuteSql(t, dbInfo, 'SELECT key FROM ' + dbInfo.storeName, [], function (t, results) {
                        var keys = [];

                        for (var i = 0; i < results.rows.length; i++) {
                            keys.push(results.rows.item(i).key);
                        }

                        resolve(keys);
                    }, function (t, error) {
                        reject(error);
                    });
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    // https://www.w3.org/TR/webdatabase/#databases
    // > There is no way to enumerate or delete the databases available for an origin from this API.
    function getAllStoreNames(db) {
        return new Promise$1(function (resolve, reject) {
            db.transaction(function (t) {
                t.executeSql('SELECT name FROM sqlite_master ' + "WHERE type='table' AND name <> '__WebKitDatabaseInfoTable__'", [], function (t, results) {
                    var storeNames = [];

                    for (var i = 0; i < results.rows.length; i++) {
                        storeNames.push(results.rows.item(i).name);
                    }

                    resolve({
                        db: db,
                        storeNames: storeNames
                    });
                }, function (t, error) {
                    reject(error);
                });
            }, function (sqlError) {
                reject(sqlError);
            });
        });
    }

    function dropInstance$1(options, callback) {
        callback = getCallback.apply(this, arguments);

        var currentConfig = this.config();
        options = typeof options !== 'function' && options || {};
        if (!options.name) {
            options.name = options.name || currentConfig.name;
            options.storeName = options.storeName || currentConfig.storeName;
        }

        var self = this;
        var promise;
        if (!options.name) {
            promise = Promise$1.reject('Invalid arguments');
        } else {
            promise = new Promise$1(function (resolve) {
                var db;
                if (options.name === currentConfig.name) {
                    // use the db reference of the current instance
                    db = self._dbInfo.db;
                } else {
                    db = openDatabase(options.name, '', '', 0);
                }

                if (!options.storeName) {
                    // drop all database tables
                    resolve(getAllStoreNames(db));
                } else {
                    resolve({
                        db: db,
                        storeNames: [options.storeName]
                    });
                }
            }).then(function (operationInfo) {
                return new Promise$1(function (resolve, reject) {
                    operationInfo.db.transaction(function (t) {
                        function dropTable(storeName) {
                            return new Promise$1(function (resolve, reject) {
                                t.executeSql('DROP TABLE IF EXISTS ' + storeName, [], function () {
                                    resolve();
                                }, function (t, error) {
                                    reject(error);
                                });
                            });
                        }

                        var operations = [];
                        for (var i = 0, len = operationInfo.storeNames.length; i < len; i++) {
                            operations.push(dropTable(operationInfo.storeNames[i]));
                        }

                        Promise$1.all(operations).then(function () {
                            resolve();
                        })["catch"](function (e) {
                            reject(e);
                        });
                    }, function (sqlError) {
                        reject(sqlError);
                    });
                });
            });
        }

        executeCallback(promise, callback);
        return promise;
    }

    var webSQLStorage = {
        _driver: 'webSQLStorage',
        _initStorage: _initStorage$1,
        _support: isWebSQLValid(),
        iterate: iterate$1,
        getItem: getItem$1,
        setItem: setItem$1,
        removeItem: removeItem$1,
        clear: clear$1,
        length: length$1,
        key: key$1,
        keys: keys$1,
        dropInstance: dropInstance$1
    };

    function isLocalStorageValid() {
        try {
            return typeof localStorage !== 'undefined' && 'setItem' in localStorage &&
            // in IE8 typeof localStorage.setItem === 'object'
            !!localStorage.setItem;
        } catch (e) {
            return false;
        }
    }

    function _getKeyPrefix(options, defaultConfig) {
        var keyPrefix = options.name + '/';

        if (options.storeName !== defaultConfig.storeName) {
            keyPrefix += options.storeName + '/';
        }
        return keyPrefix;
    }

    // Check if localStorage throws when saving an item
    function checkIfLocalStorageThrows() {
        var localStorageTestKey = '_localforage_support_test';

        try {
            localStorage.setItem(localStorageTestKey, true);
            localStorage.removeItem(localStorageTestKey);

            return false;
        } catch (e) {
            return true;
        }
    }

    // Check if localStorage is usable and allows to save an item
    // This method checks if localStorage is usable in Safari Private Browsing
    // mode, or in any other case where the available quota for localStorage
    // is 0 and there wasn't any saved items yet.
    function _isLocalStorageUsable() {
        return !checkIfLocalStorageThrows() || localStorage.length > 0;
    }

    // Config the localStorage backend, using options set in the config.
    function _initStorage$2(options) {
        var self = this;
        var dbInfo = {};
        if (options) {
            for (var i in options) {
                dbInfo[i] = options[i];
            }
        }

        dbInfo.keyPrefix = _getKeyPrefix(options, self._defaultConfig);

        if (!_isLocalStorageUsable()) {
            return Promise$1.reject();
        }

        self._dbInfo = dbInfo;
        dbInfo.serializer = localforageSerializer;

        return Promise$1.resolve();
    }

    // Remove all keys from the datastore, effectively destroying all data in
    // the app's key/value store!
    function clear$2(callback) {
        var self = this;
        var promise = self.ready().then(function () {
            var keyPrefix = self._dbInfo.keyPrefix;

            for (var i = localStorage.length - 1; i >= 0; i--) {
                var key = localStorage.key(i);

                if (key.indexOf(keyPrefix) === 0) {
                    localStorage.removeItem(key);
                }
            }
        });

        executeCallback(promise, callback);
        return promise;
    }

    // Retrieve an item from the store. Unlike the original async_storage
    // library in Gaia, we don't modify return values at all. If a key's value
    // is `undefined`, we pass that value to the callback function.
    function getItem$2(key, callback) {
        var self = this;

        key = normalizeKey(key);

        var promise = self.ready().then(function () {
            var dbInfo = self._dbInfo;
            var result = localStorage.getItem(dbInfo.keyPrefix + key);

            // If a result was found, parse it from the serialized
            // string into a JS object. If result isn't truthy, the key
            // is likely undefined and we'll pass it straight to the
            // callback.
            if (result) {
                result = dbInfo.serializer.deserialize(result);
            }

            return result;
        });

        executeCallback(promise, callback);
        return promise;
    }

    // Iterate over all items in the store.
    function iterate$2(iterator, callback) {
        var self = this;

        var promise = self.ready().then(function () {
            var dbInfo = self._dbInfo;
            var keyPrefix = dbInfo.keyPrefix;
            var keyPrefixLength = keyPrefix.length;
            var length = localStorage.length;

            // We use a dedicated iterator instead of the `i` variable below
            // so other keys we fetch in localStorage aren't counted in
            // the `iterationNumber` argument passed to the `iterate()`
            // callback.
            //
            // See: github.com/mozilla/localForage/pull/435#discussion_r38061530
            var iterationNumber = 1;

            for (var i = 0; i < length; i++) {
                var key = localStorage.key(i);
                if (key.indexOf(keyPrefix) !== 0) {
                    continue;
                }
                var value = localStorage.getItem(key);

                // If a result was found, parse it from the serialized
                // string into a JS object. If result isn't truthy, the
                // key is likely undefined and we'll pass it straight
                // to the iterator.
                if (value) {
                    value = dbInfo.serializer.deserialize(value);
                }

                value = iterator(value, key.substring(keyPrefixLength), iterationNumber++);

                if (value !== void 0) {
                    return value;
                }
            }
        });

        executeCallback(promise, callback);
        return promise;
    }

    // Same as localStorage's key() method, except takes a callback.
    function key$2(n, callback) {
        var self = this;
        var promise = self.ready().then(function () {
            var dbInfo = self._dbInfo;
            var result;
            try {
                result = localStorage.key(n);
            } catch (error) {
                result = null;
            }

            // Remove the prefix from the key, if a key is found.
            if (result) {
                result = result.substring(dbInfo.keyPrefix.length);
            }

            return result;
        });

        executeCallback(promise, callback);
        return promise;
    }

    function keys$2(callback) {
        var self = this;
        var promise = self.ready().then(function () {
            var dbInfo = self._dbInfo;
            var length = localStorage.length;
            var keys = [];

            for (var i = 0; i < length; i++) {
                var itemKey = localStorage.key(i);
                if (itemKey.indexOf(dbInfo.keyPrefix) === 0) {
                    keys.push(itemKey.substring(dbInfo.keyPrefix.length));
                }
            }

            return keys;
        });

        executeCallback(promise, callback);
        return promise;
    }

    // Supply the number of keys in the datastore to the callback function.
    function length$2(callback) {
        var self = this;
        var promise = self.keys().then(function (keys) {
            return keys.length;
        });

        executeCallback(promise, callback);
        return promise;
    }

    // Remove an item from the store, nice and simple.
    function removeItem$2(key, callback) {
        var self = this;

        key = normalizeKey(key);

        var promise = self.ready().then(function () {
            var dbInfo = self._dbInfo;
            localStorage.removeItem(dbInfo.keyPrefix + key);
        });

        executeCallback(promise, callback);
        return promise;
    }

    // Set a key's value and run an optional callback once the value is set.
    // Unlike Gaia's implementation, the callback function is passed the value,
    // in case you want to operate on that value only after you're sure it
    // saved, or something like that.
    function setItem$2(key, value, callback) {
        var self = this;

        key = normalizeKey(key);

        var promise = self.ready().then(function () {
            // Convert undefined values to null.
            // https://github.com/mozilla/localForage/pull/42
            if (value === undefined) {
                value = null;
            }

            // Save the original value to pass to the callback.
            var originalValue = value;

            return new Promise$1(function (resolve, reject) {
                var dbInfo = self._dbInfo;
                dbInfo.serializer.serialize(value, function (value, error) {
                    if (error) {
                        reject(error);
                    } else {
                        try {
                            localStorage.setItem(dbInfo.keyPrefix + key, value);
                            resolve(originalValue);
                        } catch (e) {
                            // localStorage capacity exceeded.
                            // TODO: Make this a specific error/event.
                            if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                                reject(e);
                            }
                            reject(e);
                        }
                    }
                });
            });
        });

        executeCallback(promise, callback);
        return promise;
    }

    function dropInstance$2(options, callback) {
        callback = getCallback.apply(this, arguments);

        options = typeof options !== 'function' && options || {};
        if (!options.name) {
            var currentConfig = this.config();
            options.name = options.name || currentConfig.name;
            options.storeName = options.storeName || currentConfig.storeName;
        }

        var self = this;
        var promise;
        if (!options.name) {
            promise = Promise$1.reject('Invalid arguments');
        } else {
            promise = new Promise$1(function (resolve) {
                if (!options.storeName) {
                    resolve(options.name + '/');
                } else {
                    resolve(_getKeyPrefix(options, self._defaultConfig));
                }
            }).then(function (keyPrefix) {
                for (var i = localStorage.length - 1; i >= 0; i--) {
                    var key = localStorage.key(i);

                    if (key.indexOf(keyPrefix) === 0) {
                        localStorage.removeItem(key);
                    }
                }
            });
        }

        executeCallback(promise, callback);
        return promise;
    }

    var localStorageWrapper = {
        _driver: 'localStorageWrapper',
        _initStorage: _initStorage$2,
        _support: isLocalStorageValid(),
        iterate: iterate$2,
        getItem: getItem$2,
        setItem: setItem$2,
        removeItem: removeItem$2,
        clear: clear$2,
        length: length$2,
        key: key$2,
        keys: keys$2,
        dropInstance: dropInstance$2
    };

    var sameValue = function sameValue(x, y) {
        return x === y || typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y);
    };

    var includes = function includes(array, searchElement) {
        var len = array.length;
        var i = 0;
        while (i < len) {
            if (sameValue(array[i], searchElement)) {
                return true;
            }
            i++;
        }

        return false;
    };

    var isArray = Array.isArray || function (arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };

    // Drivers are stored here when `defineDriver()` is called.
    // They are shared across all instances of localForage.
    var DefinedDrivers = {};

    var DriverSupport = {};

    var DefaultDrivers = {
        INDEXEDDB: asyncStorage,
        WEBSQL: webSQLStorage,
        LOCALSTORAGE: localStorageWrapper
    };

    var DefaultDriverOrder = [DefaultDrivers.INDEXEDDB._driver, DefaultDrivers.WEBSQL._driver, DefaultDrivers.LOCALSTORAGE._driver];

    var OptionalDriverMethods = ['dropInstance'];

    var LibraryMethods = ['clear', 'getItem', 'iterate', 'key', 'keys', 'length', 'removeItem', 'setItem'].concat(OptionalDriverMethods);

    var DefaultConfig = {
        description: '',
        driver: DefaultDriverOrder.slice(),
        name: 'localforage',
        // Default DB size is _JUST UNDER_ 5MB, as it's the highest size
        // we can use without a prompt.
        size: 4980736,
        storeName: 'keyvaluepairs',
        version: 1.0
    };

    function callWhenReady(localForageInstance, libraryMethod) {
        localForageInstance[libraryMethod] = function () {
            var _args = arguments;
            return localForageInstance.ready().then(function () {
                return localForageInstance[libraryMethod].apply(localForageInstance, _args);
            });
        };
    }

    function extend() {
        for (var i = 1; i < arguments.length; i++) {
            var arg = arguments[i];

            if (arg) {
                for (var _key in arg) {
                    if (arg.hasOwnProperty(_key)) {
                        if (isArray(arg[_key])) {
                            arguments[0][_key] = arg[_key].slice();
                        } else {
                            arguments[0][_key] = arg[_key];
                        }
                    }
                }
            }
        }

        return arguments[0];
    }

    var LocalForage = function () {
        function LocalForage(options) {
            _classCallCheck(this, LocalForage);

            for (var driverTypeKey in DefaultDrivers) {
                if (DefaultDrivers.hasOwnProperty(driverTypeKey)) {
                    var driver = DefaultDrivers[driverTypeKey];
                    var driverName = driver._driver;
                    this[driverTypeKey] = driverName;

                    if (!DefinedDrivers[driverName]) {
                        // we don't need to wait for the promise,
                        // since the default drivers can be defined
                        // in a blocking manner
                        this.defineDriver(driver);
                    }
                }
            }

            this._defaultConfig = extend({}, DefaultConfig);
            this._config = extend({}, this._defaultConfig, options);
            this._driverSet = null;
            this._initDriver = null;
            this._ready = false;
            this._dbInfo = null;

            this._wrapLibraryMethodsWithReady();
            this.setDriver(this._config.driver)["catch"](function () {});
        }

        // Set any config values for localForage; can be called anytime before
        // the first API call (e.g. `getItem`, `setItem`).
        // We loop through options so we don't overwrite existing config
        // values.


        LocalForage.prototype.config = function config(options) {
            // If the options argument is an object, we use it to set values.
            // Otherwise, we return either a specified config value or all
            // config values.
            if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
                // If localforage is ready and fully initialized, we can't set
                // any new configuration values. Instead, we return an error.
                if (this._ready) {
                    return new Error("Can't call config() after localforage " + 'has been used.');
                }

                for (var i in options) {
                    if (i === 'storeName') {
                        options[i] = options[i].replace(/\W/g, '_');
                    }

                    if (i === 'version' && typeof options[i] !== 'number') {
                        return new Error('Database version must be a number.');
                    }

                    this._config[i] = options[i];
                }

                // after all config options are set and
                // the driver option is used, try setting it
                if ('driver' in options && options.driver) {
                    return this.setDriver(this._config.driver);
                }

                return true;
            } else if (typeof options === 'string') {
                return this._config[options];
            } else {
                return this._config;
            }
        };

        // Used to define a custom driver, shared across all instances of
        // localForage.


        LocalForage.prototype.defineDriver = function defineDriver(driverObject, callback, errorCallback) {
            var promise = new Promise$1(function (resolve, reject) {
                try {
                    var driverName = driverObject._driver;
                    var complianceError = new Error('Custom driver not compliant; see ' + 'https://mozilla.github.io/localForage/#definedriver');

                    // A driver name should be defined and not overlap with the
                    // library-defined, default drivers.
                    if (!driverObject._driver) {
                        reject(complianceError);
                        return;
                    }

                    var driverMethods = LibraryMethods.concat('_initStorage');
                    for (var i = 0, len = driverMethods.length; i < len; i++) {
                        var driverMethodName = driverMethods[i];

                        // when the property is there,
                        // it should be a method even when optional
                        var isRequired = !includes(OptionalDriverMethods, driverMethodName);
                        if ((isRequired || driverObject[driverMethodName]) && typeof driverObject[driverMethodName] !== 'function') {
                            reject(complianceError);
                            return;
                        }
                    }

                    var configureMissingMethods = function configureMissingMethods() {
                        var methodNotImplementedFactory = function methodNotImplementedFactory(methodName) {
                            return function () {
                                var error = new Error('Method ' + methodName + ' is not implemented by the current driver');
                                var promise = Promise$1.reject(error);
                                executeCallback(promise, arguments[arguments.length - 1]);
                                return promise;
                            };
                        };

                        for (var _i = 0, _len = OptionalDriverMethods.length; _i < _len; _i++) {
                            var optionalDriverMethod = OptionalDriverMethods[_i];
                            if (!driverObject[optionalDriverMethod]) {
                                driverObject[optionalDriverMethod] = methodNotImplementedFactory(optionalDriverMethod);
                            }
                        }
                    };

                    configureMissingMethods();

                    var setDriverSupport = function setDriverSupport(support) {
                        if (DefinedDrivers[driverName]) {
                            console.info('Redefining LocalForage driver: ' + driverName);
                        }
                        DefinedDrivers[driverName] = driverObject;
                        DriverSupport[driverName] = support;
                        // don't use a then, so that we can define
                        // drivers that have simple _support methods
                        // in a blocking manner
                        resolve();
                    };

                    if ('_support' in driverObject) {
                        if (driverObject._support && typeof driverObject._support === 'function') {
                            driverObject._support().then(setDriverSupport, reject);
                        } else {
                            setDriverSupport(!!driverObject._support);
                        }
                    } else {
                        setDriverSupport(true);
                    }
                } catch (e) {
                    reject(e);
                }
            });

            executeTwoCallbacks(promise, callback, errorCallback);
            return promise;
        };

        LocalForage.prototype.driver = function driver() {
            return this._driver || null;
        };

        LocalForage.prototype.getDriver = function getDriver(driverName, callback, errorCallback) {
            var getDriverPromise = DefinedDrivers[driverName] ? Promise$1.resolve(DefinedDrivers[driverName]) : Promise$1.reject(new Error('Driver not found.'));

            executeTwoCallbacks(getDriverPromise, callback, errorCallback);
            return getDriverPromise;
        };

        LocalForage.prototype.getSerializer = function getSerializer(callback) {
            var serializerPromise = Promise$1.resolve(localforageSerializer);
            executeTwoCallbacks(serializerPromise, callback);
            return serializerPromise;
        };

        LocalForage.prototype.ready = function ready(callback) {
            var self = this;

            var promise = self._driverSet.then(function () {
                if (self._ready === null) {
                    self._ready = self._initDriver();
                }

                return self._ready;
            });

            executeTwoCallbacks(promise, callback, callback);
            return promise;
        };

        LocalForage.prototype.setDriver = function setDriver(drivers, callback, errorCallback) {
            var self = this;

            if (!isArray(drivers)) {
                drivers = [drivers];
            }

            var supportedDrivers = this._getSupportedDrivers(drivers);

            function setDriverToConfig() {
                self._config.driver = self.driver();
            }

            function extendSelfWithDriver(driver) {
                self._extend(driver);
                setDriverToConfig();

                self._ready = self._initStorage(self._config);
                return self._ready;
            }

            function initDriver(supportedDrivers) {
                return function () {
                    var currentDriverIndex = 0;

                    function driverPromiseLoop() {
                        while (currentDriverIndex < supportedDrivers.length) {
                            var driverName = supportedDrivers[currentDriverIndex];
                            currentDriverIndex++;

                            self._dbInfo = null;
                            self._ready = null;

                            return self.getDriver(driverName).then(extendSelfWithDriver)["catch"](driverPromiseLoop);
                        }

                        setDriverToConfig();
                        var error = new Error('No available storage method found.');
                        self._driverSet = Promise$1.reject(error);
                        return self._driverSet;
                    }

                    return driverPromiseLoop();
                };
            }

            // There might be a driver initialization in progress
            // so wait for it to finish in order to avoid a possible
            // race condition to set _dbInfo
            var oldDriverSetDone = this._driverSet !== null ? this._driverSet["catch"](function () {
                return Promise$1.resolve();
            }) : Promise$1.resolve();

            this._driverSet = oldDriverSetDone.then(function () {
                var driverName = supportedDrivers[0];
                self._dbInfo = null;
                self._ready = null;

                return self.getDriver(driverName).then(function (driver) {
                    self._driver = driver._driver;
                    setDriverToConfig();
                    self._wrapLibraryMethodsWithReady();
                    self._initDriver = initDriver(supportedDrivers);
                });
            })["catch"](function () {
                setDriverToConfig();
                var error = new Error('No available storage method found.');
                self._driverSet = Promise$1.reject(error);
                return self._driverSet;
            });

            executeTwoCallbacks(this._driverSet, callback, errorCallback);
            return this._driverSet;
        };

        LocalForage.prototype.supports = function supports(driverName) {
            return !!DriverSupport[driverName];
        };

        LocalForage.prototype._extend = function _extend(libraryMethodsAndProperties) {
            extend(this, libraryMethodsAndProperties);
        };

        LocalForage.prototype._getSupportedDrivers = function _getSupportedDrivers(drivers) {
            var supportedDrivers = [];
            for (var i = 0, len = drivers.length; i < len; i++) {
                var driverName = drivers[i];
                if (this.supports(driverName)) {
                    supportedDrivers.push(driverName);
                }
            }
            return supportedDrivers;
        };

        LocalForage.prototype._wrapLibraryMethodsWithReady = function _wrapLibraryMethodsWithReady() {
            // Add a stub for each driver API method that delays the call to the
            // corresponding driver method until localForage is ready. These stubs
            // will be replaced by the driver methods as soon as the driver is
            // loaded, so there is no performance impact.
            for (var i = 0, len = LibraryMethods.length; i < len; i++) {
                callWhenReady(this, LibraryMethods[i]);
            }
        };

        LocalForage.prototype.createInstance = function createInstance(options) {
            return new LocalForage(options);
        };

        return LocalForage;
    }();

    // The actual localForage object that we expose as a module or via a
    // global. It's extended by pulling in one of our other libraries.


    var localforage_js = new LocalForage();

    module.exports = localforage_js;

    },{"3":3}]},{},[4])(4)
    });
    });

    localforage.config({
        name: localStorageDatabaseName,
        storeName: localStorageDatabaseName
    });

    const getFromStorage = async table => {
        if (localStorageCacheTimeout[table] && localStorageCacheTimeout[table] > 0) {
            const fetchTime = await localforage.getItem(`${localStorageFetchTimeTablePrefix}_${table}`);

            if (fetchTime && Date.now() - fetchTime > localStorageCacheTimeout[table]) {
                // Expire the cache if it's too old
                console.log(`Cache expired for ${table}.`);
                return null;
            }
        }

        console.log(`Fetching ${table} from local storage`);
        const data = await localforage.getItem(table);

        return data;
    };

    const saveToStorage = async (table, data) => {
        if (localStorageCacheTimeout[table] && localStorageCacheTimeout[table] > 0) {
            // Set the last time data were saved to storage
            localforage.setItem(`${localStorageFetchTimeTablePrefix}_${table}`, Date.now());
        }

        console.log(`Saving ${table} to local storage`);

        // Set the data to storage
        localforage.setItem(table, data);
    };

    const getTickersFromApi = async () => {
        const tickersResponse = await fetch(apiUrls.tickers);
        let tickersJson = await tickersResponse.json();

        {
            // Remove coins with too low volume
            tickersJson = tickersJson.filter(ticker => ticker.quotes.USD.volume_24h > minVolumeToView);
        }

        {
            // Remove coins with too low marketcap
            tickersJson = tickersJson.filter(ticker => ticker.quotes.USD.market_cap > minMarketCapToView);
        }

        return tickersJson;
    };

    const addMarketToTickers = async (tickersResponse, exchange) => {
        const response = await fetch(apiUrls.markets[exchange]);
        const markets = await response.json();

        markets.forEach(market => {
            const matchingTicker = tickersResponse.find(x => x.id === market.base_currency_id);

            if (matchingTicker) {
                if (!matchingTicker.exchanges) matchingTicker.exchanges = [];

                if (exchange === 'coinbasePro') exchange = 'coinbase';

                if (!matchingTicker.exchanges.includes(exchange)) {
                    matchingTicker.exchanges.push(exchange);
                }
            }
        });

        return tickersResponse;
    };

    const getTickers = async () => {
        const tickersFromStorage = await getFromStorage(localStorageTickersTable);

        if (tickersFromStorage) {
            // If tickers are saved in localForage, use that
            tickers.save(tickersFromStorage);
            global$1.isLoading(false);
        } else {
            // If it's not stored, get the data from API
            console.log(`Fetching tickers from API.`);
            getTickersFromApi().then(async tickersResponse => {
                tickersResponse = await addMarketToTickers(tickersResponse, 'coinbasePro');
                tickersResponse = await addMarketToTickers(tickersResponse, 'binance');
                tickersResponse = await addMarketToTickers(tickersResponse, 'idex');
                tickersResponse = await addMarketToTickers(tickersResponse, 'idax');
                tickersResponse = await addMarketToTickers(tickersResponse, 'kraken');
                tickersResponse = await addMarketToTickers(tickersResponse, 'kucoin');
                tickersResponse = await addMarketToTickers(tickersResponse, 'okex');
                tickersResponse = await addMarketToTickers(tickersResponse, 'uniswap');

                tickers.save(tickersResponse);
                global$1.isLoading(false);

                // Save the API data to localForage
                saveToStorage(localStorageTickersTable, tickersResponse);
            });
        }
    };

    const initValue$2 = {
        marketCap: '?',
        volume24h: '?',
        btcDominance: '?'
    };

    const globalMarketStore = () => {
        const { subscribe, set } = writable(initValue$2);

        return {
            subscribe,
            save: data => {
                const newData = {
                    marketCap: data.market_cap_usd,
                    volume24h: data.volume_24h_usd,
                    btcDominance: data.bitcoin_dominance_percentage
                };

                set(newData);
            }
        };
    };

    const globalMarket = globalMarketStore();

    const getGlobalMarketFromApi = async () => {
        const globalMarket = await fetch(apiUrls.globalMarket);
        let marketJson = await globalMarket.json();

        return marketJson;
    };

    const getGlobalMarket = async () => {
        const globalMarketFromStorage = await getFromStorage(localStorageGlobalMarketTable);

        if (globalMarketFromStorage) {
            // If global markets are saved in localForage, use that
            globalMarket.save(globalMarketFromStorage);
        } else {
            // If it's not stored, get the data from API
            console.log(`Fetching global markets from API.`);
            getGlobalMarketFromApi().then(async globalMarketsResponse => {
                globalMarket.save(globalMarketsResponse);

                // Save the API data to localForage
                saveToStorage(localStorageGlobalMarketTable, globalMarketsResponse);
            });
        }
    };

    /* src/components/GlobalMarket.svelte generated by Svelte v3.24.0 */
    const file = "src/components/GlobalMarket.svelte";

    function create_fragment(ctx) {
    	let ul;
    	let li0;
    	let t0;
    	let t1_value = /*$globalMarket*/ ctx[0].marketCap + "";
    	let t1;
    	let t2;
    	let li1;
    	let t3;
    	let t4_value = /*$globalMarket*/ ctx[0].volume24h + "";
    	let t4;
    	let t5;
    	let li2;
    	let t6;
    	let t7_value = /*$globalMarket*/ ctx[0].btcDominance + "";
    	let t7;
    	let t8;

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			li0 = element("li");
    			t0 = text("Total marketcap: $");
    			t1 = text(t1_value);
    			t2 = space();
    			li1 = element("li");
    			t3 = text("Total 24h volume: $");
    			t4 = text(t4_value);
    			t5 = space();
    			li2 = element("li");
    			t6 = text("BTC Dominance: ");
    			t7 = text(t7_value);
    			t8 = text("%");
    			attr_dev(li0, "class", "svelte-1xiadmx");
    			add_location(li0, file, 35, 4, 644);
    			attr_dev(li1, "class", "svelte-1xiadmx");
    			add_location(li1, file, 36, 4, 701);
    			attr_dev(li2, "class", "svelte-1xiadmx");
    			add_location(li2, file, 37, 4, 759);
    			attr_dev(ul, "class", "svelte-1xiadmx");
    			add_location(ul, file, 34, 0, 635);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);
    			append_dev(ul, li0);
    			append_dev(li0, t0);
    			append_dev(li0, t1);
    			append_dev(ul, t2);
    			append_dev(ul, li1);
    			append_dev(li1, t3);
    			append_dev(li1, t4);
    			append_dev(ul, t5);
    			append_dev(ul, li2);
    			append_dev(li2, t6);
    			append_dev(li2, t7);
    			append_dev(li2, t8);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$globalMarket*/ 1 && t1_value !== (t1_value = /*$globalMarket*/ ctx[0].marketCap + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*$globalMarket*/ 1 && t4_value !== (t4_value = /*$globalMarket*/ ctx[0].volume24h + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*$globalMarket*/ 1 && t7_value !== (t7_value = /*$globalMarket*/ ctx[0].btcDominance + "")) set_data_dev(t7, t7_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $globalMarket;
    	validate_store(globalMarket, "globalMarket");
    	component_subscribe($$self, globalMarket, $$value => $$invalidate(0, $globalMarket = $$value));

    	onMount(async () => {
    		getGlobalMarket();
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<GlobalMarket> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("GlobalMarket", $$slots, []);

    	$$self.$capture_state = () => ({
    		onMount,
    		globalMarket,
    		getGlobalMarket,
    		$globalMarket
    	});

    	return [$globalMarket];
    }

    class GlobalMarket extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GlobalMarket",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const initValue$3 = {
        by: '24h',
        direction: 'desc'
    };

    const orderStore = () => {
        const { subscribe, set, update } = writable(initValue$3);

        return {
            subscribe,
            setOrderBy: orderBy => {
                update(order => {
                    let newOrder = { ...order };
                    newOrder.by = orderBy;
                    newOrder.direction = newOrder.direction === 'asc' ? 'desc' : 'asc';
                    return newOrder;
                });
            }
        };
    };

    const order = orderStore();

    const initValue$4 = {
        exchange: 'any',
        volume: 'all',
        marketCap: 'all',
        favorites: false
    };

    const filterStore = () => {
        const { subscribe, set, update } = writable(initValue$4);

        return {
            subscribe,
            update: filter => {
                update(filters => {
                    let newFilter = { ...filters };
                    newFilter.exchange = filter;
                    return newFilter;
                });
            },
            setExchange: filter => {
                update(filters => {
                    let newFilter = { ...filters };
                    newFilter.exchange = filter;
                    return newFilter;
                });
            },
            setVolume: filter => {
                update(filters => {
                    let newFilter = { ...filters };
                    newFilter.volume = filter;
                    return newFilter;
                });
            },
            setMarketCap: filter => {
                update(filters => {
                    let newFilter = { ...filters };
                    newFilter.marketCap = filter;
                    return newFilter;
                });
            },
            setFavorites: filter => {
                update(filters => {
                    let newFilter = { ...filters };
                    newFilter.favorites = filter;
                    return newFilter;
                });
            },
            reset: () => {
                set(initValue$4);
            }
        };
    };

    const filter = filterStore();

    const initValue$5 = {};

    const favoritesStore = () => {
        const { subscribe, set, update } = writable(initValue$5);

        return {
            subscribe,
            updateAll: data => {
                set(data);
            },
            toggle: symbol => {
                update(favorites => {
                    let newFavs = { ...favorites };

                    if (newFavs[symbol]) {
                        delete newFavs[symbol];
                    } else {
                        newFavs[symbol] = true;
                    }

                    return newFavs;
                });
            }
        };
    };

    const favorites = favoritesStore();

    const getFavoritesFromStorage = async () => {
        const favs = await getFromStorage(localStorageFavoritesTable);

        if (favs) {
            favorites.updateAll(favs);
        }
    };

    getFavoritesFromStorage().then(() => {
        // Auto save changes to storage
        favorites.subscribe(favs => {
            saveToStorage(localStorageFavoritesTable, favs);
        });
    });

    // >>> INTERFACES <<<
    // >>> HELPERS <<<
    var castComparer = function (comparer) { return function (a, b, order) { return comparer(a, b, order) * order; }; };
    var throwInvalidConfigErrorIfTrue = function (condition, context) {
        if (condition)
            throw Error("Invalid sort config: " + context);
    };
    var unpackObjectSorter = function (sortByObj) {
        var _a = sortByObj || {}, asc = _a.asc, desc = _a.desc;
        var order = asc ? 1 : -1;
        var sortBy = (asc || desc);
        // Validate object config
        throwInvalidConfigErrorIfTrue(!sortBy, 'Expected `asc` or `desc` property');
        throwInvalidConfigErrorIfTrue(asc && desc, 'Ambiguous object with `asc` and `desc` config properties');
        var comparer = sortByObj.comparer && castComparer(sortByObj.comparer);
        return { order: order, sortBy: sortBy, comparer: comparer };
    };
    // >>> SORTERS <<<
    var multiPropertySorterProvider = function (defaultComparer) {
        return function multiPropertySorter(sortBy, sortByArr, depth, order, comparer, a, b) {
            var valA;
            var valB;
            if (typeof sortBy === 'string') {
                valA = a[sortBy];
                valB = b[sortBy];
            }
            else if (typeof sortBy === 'function') {
                valA = sortBy(a);
                valB = sortBy(b);
            }
            else {
                var objectSorterConfig = unpackObjectSorter(sortBy);
                return multiPropertySorter(objectSorterConfig.sortBy, sortByArr, depth, objectSorterConfig.order, objectSorterConfig.comparer || defaultComparer, a, b);
            }
            var equality = comparer(valA, valB, order);
            if ((equality === 0 || (valA == null && valB == null)) &&
                sortByArr.length > depth) {
                return multiPropertySorter(sortByArr[depth], sortByArr, depth + 1, order, comparer, a, b);
            }
            return equality;
        };
    };
    function getSortStrategy(sortBy, comparer, order) {
        // Flat array sorter
        if (sortBy === undefined || sortBy === true) {
            return function (a, b) { return comparer(a, b, order); };
        }
        // Sort list of objects by single object key
        if (typeof sortBy === 'string') {
            throwInvalidConfigErrorIfTrue(sortBy.includes('.'), 'String syntax not allowed for nested properties.');
            return function (a, b) { return comparer(a[sortBy], b[sortBy], order); };
        }
        // Sort list of objects by single function sorter
        if (typeof sortBy === 'function') {
            return function (a, b) { return comparer(sortBy(a), sortBy(b), order); };
        }
        // Sort by multiple properties
        if (Array.isArray(sortBy)) {
            var multiPropSorter_1 = multiPropertySorterProvider(comparer);
            return function (a, b) { return multiPropSorter_1(sortBy[0], sortBy, 1, order, comparer, a, b); };
        }
        // Unpack object config to get actual sorter strategy
        var objectSorterConfig = unpackObjectSorter(sortBy);
        return getSortStrategy(objectSorterConfig.sortBy, objectSorterConfig.comparer || comparer, objectSorterConfig.order);
    }
    var sort = function (order, ctx, sortBy, comparer) {
        var _a;
        if (!Array.isArray(ctx)) {
            return ctx;
        }
        // Unwrap sortBy if array with only 1 value to get faster sort strategy
        if (Array.isArray(sortBy) && sortBy.length < 2) {
            _a = sortBy, sortBy = _a[0];
        }
        return ctx.sort(getSortStrategy(sortBy, comparer, order));
    };
    // >>> Public <<<
    function createSortInstance(opts) {
        var comparer = castComparer(opts.comparer);
        return function (ctx) {
            return {
                /**
                 * Sort array in ascending order. Mutates provided array by sorting it.
                 * @example
                 * sort([3, 1, 4]).asc();
                 * sort(users).asc(u => u.firstName);
                 * sort(users).asc([
                 *   U => u.firstName
                 *   u => u.lastName,
                 * ]);
                 */
                asc: function (sortBy) {
                    return sort(1, ctx, sortBy, comparer);
                },
                /**
                 * Sort array in descending order. Mutates provided array by sorting it.
                 * @example
                 * sort([3, 1, 4]).desc();
                 * sort(users).desc(u => u.firstName);
                 * sort(users).desc([
                 *   U => u.firstName
                 *   u => u.lastName,
                 * ]);
                 */
                desc: function (sortBy) {
                    return sort(-1, ctx, sortBy, comparer);
                },
                /**
                 * Sort array in ascending or descending order. It allows sorting on multiple props
                 * in different order for each of them. Mutates provided array by sorting it.
                 * @example
                 * sort(users).by([
                 *  { asc: u => u.score }
                 *  { desc: u => u.age }
                 * ]);
                 */
                by: function (sortBy) {
                    return sort(1, ctx, sortBy, comparer);
                },
            };
        };
    }
    var defaultSort = createSortInstance({
        comparer: function (a, b, order) {
            if (a == null)
                return order;
            if (b == null)
                return -order;
            if (a < b)
                return -1;
            if (a === b)
                return 0;
            return 1;
        },
    });
    // Attach createNewInstance to sort function
    defaultSort['createNewInstance'] = createSortInstance;

    const initValue$6 = [];

    const sortTickersByLambda = (tickers, lambda) => {
        const $order = get_store_value(order);

        if ($order.direction === 'asc') {
            return defaultSort(tickers).asc(lambda);
        } else {
            return defaultSort(tickers).desc(lambda);
        }
    };

    const orderTickers = tickers => {
        let newTickers = [...tickers];
        const $order = get_store_value(order);
        const $global = get_store_value(global$1);

        switch ($order.by) {
            case 'rank':
                newTickers = sortTickersByLambda(newTickers, x => x.rank);
                break;
            case 'symbol':
                newTickers = sortTickersByLambda(newTickers, x => x.symbol);
                break;
            case 'name':
                newTickers = sortTickersByLambda(newTickers, x => x.name);
                break;
            case 'price':
                newTickers = sortTickersByLambda(newTickers, x => x[$global.referenceCurrency].price);
                break;
            case 'volume_24h':
                newTickers = sortTickersByLambda(newTickers, x => x[$global.referenceCurrency].volume24h);
                break;
            case '1h':
                newTickers = sortTickersByLambda(newTickers, x => x[$global.referenceCurrency].change1h);
                break;
            case '12h':
                newTickers = sortTickersByLambda(newTickers, x => x[$global.referenceCurrency].change12h);
                break;
            case '24h':
                newTickers = sortTickersByLambda(newTickers, x => x[$global.referenceCurrency].change24h);
                break;
            case '7d':
                newTickers = sortTickersByLambda(newTickers, x => x[$global.referenceCurrency].change7d);
                break;
            case '30d':
                newTickers = sortTickersByLambda(newTickers, x => x[$global.referenceCurrency].change30d);
                break;
            case 'ath':
                newTickers = sortTickersByLambda(newTickers, x => x[$global.referenceCurrency].fromAth);
                break;
            default:
                newTickers = sortTickersByLambda(newTickers, x => x[$global.referenceCurrency].marketCap);
        }

        return newTickers;
    };

    const filteredTickersStore = () => {
        const { subscribe, set, update } = writable(initValue$6);

        return {
            subscribe,
            updateAll: data => {
                const newTickers = orderTickers(data);
                set(newTickers);
            },
            filter: () => {
                update(() => {
                    const $tickers = get_store_value(tickers);
                    const $filter = get_store_value(filter);
                    const $global = get_store_value(global$1);

                    let newTickers = [...$tickers];

                    if ($filter.favorites === true) {
                        const $favorites = get_store_value(favorites);
                        newTickers = newTickers.filter(ticker => $favorites.hasOwnProperty(ticker.symbol));
                    }

                    if ($filter.exchange === 'any') {
                        newTickers = newTickers.filter(ticker => ticker.exchanges && ticker.exchanges.length > 0);
                    } else if ($filter.exchange !== 'all') {
                        newTickers = newTickers.filter(
                            ticker => ticker.exchanges && ticker.exchanges.includes($filter.exchange)
                        );
                    }

                    if ($filter.volume === '0') {
                        newTickers = newTickers.filter(ticker => ticker[$global.referenceCurrency].volume24h < 100000);
                    }

                    if ($filter.volume === '100000') {
                        newTickers = newTickers.filter(
                            ticker =>
                                ticker[$global.referenceCurrency].volume24h >= 100000 &&
                                ticker[$global.referenceCurrency].volume24h <= 250000
                        );
                    }

                    if ($filter.volume === '250000') {
                        newTickers = newTickers.filter(
                            ticker =>
                                ticker[$global.referenceCurrency].volume24h > 250000 &&
                                ticker[$global.referenceCurrency].volume24h <= 500000
                        );
                    }

                    if ($filter.volume === '500000') {
                        newTickers = newTickers.filter(
                            ticker =>
                                ticker[$global.referenceCurrency].volume24h > 500000 &&
                                ticker[$global.referenceCurrency].volume24h <= 1000000
                        );
                    }

                    if ($filter.volume === '1000000') {
                        newTickers = newTickers.filter(
                            ticker =>
                                ticker[$global.referenceCurrency].volume24h > 1000000 &&
                                ticker[$global.referenceCurrency].volume24h <= 5000000
                        );
                    }

                    if ($filter.volume === '5000000') {
                        newTickers = newTickers.filter(
                            ticker =>
                                ticker[$global.referenceCurrency].volume24h > 5000000 &&
                                ticker[$global.referenceCurrency].volume24h <= 10000000
                        );
                    }

                    if ($filter.volume === '10000000') {
                        newTickers = newTickers.filter(
                            ticker =>
                                ticker[$global.referenceCurrency].volume24h > 10000000 &&
                                ticker[$global.referenceCurrency].volume24h <= 20000000
                        );
                    }

                    if ($filter.volume === '20000000') {
                        newTickers = newTickers.filter(
                            ticker =>
                                ticker[$global.referenceCurrency].volume24h > 20000000 &&
                                ticker[$global.referenceCurrency].volume24h <= 50000000
                        );
                    }

                    if ($filter.volume === '50000000') {
                        newTickers = newTickers.filter(ticker => ticker[$global.referenceCurrency].volume24h > 50000000);
                    }

                    if ($filter.marketCap === '0') {
                        newTickers = newTickers.filter(ticker => ticker[$global.referenceCurrency].marketCap < 100000);
                    }

                    if ($filter.marketCap === '100000') {
                        newTickers = newTickers.filter(
                            ticker =>
                                ticker[$global.referenceCurrency].marketCap >= 100000 &&
                                ticker[$global.referenceCurrency].marketCap <= 250000
                        );
                    }

                    if ($filter.marketCap === '250000') {
                        newTickers = newTickers.filter(
                            ticker =>
                                ticker[$global.referenceCurrency].marketCap > 250000 &&
                                ticker[$global.referenceCurrency].marketCap <= 500000
                        );
                    }

                    if ($filter.marketCap === '500000') {
                        newTickers = newTickers.filter(
                            ticker =>
                                ticker[$global.referenceCurrency].marketCap > 500000 &&
                                ticker[$global.referenceCurrency].marketCap <= 1000000
                        );
                    }

                    if ($filter.marketCap === '1000000') {
                        newTickers = newTickers.filter(
                            ticker =>
                                ticker[$global.referenceCurrency].marketCap > 1000000 &&
                                ticker[$global.referenceCurrency].marketCap <= 5000000
                        );
                    }

                    if ($filter.marketCap === '5000000') {
                        newTickers = newTickers.filter(
                            ticker =>
                                ticker[$global.referenceCurrency].marketCap > 5000000 &&
                                ticker[$global.referenceCurrency].marketCap <= 10000000
                        );
                    }

                    if ($filter.marketCap === '10000000') {
                        newTickers = newTickers.filter(
                            ticker =>
                                ticker[$global.referenceCurrency].marketCap > 10000000 &&
                                ticker[$global.referenceCurrency].marketCap <= 20000000
                        );
                    }

                    if ($filter.marketCap === '20000000') {
                        newTickers = newTickers.filter(
                            ticker =>
                                ticker[$global.referenceCurrency].marketCap > 20000000 &&
                                ticker[$global.referenceCurrency].marketCap <= 50000000
                        );
                    }

                    if ($filter.marketCap === '50000000') {
                        newTickers = newTickers.filter(ticker => ticker[$global.referenceCurrency].marketCap > 50000000);
                    }

                    return newTickers;
                });
            },
            order: () => {
                update(tickers => {
                    const newTickers = orderTickers(tickers);
                    return newTickers;
                });
            }
        };
    };

    const filteredTickers = filteredTickersStore();

    tickers.subscribe(tickers => {
        if (tickers.length <= 0) return;

        filteredTickers.updateAll(tickers);

        filter.subscribe(filter => {
            filteredTickers.filter();
            filteredTickers.order();
        });
    });

    /* src/components/Filter.svelte generated by Svelte v3.24.0 */
    const file$1 = "src/components/Filter.svelte";

    function create_fragment$1(ctx) {
    	let div5;
    	let div0;
    	let label0;
    	let t1;
    	let select0;
    	let option0;
    	let option1;
    	let option2;
    	let option3;
    	let option4;
    	let option5;
    	let option6;
    	let option7;
    	let option8;
    	let option9;
    	let select0_value_value;
    	let t12;
    	let div1;
    	let label1;
    	let t14;
    	let select1;
    	let option10;
    	let option11;
    	let option12;
    	let option13;
    	let option14;
    	let option15;
    	let option16;
    	let option17;
    	let option18;
    	let option19;
    	let select1_value_value;
    	let t25;
    	let div2;
    	let label2;
    	let t27;
    	let select2;
    	let option20;
    	let option21;
    	let option22;
    	let option23;
    	let option24;
    	let option25;
    	let option26;
    	let option27;
    	let option28;
    	let option29;
    	let select2_value_value;
    	let t38;
    	let div3;
    	let label3;
    	let t40;
    	let input0;
    	let input0_checked_value;
    	let t41;
    	let div4;
    	let input1;
    	let t42;
    	let input2;
    	let t43;
    	let t44;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Exchange:";
    			t1 = space();
    			select0 = element("select");
    			option0 = element("option");
    			option0.textContent = "All";
    			option1 = element("option");
    			option1.textContent = "Any";
    			option2 = element("option");
    			option2.textContent = "Binance";
    			option3 = element("option");
    			option3.textContent = "Coinbase";
    			option4 = element("option");
    			option4.textContent = "IDAX";
    			option5 = element("option");
    			option5.textContent = "IDEX";
    			option6 = element("option");
    			option6.textContent = "Kraken";
    			option7 = element("option");
    			option7.textContent = "Kucoin";
    			option8 = element("option");
    			option8.textContent = "OKEx";
    			option9 = element("option");
    			option9.textContent = "UniSwap";
    			t12 = space();
    			div1 = element("div");
    			label1 = element("label");
    			label1.textContent = "MarketCap:";
    			t14 = space();
    			select1 = element("select");
    			option10 = element("option");
    			option10.textContent = "All";
    			option11 = element("option");
    			option11.textContent = "0 - 100k";
    			option12 = element("option");
    			option12.textContent = "100k - 250k";
    			option13 = element("option");
    			option13.textContent = "250k - 500k";
    			option14 = element("option");
    			option14.textContent = "500k - 1m";
    			option15 = element("option");
    			option15.textContent = "1m - 5m";
    			option16 = element("option");
    			option16.textContent = "5m - 10m";
    			option17 = element("option");
    			option17.textContent = "10m - 20m";
    			option18 = element("option");
    			option18.textContent = "20m - 50m";
    			option19 = element("option");
    			option19.textContent = "50m+";
    			t25 = space();
    			div2 = element("div");
    			label2 = element("label");
    			label2.textContent = "Volume:";
    			t27 = space();
    			select2 = element("select");
    			option20 = element("option");
    			option20.textContent = "All";
    			option21 = element("option");
    			option21.textContent = "0 - 100k";
    			option22 = element("option");
    			option22.textContent = "100k - 250k";
    			option23 = element("option");
    			option23.textContent = "250k - 500k";
    			option24 = element("option");
    			option24.textContent = "500k - 1m";
    			option25 = element("option");
    			option25.textContent = "1m - 5m";
    			option26 = element("option");
    			option26.textContent = "5m - 10m";
    			option27 = element("option");
    			option27.textContent = "10m - 20m";
    			option28 = element("option");
    			option28.textContent = "20m - 50m";
    			option29 = element("option");
    			option29.textContent = "50m+";
    			t38 = space();
    			div3 = element("div");
    			label3 = element("label");
    			label3.textContent = "Favs only:";
    			t40 = space();
    			input0 = element("input");
    			t41 = space();
    			div4 = element("div");
    			input1 = element("input");
    			t42 = text("\n        USD\n        ");
    			input2 = element("input");
    			t43 = text("\n        BTC");
    			t44 = space();
    			button = element("button");
    			button.textContent = "Reset";
    			attr_dev(label0, "for", "filter-exchange");
    			attr_dev(label0, "class", "svelte-rbajb3");
    			add_location(label0, file$1, 84, 8, 1733);
    			option0.__value = "all";
    			option0.value = option0.__value;
    			add_location(option0, file$1, 86, 12, 1911);
    			option1.__value = "any";
    			option1.value = option1.__value;
    			add_location(option1, file$1, 87, 12, 1956);
    			option2.__value = "binance";
    			option2.value = option2.__value;
    			add_location(option2, file$1, 88, 12, 2001);
    			option3.__value = "coinbase";
    			option3.value = option3.__value;
    			add_location(option3, file$1, 89, 12, 2054);
    			option4.__value = "idax";
    			option4.value = option4.__value;
    			add_location(option4, file$1, 90, 12, 2109);
    			option5.__value = "idex";
    			option5.value = option5.__value;
    			add_location(option5, file$1, 91, 12, 2156);
    			option6.__value = "kraken";
    			option6.value = option6.__value;
    			add_location(option6, file$1, 92, 12, 2203);
    			option7.__value = "kucoin";
    			option7.value = option7.__value;
    			add_location(option7, file$1, 93, 12, 2254);
    			option8.__value = "okex";
    			option8.value = option8.__value;
    			add_location(option8, file$1, 94, 12, 2305);
    			option9.__value = "uniswap";
    			option9.value = option9.__value;
    			add_location(option9, file$1, 95, 12, 2352);
    			attr_dev(select0, "id", "filter-exchange");
    			attr_dev(select0, "name", "filter-exchange");
    			attr_dev(select0, "class", "svelte-rbajb3");
    			add_location(select0, file$1, 85, 8, 1788);
    			attr_dev(div0, "class", "filter-item svelte-rbajb3");
    			add_location(div0, file$1, 83, 4, 1699);
    			attr_dev(label1, "for", "filter-marketcap");
    			attr_dev(label1, "class", "svelte-rbajb3");
    			add_location(label1, file$1, 100, 8, 2461);
    			option10.__value = "all";
    			option10.value = option10.__value;
    			add_location(option10, file$1, 106, 12, 2693);
    			option11.__value = "0";
    			option11.value = option11.__value;
    			add_location(option11, file$1, 107, 12, 2738);
    			option12.__value = "100000";
    			option12.value = option12.__value;
    			add_location(option12, file$1, 108, 12, 2786);
    			option13.__value = "250000";
    			option13.value = option13.__value;
    			add_location(option13, file$1, 109, 12, 2842);
    			option14.__value = "500000";
    			option14.value = option14.__value;
    			add_location(option14, file$1, 110, 12, 2898);
    			option15.__value = "1000000";
    			option15.value = option15.__value;
    			add_location(option15, file$1, 111, 12, 2952);
    			option16.__value = "5000000";
    			option16.value = option16.__value;
    			add_location(option16, file$1, 112, 12, 3005);
    			option17.__value = "10000000";
    			option17.value = option17.__value;
    			add_location(option17, file$1, 113, 12, 3059);
    			option18.__value = "20000000";
    			option18.value = option18.__value;
    			add_location(option18, file$1, 114, 12, 3115);
    			option19.__value = "50000000";
    			option19.value = option19.__value;
    			add_location(option19, file$1, 115, 12, 3171);
    			attr_dev(select1, "id", "filter-marketcap");
    			attr_dev(select1, "name", "filter-marketcap");
    			attr_dev(select1, "class", "svelte-rbajb3");
    			add_location(select1, file$1, 101, 8, 2518);
    			attr_dev(div1, "class", "filter-item svelte-rbajb3");
    			add_location(div1, file$1, 99, 4, 2427);
    			attr_dev(label2, "for", "filter-volume");
    			attr_dev(label2, "class", "svelte-rbajb3");
    			add_location(label2, file$1, 120, 8, 3278);
    			option20.__value = "all";
    			option20.value = option20.__value;
    			add_location(option20, file$1, 122, 12, 3444);
    			option21.__value = "0";
    			option21.value = option21.__value;
    			add_location(option21, file$1, 123, 12, 3489);
    			option22.__value = "100000";
    			option22.value = option22.__value;
    			add_location(option22, file$1, 124, 12, 3537);
    			option23.__value = "250000";
    			option23.value = option23.__value;
    			add_location(option23, file$1, 125, 12, 3593);
    			option24.__value = "500000";
    			option24.value = option24.__value;
    			add_location(option24, file$1, 126, 12, 3649);
    			option25.__value = "1000000";
    			option25.value = option25.__value;
    			add_location(option25, file$1, 127, 12, 3703);
    			option26.__value = "5000000";
    			option26.value = option26.__value;
    			add_location(option26, file$1, 128, 12, 3756);
    			option27.__value = "10000000";
    			option27.value = option27.__value;
    			add_location(option27, file$1, 129, 12, 3810);
    			option28.__value = "20000000";
    			option28.value = option28.__value;
    			add_location(option28, file$1, 130, 12, 3866);
    			option29.__value = "50000000";
    			option29.value = option29.__value;
    			add_location(option29, file$1, 131, 12, 3922);
    			attr_dev(select2, "id", "filter-volume");
    			attr_dev(select2, "name", "filter-volume");
    			attr_dev(select2, "class", "svelte-rbajb3");
    			add_location(select2, file$1, 121, 8, 3329);
    			attr_dev(div2, "class", "filter-item svelte-rbajb3");
    			add_location(div2, file$1, 119, 4, 3244);
    			attr_dev(label3, "for", "filter-favorites");
    			attr_dev(label3, "class", "svelte-rbajb3");
    			add_location(label3, file$1, 136, 8, 4029);
    			attr_dev(input0, "type", "checkbox");
    			attr_dev(input0, "id", "filter-favorites");
    			attr_dev(input0, "name", "filter-favorites");
    			input0.checked = input0_checked_value = /*$filter*/ ctx[0].favorites;
    			attr_dev(input0, "class", "svelte-rbajb3");
    			add_location(input0, file$1, 137, 8, 4086);
    			attr_dev(div3, "class", "filter-item svelte-rbajb3");
    			add_location(div3, file$1, 135, 4, 3995);
    			attr_dev(input1, "type", "radio");
    			attr_dev(input1, "name", "referenceCurrency");
    			input1.value = "usd";
    			input1.checked = true;
    			attr_dev(input1, "class", "svelte-rbajb3");
    			add_location(input1, file$1, 146, 8, 4330);
    			attr_dev(input2, "type", "radio");
    			attr_dev(input2, "name", "referenceCurrency");
    			input2.value = "btc";
    			attr_dev(input2, "class", "svelte-rbajb3");
    			add_location(input2, file$1, 148, 8, 4459);
    			attr_dev(div4, "class", "filter-item svelte-rbajb3");
    			add_location(div4, file$1, 145, 4, 4296);
    			attr_dev(button, "class", "svelte-rbajb3");
    			add_location(button, file$1, 152, 4, 4588);
    			attr_dev(div5, "class", "filters svelte-rbajb3");
    			add_location(div5, file$1, 82, 0, 1673);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div0);
    			append_dev(div0, label0);
    			append_dev(div0, t1);
    			append_dev(div0, select0);
    			append_dev(select0, option0);
    			append_dev(select0, option1);
    			append_dev(select0, option2);
    			append_dev(select0, option3);
    			append_dev(select0, option4);
    			append_dev(select0, option5);
    			append_dev(select0, option6);
    			append_dev(select0, option7);
    			append_dev(select0, option8);
    			append_dev(select0, option9);
    			select_option(select0, /*$filter*/ ctx[0].exchange);
    			append_dev(div5, t12);
    			append_dev(div5, div1);
    			append_dev(div1, label1);
    			append_dev(div1, t14);
    			append_dev(div1, select1);
    			append_dev(select1, option10);
    			append_dev(select1, option11);
    			append_dev(select1, option12);
    			append_dev(select1, option13);
    			append_dev(select1, option14);
    			append_dev(select1, option15);
    			append_dev(select1, option16);
    			append_dev(select1, option17);
    			append_dev(select1, option18);
    			append_dev(select1, option19);
    			select_option(select1, /*$filter*/ ctx[0].marketCap);
    			append_dev(div5, t25);
    			append_dev(div5, div2);
    			append_dev(div2, label2);
    			append_dev(div2, t27);
    			append_dev(div2, select2);
    			append_dev(select2, option20);
    			append_dev(select2, option21);
    			append_dev(select2, option22);
    			append_dev(select2, option23);
    			append_dev(select2, option24);
    			append_dev(select2, option25);
    			append_dev(select2, option26);
    			append_dev(select2, option27);
    			append_dev(select2, option28);
    			append_dev(select2, option29);
    			select_option(select2, /*$filter*/ ctx[0].volume);
    			append_dev(div5, t38);
    			append_dev(div5, div3);
    			append_dev(div3, label3);
    			append_dev(div3, t40);
    			append_dev(div3, input0);
    			append_dev(div5, t41);
    			append_dev(div5, div4);
    			append_dev(div4, input1);
    			append_dev(div4, t42);
    			append_dev(div4, input2);
    			append_dev(div4, t43);
    			append_dev(div5, t44);
    			append_dev(div5, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(select0, "blur", /*blur_handler*/ ctx[7], false, false, false),
    					listen_dev(select1, "blur", /*blur_handler_1*/ ctx[8], false, false, false),
    					listen_dev(select2, "blue", /*blue_handler*/ ctx[9], false, false, false),
    					listen_dev(input0, "blur", /*blur_handler_2*/ ctx[10], false, false, false),
    					listen_dev(input1, "change", /*change_handler*/ ctx[11], false, false, false),
    					listen_dev(input2, "change", /*change_handler_1*/ ctx[12], false, false, false),
    					listen_dev(button, "click", /*resetFilters*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$filter*/ 1 && select0_value_value !== (select0_value_value = /*$filter*/ ctx[0].exchange)) {
    				select_option(select0, /*$filter*/ ctx[0].exchange);
    			}

    			if (dirty & /*$filter*/ 1 && select1_value_value !== (select1_value_value = /*$filter*/ ctx[0].marketCap)) {
    				select_option(select1, /*$filter*/ ctx[0].marketCap);
    			}

    			if (dirty & /*$filter*/ 1 && select2_value_value !== (select2_value_value = /*$filter*/ ctx[0].volume)) {
    				select_option(select2, /*$filter*/ ctx[0].volume);
    			}

    			if (dirty & /*$filter*/ 1 && input0_checked_value !== (input0_checked_value = /*$filter*/ ctx[0].favorites)) {
    				prop_dev(input0, "checked", input0_checked_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $filter;
    	validate_store(filter, "filter");
    	component_subscribe($$self, filter, $$value => $$invalidate(0, $filter = $$value));

    	const filterExchange = e => {
    		filter.setExchange(e.target.value);
    	};

    	const filterVolume = e => {
    		filter.setVolume(e.target.value);
    	};

    	const filterMarketCap = e => {
    		filter.setMarketCap(e.target.value);
    	};

    	const filterFavorites = e => {
    		filter.setFavorites(e.target.checked);
    	};

    	const setReferenceCurrency = e => {
    		global$1.setReferenceCurrency(e.target.value);
    	};

    	const resetFilters = () => {
    		filter.reset();
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Filter> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Filter", $$slots, []);
    	const blur_handler = e => filterExchange(e);
    	const blur_handler_1 = e => filterMarketCap(e);
    	const blue_handler = e => filterVolume(e);
    	const blur_handler_2 = e => filterFavorites(e);
    	const change_handler = e => setReferenceCurrency(e);
    	const change_handler_1 = e => setReferenceCurrency(e);

    	$$self.$capture_state = () => ({
    		filteredTickers,
    		filter,
    		global: global$1,
    		filterExchange,
    		filterVolume,
    		filterMarketCap,
    		filterFavorites,
    		setReferenceCurrency,
    		resetFilters,
    		$filter
    	});

    	return [
    		$filter,
    		filterExchange,
    		filterVolume,
    		filterMarketCap,
    		filterFavorites,
    		setReferenceCurrency,
    		resetFilters,
    		blur_handler,
    		blur_handler_1,
    		blue_handler,
    		blur_handler_2,
    		change_handler,
    		change_handler_1
    	];
    }

    class Filter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Filter",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    const initValue$7 = null;

    const selectedTickerStore = () => {
        const { subscribe, set } = writable(initValue$7);

        return {
            subscribe,
            set: ticker => {
                set(ticker);
            }
        };
    };

    const selectedTicker = selectedTickerStore();

    /* src/components/Favorite.svelte generated by Svelte v3.24.0 */
    const file$2 = "src/components/Favorite.svelte";

    // (31:35) {:else}
    function create_else_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("☆");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(31:35) {:else}",
    		ctx
    	});

    	return block;
    }

    // (31:4) {#if $favorites[tickerSymbol]}
    function create_if_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("★");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(31:4) {#if $favorites[tickerSymbol]}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let span;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*$favorites*/ ctx[1][/*tickerSymbol*/ ctx[0]]) return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if_block.c();
    			attr_dev(span, "class", "favorite svelte-5in1vg");
    			add_location(span, file$2, 29, 0, 561);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			if_block.m(span, null);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*click_handler*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(span, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $favorites;
    	validate_store(favorites, "favorites");
    	component_subscribe($$self, favorites, $$value => $$invalidate(1, $favorites = $$value));
    	let { tickerSymbol } = $$props;

    	const toggleFavorite = symbol => {
    		favorites.toggle(symbol);
    	};

    	const writable_props = ["tickerSymbol"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Favorite> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Favorite", $$slots, []);
    	const click_handler = () => toggleFavorite(tickerSymbol);

    	$$self.$set = $$props => {
    		if ("tickerSymbol" in $$props) $$invalidate(0, tickerSymbol = $$props.tickerSymbol);
    	};

    	$$self.$capture_state = () => ({
    		favorites,
    		tickerSymbol,
    		toggleFavorite,
    		$favorites
    	});

    	$$self.$inject_state = $$props => {
    		if ("tickerSymbol" in $$props) $$invalidate(0, tickerSymbol = $$props.tickerSymbol);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [tickerSymbol, $favorites, toggleFavorite, click_handler];
    }

    class Favorite extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, not_equal, { tickerSymbol: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Favorite",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*tickerSymbol*/ ctx[0] === undefined && !("tickerSymbol" in props)) {
    			console.warn("<Favorite> was created without expected prop 'tickerSymbol'");
    		}
    	}

    	get tickerSymbol() {
    		throw new Error("<Favorite>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tickerSymbol(value) {
    		throw new Error("<Favorite>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Ticker.svelte generated by Svelte v3.24.0 */
    const file$3 = "src/components/Ticker.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (78:8) {#if ticker.exchanges}
    function create_if_block$1(ctx) {
    	let ul;
    	let each_value = /*ticker*/ ctx[0].exchanges;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "svelte-g7r63y");
    			add_location(ul, file$3, 78, 12, 2209);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*ticker*/ 1) {
    				each_value = /*ticker*/ ctx[0].exchanges;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(78:8) {#if ticker.exchanges}",
    		ctx
    	});

    	return block;
    }

    // (80:16) {#each ticker.exchanges as exchange}
    function create_each_block(ctx) {
    	let li;
    	let t_value = /*exchange*/ ctx[5] + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			add_location(li, file$3, 80, 20, 2287);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*ticker*/ 1 && t_value !== (t_value = /*exchange*/ ctx[5] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(80:16) {#each ticker.exchanges as exchange}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*ticker*/ ctx[0].rank + "";
    	let t0;
    	let t1;
    	let favorite;
    	let t2;
    	let td1;
    	let a0;
    	let t3_value = /*ticker*/ ctx[0].symbol + "";
    	let t3;
    	let t4;
    	let td2;
    	let a1;
    	let t5_value = /*ticker*/ ctx[0].name + "";
    	let t5;
    	let t6;
    	let td3;
    	let t7_value = /*$global*/ ctx[1].currencySymbol + "";
    	let t7;
    	let t8_value = /*ticker*/ ctx[0][/*$global*/ ctx[1].referenceCurrency].price + "";
    	let t8;
    	let t9;
    	let td4;
    	let t10_value = /*$global*/ ctx[1].currencySymbol + "";
    	let t10;
    	let t11_value = /*ticker*/ ctx[0][/*$global*/ ctx[1].referenceCurrency].marketCap + "";
    	let t11;
    	let t12;
    	let td5;
    	let t13_value = /*$global*/ ctx[1].currencySymbol + "";
    	let t13;
    	let t14_value = /*ticker*/ ctx[0][/*$global*/ ctx[1].referenceCurrency].volume24h.toFixed(0) + "";
    	let t14;
    	let t15;
    	let td6;
    	let t16_value = /*ticker*/ ctx[0][/*$global*/ ctx[1].referenceCurrency].change1h + "";
    	let t16;
    	let t17;
    	let t18;
    	let td7;
    	let t19_value = /*ticker*/ ctx[0][/*$global*/ ctx[1].referenceCurrency].change12h + "";
    	let t19;
    	let t20;
    	let t21;
    	let td8;
    	let t22_value = /*ticker*/ ctx[0][/*$global*/ ctx[1].referenceCurrency].change24h + "";
    	let t22;
    	let t23;
    	let t24;
    	let td9;
    	let img;
    	let img_src_value;
    	let t25;
    	let t26_value = /*ticker*/ ctx[0][/*$global*/ ctx[1].referenceCurrency].change7d + "";
    	let t26;
    	let t27;
    	let t28;
    	let td10;
    	let t29_value = /*ticker*/ ctx[0][/*$global*/ ctx[1].referenceCurrency].change30d + "";
    	let t29;
    	let t30;
    	let t31;
    	let td11;
    	let t32_value = /*ticker*/ ctx[0][/*$global*/ ctx[1].referenceCurrency].fromAth + "";
    	let t32;
    	let t33;
    	let t34;
    	let td12;
    	let current;
    	let mounted;
    	let dispose;

    	favorite = new Favorite({
    			props: { tickerSymbol: /*ticker*/ ctx[0].symbol },
    			$$inline: true
    		});

    	let if_block = /*ticker*/ ctx[0].exchanges && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			create_component(favorite.$$.fragment);
    			t2 = space();
    			td1 = element("td");
    			a0 = element("a");
    			t3 = text(t3_value);
    			t4 = space();
    			td2 = element("td");
    			a1 = element("a");
    			t5 = text(t5_value);
    			t6 = space();
    			td3 = element("td");
    			t7 = text(t7_value);
    			t8 = text(t8_value);
    			t9 = space();
    			td4 = element("td");
    			t10 = text(t10_value);
    			t11 = text(t11_value);
    			t12 = space();
    			td5 = element("td");
    			t13 = text(t13_value);
    			t14 = text(t14_value);
    			t15 = space();
    			td6 = element("td");
    			t16 = text(t16_value);
    			t17 = text("%");
    			t18 = space();
    			td7 = element("td");
    			t19 = text(t19_value);
    			t20 = text("%");
    			t21 = space();
    			td8 = element("td");
    			t22 = text(t22_value);
    			t23 = text("%");
    			t24 = space();
    			td9 = element("td");
    			img = element("img");
    			t25 = space();
    			t26 = text(t26_value);
    			t27 = text("%");
    			t28 = space();
    			td10 = element("td");
    			t29 = text(t29_value);
    			t30 = text("%");
    			t31 = space();
    			td11 = element("td");
    			t32 = text(t32_value);
    			t33 = text("%");
    			t34 = space();
    			td12 = element("td");
    			if (if_block) if_block.c();
    			attr_dev(td0, "class", "svelte-g7r63y");
    			add_location(td0, file$3, 46, 4, 798);
    			attr_dev(a0, "href", "");
    			attr_dev(a0, "class", "svelte-g7r63y");
    			add_location(a0, file$3, 51, 8, 902);
    			attr_dev(td1, "class", "svelte-g7r63y");
    			add_location(td1, file$3, 50, 4, 889);
    			attr_dev(a1, "href", "");
    			attr_dev(a1, "class", "svelte-g7r63y");
    			add_location(a1, file$3, 54, 8, 1010);
    			attr_dev(td2, "class", "svelte-g7r63y");
    			add_location(td2, file$3, 53, 4, 997);
    			attr_dev(td3, "class", "svelte-g7r63y");
    			add_location(td3, file$3, 56, 4, 1103);
    			attr_dev(td4, "class", "svelte-g7r63y");
    			add_location(td4, file$3, 57, 4, 1182);
    			attr_dev(td5, "class", "svelte-g7r63y");
    			add_location(td5, file$3, 58, 4, 1265);
    			attr_dev(td6, "class", "svelte-g7r63y");
    			add_location(td6, file$3, 59, 4, 1359);
    			attr_dev(td7, "class", "svelte-g7r63y");
    			add_location(td7, file$3, 60, 4, 1418);
    			attr_dev(td8, "class", "svelte-g7r63y");
    			add_location(td8, file$3, 61, 4, 1478);
    			attr_dev(img, "loading", "lazy");
    			attr_dev(img, "class", "graph-img svelte-g7r63y");
    			attr_dev(img, "width", "120");
    			attr_dev(img, "height", "23");
    			if (img.src !== (img_src_value = "https://graphs" + (Math.random() > 0.5 ? "2" : "") + ".coinpaprika.com/currency/chart/" + /*ticker*/ ctx[0].id + "/7d/chart.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			toggle_class(img, "positive", /*ticker*/ ctx[0][/*$global*/ ctx[1].referenceCurrency].change7d >= 0);
    			toggle_class(img, "negative", /*ticker*/ ctx[0][/*$global*/ ctx[1].referenceCurrency].change7d < 0);
    			add_location(img, file$3, 63, 8, 1551);
    			attr_dev(td9, "class", "svelte-g7r63y");
    			add_location(td9, file$3, 62, 4, 1538);
    			attr_dev(td10, "class", "svelte-g7r63y");
    			add_location(td10, file$3, 74, 4, 2025);
    			attr_dev(td11, "class", "svelte-g7r63y");
    			add_location(td11, file$3, 75, 4, 2085);
    			attr_dev(td12, "class", "exchanges svelte-g7r63y");
    			add_location(td12, file$3, 76, 4, 2143);
    			attr_dev(tr, "class", "svelte-g7r63y");
    			add_location(tr, file$3, 45, 0, 789);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(td0, t1);
    			mount_component(favorite, td0, null);
    			append_dev(tr, t2);
    			append_dev(tr, td1);
    			append_dev(td1, a0);
    			append_dev(a0, t3);
    			append_dev(tr, t4);
    			append_dev(tr, td2);
    			append_dev(td2, a1);
    			append_dev(a1, t5);
    			append_dev(tr, t6);
    			append_dev(tr, td3);
    			append_dev(td3, t7);
    			append_dev(td3, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td4);
    			append_dev(td4, t10);
    			append_dev(td4, t11);
    			append_dev(tr, t12);
    			append_dev(tr, td5);
    			append_dev(td5, t13);
    			append_dev(td5, t14);
    			append_dev(tr, t15);
    			append_dev(tr, td6);
    			append_dev(td6, t16);
    			append_dev(td6, t17);
    			append_dev(tr, t18);
    			append_dev(tr, td7);
    			append_dev(td7, t19);
    			append_dev(td7, t20);
    			append_dev(tr, t21);
    			append_dev(tr, td8);
    			append_dev(td8, t22);
    			append_dev(td8, t23);
    			append_dev(tr, t24);
    			append_dev(tr, td9);
    			append_dev(td9, img);
    			append_dev(td9, t25);
    			append_dev(td9, t26);
    			append_dev(td9, t27);
    			append_dev(tr, t28);
    			append_dev(tr, td10);
    			append_dev(td10, t29);
    			append_dev(td10, t30);
    			append_dev(tr, t31);
    			append_dev(tr, td11);
    			append_dev(td11, t32);
    			append_dev(td11, t33);
    			append_dev(tr, t34);
    			append_dev(tr, td12);
    			if (if_block) if_block.m(td12, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(a0, "click", prevent_default(/*click_handler*/ ctx[3]), false, true, false),
    					listen_dev(a1, "click", prevent_default(/*click_handler_1*/ ctx[4]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*ticker*/ 1) && t0_value !== (t0_value = /*ticker*/ ctx[0].rank + "")) set_data_dev(t0, t0_value);
    			const favorite_changes = {};
    			if (dirty & /*ticker*/ 1) favorite_changes.tickerSymbol = /*ticker*/ ctx[0].symbol;
    			favorite.$set(favorite_changes);
    			if ((!current || dirty & /*ticker*/ 1) && t3_value !== (t3_value = /*ticker*/ ctx[0].symbol + "")) set_data_dev(t3, t3_value);
    			if ((!current || dirty & /*ticker*/ 1) && t5_value !== (t5_value = /*ticker*/ ctx[0].name + "")) set_data_dev(t5, t5_value);
    			if ((!current || dirty & /*$global*/ 2) && t7_value !== (t7_value = /*$global*/ ctx[1].currencySymbol + "")) set_data_dev(t7, t7_value);
    			if ((!current || dirty & /*ticker, $global*/ 3) && t8_value !== (t8_value = /*ticker*/ ctx[0][/*$global*/ ctx[1].referenceCurrency].price + "")) set_data_dev(t8, t8_value);
    			if ((!current || dirty & /*$global*/ 2) && t10_value !== (t10_value = /*$global*/ ctx[1].currencySymbol + "")) set_data_dev(t10, t10_value);
    			if ((!current || dirty & /*ticker, $global*/ 3) && t11_value !== (t11_value = /*ticker*/ ctx[0][/*$global*/ ctx[1].referenceCurrency].marketCap + "")) set_data_dev(t11, t11_value);
    			if ((!current || dirty & /*$global*/ 2) && t13_value !== (t13_value = /*$global*/ ctx[1].currencySymbol + "")) set_data_dev(t13, t13_value);
    			if ((!current || dirty & /*ticker, $global*/ 3) && t14_value !== (t14_value = /*ticker*/ ctx[0][/*$global*/ ctx[1].referenceCurrency].volume24h.toFixed(0) + "")) set_data_dev(t14, t14_value);
    			if ((!current || dirty & /*ticker, $global*/ 3) && t16_value !== (t16_value = /*ticker*/ ctx[0][/*$global*/ ctx[1].referenceCurrency].change1h + "")) set_data_dev(t16, t16_value);
    			if ((!current || dirty & /*ticker, $global*/ 3) && t19_value !== (t19_value = /*ticker*/ ctx[0][/*$global*/ ctx[1].referenceCurrency].change12h + "")) set_data_dev(t19, t19_value);
    			if ((!current || dirty & /*ticker, $global*/ 3) && t22_value !== (t22_value = /*ticker*/ ctx[0][/*$global*/ ctx[1].referenceCurrency].change24h + "")) set_data_dev(t22, t22_value);

    			if (!current || dirty & /*ticker*/ 1 && img.src !== (img_src_value = "https://graphs" + (Math.random() > 0.5 ? "2" : "") + ".coinpaprika.com/currency/chart/" + /*ticker*/ ctx[0].id + "/7d/chart.svg")) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*ticker, $global*/ 3) {
    				toggle_class(img, "positive", /*ticker*/ ctx[0][/*$global*/ ctx[1].referenceCurrency].change7d >= 0);
    			}

    			if (dirty & /*ticker, $global*/ 3) {
    				toggle_class(img, "negative", /*ticker*/ ctx[0][/*$global*/ ctx[1].referenceCurrency].change7d < 0);
    			}

    			if ((!current || dirty & /*ticker, $global*/ 3) && t26_value !== (t26_value = /*ticker*/ ctx[0][/*$global*/ ctx[1].referenceCurrency].change7d + "")) set_data_dev(t26, t26_value);
    			if ((!current || dirty & /*ticker, $global*/ 3) && t29_value !== (t29_value = /*ticker*/ ctx[0][/*$global*/ ctx[1].referenceCurrency].change30d + "")) set_data_dev(t29, t29_value);
    			if ((!current || dirty & /*ticker, $global*/ 3) && t32_value !== (t32_value = /*ticker*/ ctx[0][/*$global*/ ctx[1].referenceCurrency].fromAth + "")) set_data_dev(t32, t32_value);

    			if (/*ticker*/ ctx[0].exchanges) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(td12, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(favorite.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(favorite.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(favorite);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $global;
    	validate_store(global$1, "global");
    	component_subscribe($$self, global$1, $$value => $$invalidate(1, $global = $$value));
    	let { ticker } = $$props;

    	const selectTicker = ticker => {
    		selectedTicker.set(ticker);
    	};

    	const writable_props = ["ticker"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Ticker> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Ticker", $$slots, []);
    	const click_handler = () => selectTicker(ticker);
    	const click_handler_1 = () => selectTicker(ticker);

    	$$self.$set = $$props => {
    		if ("ticker" in $$props) $$invalidate(0, ticker = $$props.ticker);
    	};

    	$$self.$capture_state = () => ({
    		selectedTicker,
    		favorites,
    		global: global$1,
    		Favorite,
    		ticker,
    		selectTicker,
    		$global
    	});

    	$$self.$inject_state = $$props => {
    		if ("ticker" in $$props) $$invalidate(0, ticker = $$props.ticker);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [ticker, $global, selectTicker, click_handler, click_handler_1];
    }

    class Ticker extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, not_equal, { ticker: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Ticker",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*ticker*/ ctx[0] === undefined && !("ticker" in props)) {
    			console.warn("<Ticker> was created without expected prop 'ticker'");
    		}
    	}

    	get ticker() {
    		throw new Error("<Ticker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ticker(value) {
    		throw new Error("<Ticker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Tickers.svelte generated by Svelte v3.24.0 */
    const file$4 = "src/components/Tickers.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	return child_ctx;
    }

    // (105:0) {:else}
    function create_else_block$1(ctx) {
    	let p;
    	let em;

    	const block = {
    		c: function create() {
    			p = element("p");
    			em = element("em");
    			em.textContent = "No matching coins...";
    			add_location(em, file$4, 106, 8, 3239);
    			add_location(p, file$4, 105, 4, 3227);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, em);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(105:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (45:0) {#if $filteredTickers.length > 0}
    function create_if_block$2(ctx) {
    	let div;
    	let table;
    	let tr;
    	let th0;
    	let t0;
    	let t1;
    	let th1;
    	let t2;
    	let t3;
    	let th2;
    	let t4;
    	let t5;
    	let th3;
    	let t6;
    	let t7;
    	let th4;
    	let t8;
    	let t9;
    	let th5;
    	let t10;
    	let t11;
    	let th6;
    	let t12;
    	let t13;
    	let th7;
    	let t14;
    	let t15;
    	let th8;
    	let t16;
    	let t17;
    	let th9;
    	let t18;
    	let t19;
    	let th10;
    	let t20;
    	let t21;
    	let th11;
    	let t22;
    	let t23;
    	let th12;
    	let t25;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*$order*/ ctx[1].by === "rank" && create_if_block_12(ctx);
    	let if_block1 = /*$order*/ ctx[1].by === "symbol" && create_if_block_11(ctx);
    	let if_block2 = /*$order*/ ctx[1].by === "name" && create_if_block_10(ctx);
    	let if_block3 = /*$order*/ ctx[1].by === "price" && create_if_block_9(ctx);
    	let if_block4 = /*$order*/ ctx[1].by === "marketcap" && create_if_block_8(ctx);
    	let if_block5 = /*$order*/ ctx[1].by === "volume_24h" && create_if_block_7(ctx);
    	let if_block6 = /*$order*/ ctx[1].by === "1h" && create_if_block_6(ctx);
    	let if_block7 = /*$order*/ ctx[1].by === "12h" && create_if_block_5(ctx);
    	let if_block8 = /*$order*/ ctx[1].by === "24h" && create_if_block_4(ctx);
    	let if_block9 = /*$order*/ ctx[1].by === "7d" && create_if_block_3(ctx);
    	let if_block10 = /*$order*/ ctx[1].by === "30d" && create_if_block_2(ctx);
    	let if_block11 = /*$order*/ ctx[1].by === "ath" && create_if_block_1(ctx);
    	let each_value = /*$filteredTickers*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");
    			table = element("table");
    			tr = element("tr");
    			th0 = element("th");
    			t0 = text("#\n                    ");
    			if (if_block0) if_block0.c();
    			t1 = space();
    			th1 = element("th");
    			t2 = text("Symbol\n                    ");
    			if (if_block1) if_block1.c();
    			t3 = space();
    			th2 = element("th");
    			t4 = text("Name\n                    ");
    			if (if_block2) if_block2.c();
    			t5 = space();
    			th3 = element("th");
    			t6 = text("Price\n                    ");
    			if (if_block3) if_block3.c();
    			t7 = space();
    			th4 = element("th");
    			t8 = text("Marketcap\n                    ");
    			if (if_block4) if_block4.c();
    			t9 = space();
    			th5 = element("th");
    			t10 = text("Volume 24h\n                    ");
    			if (if_block5) if_block5.c();
    			t11 = space();
    			th6 = element("th");
    			t12 = text("1h\n                    ");
    			if (if_block6) if_block6.c();
    			t13 = space();
    			th7 = element("th");
    			t14 = text("12h\n                    ");
    			if (if_block7) if_block7.c();
    			t15 = space();
    			th8 = element("th");
    			t16 = text("24h\n                    ");
    			if (if_block8) if_block8.c();
    			t17 = space();
    			th9 = element("th");
    			t18 = text("7d\n                    ");
    			if (if_block9) if_block9.c();
    			t19 = space();
    			th10 = element("th");
    			t20 = text("30d\n                    ");
    			if (if_block10) if_block10.c();
    			t21 = space();
    			th11 = element("th");
    			t22 = text("From ATH\n                    ");
    			if (if_block11) if_block11.c();
    			t23 = space();
    			th12 = element("th");
    			th12.textContent = "Exchanges";
    			t25 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(th0, "class", "svelte-bq0gta");
    			add_location(th0, file$4, 48, 16, 1070);
    			attr_dev(th1, "class", "svelte-bq0gta");
    			add_location(th1, file$4, 52, 16, 1230);
    			attr_dev(th2, "class", "svelte-bq0gta");
    			add_location(th2, file$4, 56, 16, 1399);
    			attr_dev(th3, "class", "svelte-bq0gta");
    			add_location(th3, file$4, 60, 16, 1562);
    			attr_dev(th4, "class", "svelte-bq0gta");
    			add_location(th4, file$4, 64, 16, 1728);
    			attr_dev(th5, "class", "svelte-bq0gta");
    			add_location(th5, file$4, 68, 16, 1906);
    			attr_dev(th6, "class", "svelte-bq0gta");
    			add_location(th6, file$4, 72, 16, 2087);
    			attr_dev(th7, "class", "svelte-bq0gta");
    			add_location(th7, file$4, 76, 16, 2244);
    			attr_dev(th8, "class", "svelte-bq0gta");
    			add_location(th8, file$4, 80, 16, 2404);
    			attr_dev(th9, "class", "svelte-bq0gta");
    			add_location(th9, file$4, 84, 16, 2564);
    			attr_dev(th10, "class", "svelte-bq0gta");
    			add_location(th10, file$4, 88, 16, 2721);
    			attr_dev(th11, "class", "svelte-bq0gta");
    			add_location(th11, file$4, 92, 16, 2881);
    			attr_dev(th12, "class", "svelte-bq0gta");
    			add_location(th12, file$4, 96, 16, 3046);
    			add_location(tr, file$4, 47, 12, 1049);
    			attr_dev(table, "class", "svelte-bq0gta");
    			add_location(table, file$4, 46, 8, 1029);
    			attr_dev(div, "class", "table-responsive svelte-bq0gta");
    			add_location(div, file$4, 45, 4, 990);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, table);
    			append_dev(table, tr);
    			append_dev(tr, th0);
    			append_dev(th0, t0);
    			if (if_block0) if_block0.m(th0, null);
    			append_dev(tr, t1);
    			append_dev(tr, th1);
    			append_dev(th1, t2);
    			if (if_block1) if_block1.m(th1, null);
    			append_dev(tr, t3);
    			append_dev(tr, th2);
    			append_dev(th2, t4);
    			if (if_block2) if_block2.m(th2, null);
    			append_dev(tr, t5);
    			append_dev(tr, th3);
    			append_dev(th3, t6);
    			if (if_block3) if_block3.m(th3, null);
    			append_dev(tr, t7);
    			append_dev(tr, th4);
    			append_dev(th4, t8);
    			if (if_block4) if_block4.m(th4, null);
    			append_dev(tr, t9);
    			append_dev(tr, th5);
    			append_dev(th5, t10);
    			if (if_block5) if_block5.m(th5, null);
    			append_dev(tr, t11);
    			append_dev(tr, th6);
    			append_dev(th6, t12);
    			if (if_block6) if_block6.m(th6, null);
    			append_dev(tr, t13);
    			append_dev(tr, th7);
    			append_dev(th7, t14);
    			if (if_block7) if_block7.m(th7, null);
    			append_dev(tr, t15);
    			append_dev(tr, th8);
    			append_dev(th8, t16);
    			if (if_block8) if_block8.m(th8, null);
    			append_dev(tr, t17);
    			append_dev(tr, th9);
    			append_dev(th9, t18);
    			if (if_block9) if_block9.m(th9, null);
    			append_dev(tr, t19);
    			append_dev(tr, th10);
    			append_dev(th10, t20);
    			if (if_block10) if_block10.m(th10, null);
    			append_dev(tr, t21);
    			append_dev(tr, th11);
    			append_dev(th11, t22);
    			if (if_block11) if_block11.m(th11, null);
    			append_dev(tr, t23);
    			append_dev(tr, th12);
    			append_dev(table, t25);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(th0, "click", /*click_handler*/ ctx[4], false, false, false),
    					listen_dev(th1, "click", /*click_handler_1*/ ctx[5], false, false, false),
    					listen_dev(th2, "click", /*click_handler_2*/ ctx[6], false, false, false),
    					listen_dev(th3, "click", /*click_handler_3*/ ctx[7], false, false, false),
    					listen_dev(th4, "click", /*click_handler_4*/ ctx[8], false, false, false),
    					listen_dev(th5, "click", /*click_handler_5*/ ctx[9], false, false, false),
    					listen_dev(th6, "click", /*click_handler_6*/ ctx[10], false, false, false),
    					listen_dev(th7, "click", /*click_handler_7*/ ctx[11], false, false, false),
    					listen_dev(th8, "click", /*click_handler_8*/ ctx[12], false, false, false),
    					listen_dev(th9, "click", /*click_handler_9*/ ctx[13], false, false, false),
    					listen_dev(th10, "click", /*click_handler_10*/ ctx[14], false, false, false),
    					listen_dev(th11, "click", /*click_handler_11*/ ctx[15], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*$order*/ ctx[1].by === "rank") {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_12(ctx);
    					if_block0.c();
    					if_block0.m(th0, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*$order*/ ctx[1].by === "symbol") {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_11(ctx);
    					if_block1.c();
    					if_block1.m(th1, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*$order*/ ctx[1].by === "name") {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_10(ctx);
    					if_block2.c();
    					if_block2.m(th2, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*$order*/ ctx[1].by === "price") {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_9(ctx);
    					if_block3.c();
    					if_block3.m(th3, null);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*$order*/ ctx[1].by === "marketcap") {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block_8(ctx);
    					if_block4.c();
    					if_block4.m(th4, null);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (/*$order*/ ctx[1].by === "volume_24h") {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);
    				} else {
    					if_block5 = create_if_block_7(ctx);
    					if_block5.c();
    					if_block5.m(th5, null);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}

    			if (/*$order*/ ctx[1].by === "1h") {
    				if (if_block6) {
    					if_block6.p(ctx, dirty);
    				} else {
    					if_block6 = create_if_block_6(ctx);
    					if_block6.c();
    					if_block6.m(th6, null);
    				}
    			} else if (if_block6) {
    				if_block6.d(1);
    				if_block6 = null;
    			}

    			if (/*$order*/ ctx[1].by === "12h") {
    				if (if_block7) {
    					if_block7.p(ctx, dirty);
    				} else {
    					if_block7 = create_if_block_5(ctx);
    					if_block7.c();
    					if_block7.m(th7, null);
    				}
    			} else if (if_block7) {
    				if_block7.d(1);
    				if_block7 = null;
    			}

    			if (/*$order*/ ctx[1].by === "24h") {
    				if (if_block8) {
    					if_block8.p(ctx, dirty);
    				} else {
    					if_block8 = create_if_block_4(ctx);
    					if_block8.c();
    					if_block8.m(th8, null);
    				}
    			} else if (if_block8) {
    				if_block8.d(1);
    				if_block8 = null;
    			}

    			if (/*$order*/ ctx[1].by === "7d") {
    				if (if_block9) {
    					if_block9.p(ctx, dirty);
    				} else {
    					if_block9 = create_if_block_3(ctx);
    					if_block9.c();
    					if_block9.m(th9, null);
    				}
    			} else if (if_block9) {
    				if_block9.d(1);
    				if_block9 = null;
    			}

    			if (/*$order*/ ctx[1].by === "30d") {
    				if (if_block10) {
    					if_block10.p(ctx, dirty);
    				} else {
    					if_block10 = create_if_block_2(ctx);
    					if_block10.c();
    					if_block10.m(th10, null);
    				}
    			} else if (if_block10) {
    				if_block10.d(1);
    				if_block10 = null;
    			}

    			if (/*$order*/ ctx[1].by === "ath") {
    				if (if_block11) {
    					if_block11.p(ctx, dirty);
    				} else {
    					if_block11 = create_if_block_1(ctx);
    					if_block11.c();
    					if_block11.m(th11, null);
    				}
    			} else if (if_block11) {
    				if_block11.d(1);
    				if_block11 = null;
    			}

    			if (dirty & /*$filteredTickers*/ 4) {
    				each_value = /*$filteredTickers*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(table, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			if (if_block6) if_block6.d();
    			if (if_block7) if_block7.d();
    			if (if_block8) if_block8.d();
    			if (if_block9) if_block9.d();
    			if (if_block10) if_block10.d();
    			if (if_block11) if_block11.d();
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(45:0) {#if $filteredTickers.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (51:20) {#if $order.by === 'rank'}
    function create_if_block_12(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*orderSymbol*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*orderSymbol*/ 1) set_data_dev(t, /*orderSymbol*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(51:20) {#if $order.by === 'rank'}",
    		ctx
    	});

    	return block;
    }

    // (55:20) {#if $order.by === 'symbol'}
    function create_if_block_11(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*orderSymbol*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*orderSymbol*/ 1) set_data_dev(t, /*orderSymbol*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(55:20) {#if $order.by === 'symbol'}",
    		ctx
    	});

    	return block;
    }

    // (59:20) {#if $order.by === 'name'}
    function create_if_block_10(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*orderSymbol*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*orderSymbol*/ 1) set_data_dev(t, /*orderSymbol*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(59:20) {#if $order.by === 'name'}",
    		ctx
    	});

    	return block;
    }

    // (63:20) {#if $order.by === 'price'}
    function create_if_block_9(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*orderSymbol*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*orderSymbol*/ 1) set_data_dev(t, /*orderSymbol*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(63:20) {#if $order.by === 'price'}",
    		ctx
    	});

    	return block;
    }

    // (67:20) {#if $order.by === 'marketcap'}
    function create_if_block_8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*orderSymbol*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*orderSymbol*/ 1) set_data_dev(t, /*orderSymbol*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(67:20) {#if $order.by === 'marketcap'}",
    		ctx
    	});

    	return block;
    }

    // (71:20) {#if $order.by === 'volume_24h'}
    function create_if_block_7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*orderSymbol*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*orderSymbol*/ 1) set_data_dev(t, /*orderSymbol*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(71:20) {#if $order.by === 'volume_24h'}",
    		ctx
    	});

    	return block;
    }

    // (75:20) {#if $order.by === '1h'}
    function create_if_block_6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*orderSymbol*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*orderSymbol*/ 1) set_data_dev(t, /*orderSymbol*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(75:20) {#if $order.by === '1h'}",
    		ctx
    	});

    	return block;
    }

    // (79:20) {#if $order.by === '12h'}
    function create_if_block_5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*orderSymbol*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*orderSymbol*/ 1) set_data_dev(t, /*orderSymbol*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(79:20) {#if $order.by === '12h'}",
    		ctx
    	});

    	return block;
    }

    // (83:20) {#if $order.by === '24h'}
    function create_if_block_4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*orderSymbol*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*orderSymbol*/ 1) set_data_dev(t, /*orderSymbol*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(83:20) {#if $order.by === '24h'}",
    		ctx
    	});

    	return block;
    }

    // (87:20) {#if $order.by === '7d'}
    function create_if_block_3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*orderSymbol*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*orderSymbol*/ 1) set_data_dev(t, /*orderSymbol*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(87:20) {#if $order.by === '7d'}",
    		ctx
    	});

    	return block;
    }

    // (91:20) {#if $order.by === '30d'}
    function create_if_block_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*orderSymbol*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*orderSymbol*/ 1) set_data_dev(t, /*orderSymbol*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(91:20) {#if $order.by === '30d'}",
    		ctx
    	});

    	return block;
    }

    // (95:20) {#if $order.by === 'ath'}
    function create_if_block_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*orderSymbol*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*orderSymbol*/ 1) set_data_dev(t, /*orderSymbol*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(95:20) {#if $order.by === 'ath'}",
    		ctx
    	});

    	return block;
    }

    // (100:12) {#each $filteredTickers as ticker}
    function create_each_block$1(ctx) {
    	let ticker;
    	let current;

    	ticker = new Ticker({
    			props: { ticker: /*ticker*/ ctx[16] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(ticker.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(ticker, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const ticker_changes = {};
    			if (dirty & /*$filteredTickers*/ 4) ticker_changes.ticker = /*ticker*/ ctx[16];
    			ticker.$set(ticker_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(ticker.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(ticker.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(ticker, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(100:12) {#each $filteredTickers as ticker}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let p;
    	let t0;
    	let t1_value = /*$filteredTickers*/ ctx[2].length + "";
    	let t1;
    	let t2;
    	let t3;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$2, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$filteredTickers*/ ctx[2].length > 0) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("Visible coins: ");
    			t1 = text(t1_value);
    			t2 = text(".");
    			t3 = space();
    			if_block.c();
    			if_block_anchor = empty();
    			add_location(p, file$4, 42, 0, 902);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			insert_dev(target, t3, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*$filteredTickers*/ 4) && t1_value !== (t1_value = /*$filteredTickers*/ ctx[2].length + "")) set_data_dev(t1, t1_value);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t3);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $order;
    	let $filteredTickers;
    	validate_store(order, "order");
    	component_subscribe($$self, order, $$value => $$invalidate(1, $order = $$value));
    	validate_store(filteredTickers, "filteredTickers");
    	component_subscribe($$self, filteredTickers, $$value => $$invalidate(2, $filteredTickers = $$value));

    	const sort = sortBy => {
    		order.setOrderBy(sortBy);
    		filteredTickers.order();
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Tickers> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Tickers", $$slots, []);
    	const click_handler = () => sort("rank");
    	const click_handler_1 = () => sort("symbol");
    	const click_handler_2 = () => sort("name");
    	const click_handler_3 = () => sort("price");
    	const click_handler_4 = () => sort("marketcap");
    	const click_handler_5 = () => sort("volume_24h");
    	const click_handler_6 = () => sort("1h");
    	const click_handler_7 = () => sort("12h");
    	const click_handler_8 = () => sort("24h");
    	const click_handler_9 = () => sort("7d");
    	const click_handler_10 = () => sort("30d");
    	const click_handler_11 = () => sort("ath");

    	$$self.$capture_state = () => ({
    		filteredTickers,
    		order,
    		Ticker,
    		sort,
    		orderSymbol,
    		$order,
    		$filteredTickers
    	});

    	$$self.$inject_state = $$props => {
    		if ("orderSymbol" in $$props) $$invalidate(0, orderSymbol = $$props.orderSymbol);
    	};

    	let orderSymbol;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$order*/ 2) {
    			 $$invalidate(0, orderSymbol = $order.direction === "desc" ? "↓" : "↑");
    		}
    	};

    	return [
    		orderSymbol,
    		$order,
    		$filteredTickers,
    		sort,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7,
    		click_handler_8,
    		click_handler_9,
    		click_handler_10,
    		click_handler_11
    	];
    }

    class Tickers extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tickers",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/components/Loader.svelte generated by Svelte v3.24.0 */
    const file$5 = "src/components/Loader.svelte";

    // (50:0) {#if $global.loading}
    function create_if_block$3(ctx) {
    	let div4;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div2;
    	let t2;
    	let div3;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");
    			t2 = space();
    			div3 = element("div");
    			attr_dev(div0, "class", "svelte-92ojbh");
    			add_location(div0, file$5, 51, 8, 1081);
    			attr_dev(div1, "class", "svelte-92ojbh");
    			add_location(div1, file$5, 52, 8, 1097);
    			attr_dev(div2, "class", "svelte-92ojbh");
    			add_location(div2, file$5, 53, 8, 1113);
    			attr_dev(div3, "class", "svelte-92ojbh");
    			add_location(div3, file$5, 54, 8, 1129);
    			attr_dev(div4, "class", "lds-ring svelte-92ojbh");
    			add_location(div4, file$5, 50, 4, 1050);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			append_dev(div4, t0);
    			append_dev(div4, div1);
    			append_dev(div4, t1);
    			append_dev(div4, div2);
    			append_dev(div4, t2);
    			append_dev(div4, div3);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(50:0) {#if $global.loading}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let if_block_anchor;
    	let if_block = /*$global*/ ctx[0].loading && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$global*/ ctx[0].loading) {
    				if (if_block) ; else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $global;
    	validate_store(global$1, "global");
    	component_subscribe($$self, global$1, $$value => $$invalidate(0, $global = $$value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Loader> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Loader", $$slots, []);
    	$$self.$capture_state = () => ({ global: global$1, $global });
    	return [$global];
    }

    class Loader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Loader",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/components/TickerInfoBar.svelte generated by Svelte v3.24.0 */
    const file$6 = "src/components/TickerInfoBar.svelte";

    // (84:0) {#if $selectedTicker}
    function create_if_block$4(ctx) {
    	let div5;
    	let div4;
    	let p;
    	let a0;
    	let t0_value = /*$selectedTicker*/ ctx[0].name + "";
    	let t0;
    	let a0_href_value;
    	let t1;
    	let t2_value = /*$global*/ ctx[1].currencySymbol + "";
    	let t2;
    	let t3_value = /*$selectedTicker*/ ctx[0][/*$global*/ ctx[1].referenceCurrency].price + "";
    	let t3;
    	let t4;
    	let div3;
    	let div0;
    	let span0;
    	let t5;
    	let t6_value = /*$selectedTicker*/ ctx[0][/*$global*/ ctx[1].referenceCurrency].change24h + "";
    	let t6;
    	let t7;
    	let t8;
    	let img0;
    	let img0_src_value;
    	let t9;
    	let div1;
    	let span1;
    	let t10;
    	let t11_value = /*$selectedTicker*/ ctx[0][/*$global*/ ctx[1].referenceCurrency].change7d + "";
    	let t11;
    	let t12;
    	let t13;
    	let img1;
    	let img1_src_value;
    	let t14;
    	let div2;
    	let span2;
    	let t15;
    	let t16_value = /*$selectedTicker*/ ctx[0][/*$global*/ ctx[1].referenceCurrency].change30d + "";
    	let t16;
    	let t17;
    	let t18;
    	let img2;
    	let img2_src_value;
    	let t19;
    	let a1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div4 = element("div");
    			p = element("p");
    			a0 = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			t2 = text(t2_value);
    			t3 = text(t3_value);
    			t4 = space();
    			div3 = element("div");
    			div0 = element("div");
    			span0 = element("span");
    			t5 = text("24h (");
    			t6 = text(t6_value);
    			t7 = text("%):");
    			t8 = space();
    			img0 = element("img");
    			t9 = space();
    			div1 = element("div");
    			span1 = element("span");
    			t10 = text("7d (");
    			t11 = text(t11_value);
    			t12 = text("%):");
    			t13 = space();
    			img1 = element("img");
    			t14 = space();
    			div2 = element("div");
    			span2 = element("span");
    			t15 = text("30d (");
    			t16 = text(t16_value);
    			t17 = text("%):");
    			t18 = space();
    			img2 = element("img");
    			t19 = space();
    			a1 = element("a");
    			a1.textContent = "×";
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "href", a0_href_value = "https://coinpaprika.com/coin/" + /*$selectedTicker*/ ctx[0].id);
    			attr_dev(a0, "class", "svelte-1086e0c");
    			add_location(a0, file$6, 87, 16, 1570);
    			attr_dev(p, "class", "name svelte-1086e0c");
    			add_location(p, file$6, 86, 12, 1537);
    			attr_dev(span0, "class", "graph-label svelte-1086e0c");
    			add_location(span0, file$6, 93, 20, 1876);
    			attr_dev(img0, "loading", "lazy");
    			attr_dev(img0, "class", "graph-img svelte-1086e0c");
    			attr_dev(img0, "width", "120");
    			attr_dev(img0, "height", "23");
    			if (img0.src !== (img0_src_value = "https://graphs" + (Math.random() > 0.5 ? "2" : "") + ".coinpaprika.com/currency/chart/" + /*$selectedTicker*/ ctx[0].id + "/24h/chart.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "");
    			toggle_class(img0, "positive", /*$selectedTicker*/ ctx[0][/*$global*/ ctx[1].referenceCurrency].change24h >= 0);
    			toggle_class(img0, "negative", /*$selectedTicker*/ ctx[0][/*$global*/ ctx[1].referenceCurrency].change24h < 0);
    			add_location(img0, file$6, 95, 20, 1993);
    			attr_dev(div0, "class", "graph-item svelte-1086e0c");
    			add_location(div0, file$6, 92, 16, 1831);
    			attr_dev(span1, "class", "graph-label svelte-1086e0c");
    			add_location(span1, file$6, 107, 20, 2610);
    			attr_dev(img1, "loading", "lazy");
    			attr_dev(img1, "class", "graph-img svelte-1086e0c");
    			attr_dev(img1, "width", "120");
    			attr_dev(img1, "height", "23");
    			if (img1.src !== (img1_src_value = "https://graphs" + (Math.random() > 0.5 ? "2" : "") + ".coinpaprika.com/currency/chart/" + /*$selectedTicker*/ ctx[0].id + "/7d/chart.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "");
    			toggle_class(img1, "positive", /*$selectedTicker*/ ctx[0][/*$global*/ ctx[1].referenceCurrency].change7d >= 0);
    			toggle_class(img1, "negative", /*$selectedTicker*/ ctx[0][/*$global*/ ctx[1].referenceCurrency].change7d < 0);
    			add_location(img1, file$6, 109, 20, 2725);
    			attr_dev(div1, "class", "graph-item svelte-1086e0c");
    			add_location(div1, file$6, 106, 16, 2565);
    			attr_dev(span2, "class", "graph-label svelte-1086e0c");
    			add_location(span2, file$6, 121, 20, 3339);
    			attr_dev(img2, "loading", "lazy");
    			attr_dev(img2, "class", "graph-img svelte-1086e0c");
    			attr_dev(img2, "width", "120");
    			attr_dev(img2, "height", "23");
    			if (img2.src !== (img2_src_value = "https://graphs" + (Math.random() > 0.5 ? "2" : "") + ".coinpaprika.com/currency/chart/" + /*$selectedTicker*/ ctx[0].id + "/30d/chart.svg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "");
    			toggle_class(img2, "positive", /*$selectedTicker*/ ctx[0][/*$global*/ ctx[1].referenceCurrency].change30d >= 0);
    			toggle_class(img2, "negative", /*$selectedTicker*/ ctx[0][/*$global*/ ctx[1].referenceCurrency].change30d < 0);
    			add_location(img2, file$6, 123, 20, 3456);
    			attr_dev(div2, "class", "graph-item svelte-1086e0c");
    			add_location(div2, file$6, 120, 16, 3294);
    			attr_dev(div3, "class", "graphs svelte-1086e0c");
    			add_location(div3, file$6, 91, 12, 1794);
    			attr_dev(div4, "class", "content svelte-1086e0c");
    			add_location(div4, file$6, 85, 8, 1503);
    			attr_dev(a1, "class", "close-button svelte-1086e0c");
    			attr_dev(a1, "href", "");
    			add_location(a1, file$6, 136, 8, 4054);
    			attr_dev(div5, "class", "coin-info-bar svelte-1086e0c");
    			add_location(div5, file$6, 84, 4, 1467);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div4);
    			append_dev(div4, p);
    			append_dev(p, a0);
    			append_dev(a0, t0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			append_dev(p, t3);
    			append_dev(div4, t4);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div0, span0);
    			append_dev(span0, t5);
    			append_dev(span0, t6);
    			append_dev(span0, t7);
    			append_dev(div0, t8);
    			append_dev(div0, img0);
    			append_dev(div3, t9);
    			append_dev(div3, div1);
    			append_dev(div1, span1);
    			append_dev(span1, t10);
    			append_dev(span1, t11);
    			append_dev(span1, t12);
    			append_dev(div1, t13);
    			append_dev(div1, img1);
    			append_dev(div3, t14);
    			append_dev(div3, div2);
    			append_dev(div2, span2);
    			append_dev(span2, t15);
    			append_dev(span2, t16);
    			append_dev(span2, t17);
    			append_dev(div2, t18);
    			append_dev(div2, img2);
    			append_dev(div5, t19);
    			append_dev(div5, a1);

    			if (!mounted) {
    				dispose = listen_dev(a1, "click", prevent_default(/*click_handler*/ ctx[3]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$selectedTicker*/ 1 && t0_value !== (t0_value = /*$selectedTicker*/ ctx[0].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*$selectedTicker*/ 1 && a0_href_value !== (a0_href_value = "https://coinpaprika.com/coin/" + /*$selectedTicker*/ ctx[0].id)) {
    				attr_dev(a0, "href", a0_href_value);
    			}

    			if (dirty & /*$global*/ 2 && t2_value !== (t2_value = /*$global*/ ctx[1].currencySymbol + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*$selectedTicker, $global*/ 3 && t3_value !== (t3_value = /*$selectedTicker*/ ctx[0][/*$global*/ ctx[1].referenceCurrency].price + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*$selectedTicker, $global*/ 3 && t6_value !== (t6_value = /*$selectedTicker*/ ctx[0][/*$global*/ ctx[1].referenceCurrency].change24h + "")) set_data_dev(t6, t6_value);

    			if (dirty & /*$selectedTicker*/ 1 && img0.src !== (img0_src_value = "https://graphs" + (Math.random() > 0.5 ? "2" : "") + ".coinpaprika.com/currency/chart/" + /*$selectedTicker*/ ctx[0].id + "/24h/chart.svg")) {
    				attr_dev(img0, "src", img0_src_value);
    			}

    			if (dirty & /*$selectedTicker, $global*/ 3) {
    				toggle_class(img0, "positive", /*$selectedTicker*/ ctx[0][/*$global*/ ctx[1].referenceCurrency].change24h >= 0);
    			}

    			if (dirty & /*$selectedTicker, $global*/ 3) {
    				toggle_class(img0, "negative", /*$selectedTicker*/ ctx[0][/*$global*/ ctx[1].referenceCurrency].change24h < 0);
    			}

    			if (dirty & /*$selectedTicker, $global*/ 3 && t11_value !== (t11_value = /*$selectedTicker*/ ctx[0][/*$global*/ ctx[1].referenceCurrency].change7d + "")) set_data_dev(t11, t11_value);

    			if (dirty & /*$selectedTicker*/ 1 && img1.src !== (img1_src_value = "https://graphs" + (Math.random() > 0.5 ? "2" : "") + ".coinpaprika.com/currency/chart/" + /*$selectedTicker*/ ctx[0].id + "/7d/chart.svg")) {
    				attr_dev(img1, "src", img1_src_value);
    			}

    			if (dirty & /*$selectedTicker, $global*/ 3) {
    				toggle_class(img1, "positive", /*$selectedTicker*/ ctx[0][/*$global*/ ctx[1].referenceCurrency].change7d >= 0);
    			}

    			if (dirty & /*$selectedTicker, $global*/ 3) {
    				toggle_class(img1, "negative", /*$selectedTicker*/ ctx[0][/*$global*/ ctx[1].referenceCurrency].change7d < 0);
    			}

    			if (dirty & /*$selectedTicker, $global*/ 3 && t16_value !== (t16_value = /*$selectedTicker*/ ctx[0][/*$global*/ ctx[1].referenceCurrency].change30d + "")) set_data_dev(t16, t16_value);

    			if (dirty & /*$selectedTicker*/ 1 && img2.src !== (img2_src_value = "https://graphs" + (Math.random() > 0.5 ? "2" : "") + ".coinpaprika.com/currency/chart/" + /*$selectedTicker*/ ctx[0].id + "/30d/chart.svg")) {
    				attr_dev(img2, "src", img2_src_value);
    			}

    			if (dirty & /*$selectedTicker, $global*/ 3) {
    				toggle_class(img2, "positive", /*$selectedTicker*/ ctx[0][/*$global*/ ctx[1].referenceCurrency].change30d >= 0);
    			}

    			if (dirty & /*$selectedTicker, $global*/ 3) {
    				toggle_class(img2, "negative", /*$selectedTicker*/ ctx[0][/*$global*/ ctx[1].referenceCurrency].change30d < 0);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(84:0) {#if $selectedTicker}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let if_block_anchor;
    	let if_block = /*$selectedTicker*/ ctx[0] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$selectedTicker*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $selectedTicker;
    	let $global;
    	validate_store(selectedTicker, "selectedTicker");
    	component_subscribe($$self, selectedTicker, $$value => $$invalidate(0, $selectedTicker = $$value));
    	validate_store(global$1, "global");
    	component_subscribe($$self, global$1, $$value => $$invalidate(1, $global = $$value));

    	const closeBar = () => {
    		selectedTicker.set(null);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<TickerInfoBar> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("TickerInfoBar", $$slots, []);
    	const click_handler = () => closeBar();

    	$$self.$capture_state = () => ({
    		selectedTicker,
    		global: global$1,
    		closeBar,
    		$selectedTicker,
    		$global
    	});

    	return [$selectedTicker, $global, closeBar, click_handler];
    }

    class TickerInfoBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TickerInfoBar",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.24.0 */
    const file$7 = "src/App.svelte";

    // (37:4) {#if !$global.loading}
    function create_if_block_1$1(ctx) {
    	let globalmarket;
    	let current;
    	globalmarket = new GlobalMarket({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(globalmarket.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(globalmarket, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(globalmarket.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(globalmarket.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(globalmarket, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(37:4) {#if !$global.loading}",
    		ctx
    	});

    	return block;
    }

    // (45:4) {#if !$global.loading}
    function create_if_block$5(ctx) {
    	let tickerinfobar;
    	let t0;
    	let filter;
    	let t1;
    	let tickers;
    	let current;
    	tickerinfobar = new TickerInfoBar({ $$inline: true });
    	filter = new Filter({ $$inline: true });
    	tickers = new Tickers({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(tickerinfobar.$$.fragment);
    			t0 = space();
    			create_component(filter.$$.fragment);
    			t1 = space();
    			create_component(tickers.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tickerinfobar, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(filter, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(tickers, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tickerinfobar.$$.fragment, local);
    			transition_in(filter.$$.fragment, local);
    			transition_in(tickers.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tickerinfobar.$$.fragment, local);
    			transition_out(filter.$$.fragment, local);
    			transition_out(tickers.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tickerinfobar, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(filter, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(tickers, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(45:4) {#if !$global.loading}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let loader;
    	let t0;
    	let div;
    	let t1;
    	let h1;
    	let a;
    	let t3;
    	let current;
    	loader = new Loader({ $$inline: true });
    	let if_block0 = !/*$global*/ ctx[0].loading && create_if_block_1$1(ctx);
    	let if_block1 = !/*$global*/ ctx[0].loading && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			create_component(loader.$$.fragment);
    			t0 = space();
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t1 = space();
    			h1 = element("h1");
    			a = element("a");
    			a.textContent = "🌶️ Paprika Viewer";
    			t3 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(a, "class", "logo-link svelte-nkaa4k");
    			attr_dev(a, "href", "index.html");
    			add_location(a, file$7, 41, 8, 885);
    			add_location(h1, file$7, 40, 4, 872);
    			attr_dev(div, "class", "container svelte-nkaa4k");
    			add_location(div, file$7, 35, 0, 781);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(loader, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t1);
    			append_dev(div, h1);
    			append_dev(h1, a);
    			append_dev(div, t3);
    			if (if_block1) if_block1.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*$global*/ ctx[0].loading) {
    				if (if_block0) {
    					if (dirty & /*$global*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (!/*$global*/ ctx[0].loading) {
    				if (if_block1) {
    					if (dirty & /*$global*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$5(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loader.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loader.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loader, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $global;
    	validate_store(global$1, "global");
    	component_subscribe($$self, global$1, $$value => $$invalidate(0, $global = $$value));

    	onMount(() => {
    		getTickers();
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);

    	$$self.$capture_state = () => ({
    		onMount,
    		global: global$1,
    		getTickers,
    		GlobalMarket,
    		Filter,
    		Tickers,
    		Loader,
    		TickerInfoBar,
    		$global
    	});

    	return [$global];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    const app = new App({
        target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
