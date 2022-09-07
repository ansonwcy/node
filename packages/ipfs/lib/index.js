"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashFile = exports.hashContent = exports.hashDir = exports.hashItems = exports.parse = void 0;
const ipfs_js_1 = __importDefault(require("./ipfs.js"));
const fs_1 = require("fs");
function parse(cid) {
    return ipfs_js_1.default.parse(cid);
}
exports.parse = parse;
;
async function hashItems(items, version) {
    return await ipfs_js_1.default.hashItems(items || [], version);
}
exports.hashItems = hashItems;
;
async function hashDir(dirPath, version) {
    return await ipfs_js_1.default.hashDir(dirPath);
}
exports.hashDir = hashDir;
;
async function hashContent(content, version) {
    if (version == undefined)
        version = 1;
    if (content.length == 0) {
        return await ipfs_js_1.default.hashContent('', version);
    }
    let result;
    if (version == 1) {
        result = await ipfs_js_1.default.hashFile(content, version, {
            rawLeaves: true,
            maxChunkSize: 1048576,
            maxChildrenPerNode: 1024
        });
    }
    else
        result = await ipfs_js_1.default.hashFile(content, version);
    return result.cid;
}
exports.hashContent = hashContent;
async function hashFile(filePath, version, options) {
    if (version == undefined)
        version = 1;
    let size;
    let stat = await fs_1.promises.stat(filePath);
    size = stat.size;
    let file = fs_1.createReadStream(filePath);
    let cid;
    let result;
    if (size == 0) {
        cid = await ipfs_js_1.default.hashContent('', version);
        return {
            cid,
            size
        };
    }
    else if (version == 1) {
        result = await ipfs_js_1.default.hashFile(file, version, ipfs_js_1.default.mergeOptions({
            rawLeaves: true,
            maxChunkSize: 1048576,
            maxChildrenPerNode: 1024
        }, options || {}));
    }
    else
        result = await ipfs_js_1.default.hashFile(file, version);
    return result;
}
exports.hashFile = hashFile;
