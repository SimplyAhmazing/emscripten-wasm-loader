var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/getroot/dist/src/index.js
var require_src = __commonJS({
  "node_modules/getroot/dist/src/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var __window = typeof window !== "undefined" && window;
    var __self = typeof self !== "undefined" && typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope && self;
    var __global = typeof global !== "undefined" && global;
    var _root = __window || __global || __self;
    exports.root = _root;
    (function() {
      if (!_root) {
        throw new Error("Could not find any global context (window, self, global)");
      }
    })();
  }
});

// node_modules/nanoid/random.js
var require_random = __commonJS({
  "node_modules/nanoid/random.js"(exports, module2) {
    var crypto = require("crypto");
    if (crypto.randomFillSync) {
      buffers = {};
      module2.exports = function(bytes) {
        var buffer = buffers[bytes];
        if (!buffer) {
          buffer = Buffer.allocUnsafe(bytes);
          if (bytes <= 255)
            buffers[bytes] = buffer;
        }
        return crypto.randomFillSync(buffer);
      };
    } else {
      module2.exports = crypto.randomBytes;
    }
    var buffers;
  }
});

// node_modules/nanoid/url.js
var require_url = __commonJS({
  "node_modules/nanoid/url.js"(exports, module2) {
    module2.exports = "ModuleSymbhasOwnPr-0123456789ABCDEFGHIJKLNQRTUVWXYZ_cfgijkpqtvxz";
  }
});

// node_modules/nanoid/index.js
var require_nanoid = __commonJS({
  "node_modules/nanoid/index.js"(exports, module2) {
    var random = require_random();
    var url = require_url();
    module2.exports = function(size) {
      size = size || 21;
      var bytes = random(size);
      var id = "";
      while (0 < size--) {
        id += url[bytes[size] & 63];
      }
      return id;
    };
  }
});

// node_modules/remove-trailing-separator/index.js
var require_remove_trailing_separator = __commonJS({
  "node_modules/remove-trailing-separator/index.js"(exports, module2) {
    var isWin = process.platform === "win32";
    module2.exports = function(str) {
      var i = str.length - 1;
      if (i < 2) {
        return str;
      }
      while (isSeparator(str, i)) {
        i--;
      }
      return str.substr(0, i + 1);
    };
    function isSeparator(str, i) {
      var char = str[i];
      return i > 0 && (char === "/" || isWin && char === "\\");
    }
  }
});

// node_modules/normalize-path/index.js
var require_normalize_path = __commonJS({
  "node_modules/normalize-path/index.js"(exports, module2) {
    var removeTrailingSeparator = require_remove_trailing_separator();
    module2.exports = function normalizePath(str, stripTrailing) {
      if (typeof str !== "string") {
        throw new TypeError("expected a string");
      }
      str = str.replace(/[\\\/]+/g, "/");
      if (stripTrailing !== false) {
        str = removeTrailingSeparator(str);
      }
      return str;
    };
  }
});

// node_modules/unixify/index.js
var require_unixify = __commonJS({
  "node_modules/unixify/index.js"(exports, module2) {
    "use strict";
    var normalizePath = require_normalize_path();
    module2.exports = function unixify2(filepath, stripTrailing) {
      filepath = normalizePath(filepath, stripTrailing);
      return filepath.replace(/^([a-zA-Z]+:|\.\/)/, "");
    };
  }
});

// src/index.ts
var src_exports = {};
__export(src_exports, {
  ENVIRONMENT: () => ENVIRONMENT,
  enableLogger: () => enableLogger,
  getModuleLoader: () => getModuleLoader,
  isMounted: () => isMounted,
  isNode: () => isNode,
  isWasmEnabled: () => isWasmEnabled,
  log: () => log,
  mkdirTree: () => mkdirTree,
  mountBuffer: () => mountBuffer,
  mountDirectory: () => mountDirectory,
  unmount: () => unmount
});
module.exports = __toCommonJS(src_exports);

// src/util/logger.ts
var logInstance = () => {
};
var log = (...args) => logInstance(...args);
var enableLogger = (logger) => logInstance = logger;

// src/constructModule.ts
var constructModule = (value, binaryRemoteEndpoint) => {
  const ret = {
    ...value,
    __asm_module_isInitialized__: false,
    onRuntimeInitialized: null,
    initializeRuntime: null
  };
  if (!!binaryRemoteEndpoint) {
    log(`constructModule: binaryRemoteEndpoint found, override locateFile function`);
    ret.locateFile = (fileName) => `${binaryRemoteEndpoint}/${fileName}`;
  }
  ret.initializeRuntime = (timeout = 3e3) => {
    if (ret.__asm_module_isInitialized__) {
      return Promise.resolve(true);
    }
    return new Promise((resolve, _reject) => {
      const timeoutId = setTimeout(() => resolve(false), timeout);
      ret.onAbort = (reason) => {
        if (!ret.__asm_module_isInitialized__) {
          clearTimeout(timeoutId);
          log(`initializeRuntime: failed to initialize module`, reason);
          throw reason instanceof Error ? reason : new Error(reason);
        }
      };
      ret.onRuntimeInitialized = () => {
        clearTimeout(timeoutId);
        ret.__asm_module_isInitialized__ = true;
        log(`initializeRuntime: successfully initialized module`);
        resolve(true);
      };
    });
  };
  return ret;
};

// src/environment.ts
var ENVIRONMENT = /* @__PURE__ */ ((ENVIRONMENT2) => {
  ENVIRONMENT2["NODE"] = "NODE";
  ENVIRONMENT2["WEB"] = "WEB";
  return ENVIRONMENT2;
})(ENVIRONMENT || {});

// src/getModuleLoader.ts
var getModuleLoader = (factoryLoader, runtimeModule, module2, { timeout, binaryRemoteEndpoint } = {}) => async () => {
  const constructedModule = constructModule(module2 || {}, binaryRemoteEndpoint);
  log(`loadModule: constructed module object for runtime`);
  try {
    const asmModule = runtimeModule(constructedModule);
    const result = await asmModule.initializeRuntime(timeout);
    if (!result) {
      log(`loadModule: failed to initialize runtime in time`);
      throw new Error(`Timeout to initialize runtime`);
    }
    log(`loadModule: initialized wasm binary Runtime`);
    return factoryLoader(asmModule);
  } catch (e) {
    log(`loadModule: failed to initialize wasm binary runtime`);
    throw e;
  }
};

// src/util/isNode.ts
var import_getroot = __toESM(require_src());
var isNode = () => {
  const proc = import_getroot.root.process;
  if (!!proc && typeof proc === "object") {
    if (!!proc.versions && typeof proc.versions === "object") {
      if (typeof proc.versions.node !== "undefined") {
        return true;
      }
    }
  }
  return false;
};

// src/util/isWasmEnabled.ts
var import_getroot2 = __toESM(require_src());
var isWasmEnabled = () => !!import_getroot2.root.WebAssembly && !!import_getroot2.root.WebAssembly.compile && !!import_getroot2.root.WebAssembly.instantiate;

// src/path/isMounted.ts
var isMounted = (FS3, mountPath, type) => {
  try {
    const stat = FS3.stat(mountPath);
    const typeFunction = type === "dir" ? FS3.isDir : FS3.isFile;
    if (!!stat && typeFunction(stat.mode)) {
      log(`isMounted: ${mountPath} is mounted`);
      return true;
    }
  } catch (e) {
    if (e.code !== "ENOENT") {
      log(`isMounted check failed`, e);
    }
  }
  return false;
};

// src/path/mkdirTree.ts
var mkdirTree = (FS3, dirPath) => {
  const mkdir = (path) => {
    try {
      FS3.mkdir(path);
    } catch (e) {
      if (e.errno != 17) {
        throw e;
      }
    }
  };
  dirPath.split("/").filter((x) => !!x).reduce((acc, value) => {
    acc.push(`${acc.length > 0 ? acc[acc.length - 1] : ""}/${value}`);
    return acc;
  }, []).forEach(mkdir);
};

// src/path/mountBuffer.ts
var import_nanoid = __toESM(require_nanoid());
var mountBuffer = (FS3, memPathId) => (contents, fileName) => {
  const file = fileName || (0, import_nanoid.nanoid)(45);
  const mountedFilePath = `${memPathId}/${file}`;
  if (isMounted(FS3, mountedFilePath, "file")) {
    log(`mountTypedArrayFile: file is already mounted, return it`);
  } else {
    FS3.writeFile(mountedFilePath, contents, { encoding: "binary" });
  }
  return mountedFilePath;
};

// src/path/mountDirectory.ts
var import_unixify = __toESM(require_unixify());
var mountDirectory = (FS3, nodePathId) => (dirPath) => {
  if (!isNode()) {
    throw new Error("Mounting physical directory is not supported other than node.js environment");
  }
  const path = require("path");
  const mountedDirPath = (0, import_unixify.default)(path.join(nodePathId, (0, import_unixify.default)(path.resolve(dirPath))));
  if (isMounted(FS3, mountedDirPath, "dir")) {
    log(`mountNodeFile: file is already mounted, return it`);
  } else {
    mkdirTree(FS3, mountedDirPath);
    FS3.mount(FS3.filesystems.NODEFS, { root: path.resolve(dirPath) }, mountedDirPath);
  }
  return mountedDirPath;
};

// src/path/unmount.ts
var unmount = (FS3, memPathId) => (mountedPath) => {
  if (isMounted(FS3, mountedPath, "file") && mountedPath.indexOf(memPathId) > -1) {
    log(`unmount: ${mountedPath} is typedArrayFile, unlink from memory`);
    FS3.unlink(mountedPath);
    return;
  }
  if (isMounted(FS3, mountedPath, "dir")) {
    log(`unmount: ${mountedPath} is directory, unmount`);
    FS3.unmount(mountedPath);
    FS3.rmdir(mountedPath);
    return;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ENVIRONMENT,
  enableLogger,
  getModuleLoader,
  isMounted,
  isNode,
  isWasmEnabled,
  log,
  mkdirTree,
  mountBuffer,
  mountDirectory,
  unmount
});
/*!
 * normalize-path <https://github.com/jonschlinkert/normalize-path>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */
/*!
 * unixify <https://github.com/jonschlinkert/unixify>
 *
 * Copyright (c) 2014, 2017, Jon Schlinkert.
 * Released under the MIT License.
 */
