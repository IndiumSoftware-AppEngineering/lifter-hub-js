"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = init;
const db_1 = require("./db");
class LifterHub {
    pull(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, db_1.fetchPrompt)(id);
        });
    }
    pullAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, db_1.fetchAllPrompt)();
        });
    }
    create(config) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, db_1.createPrompt)(config);
        });
    }
    update(promptType, newDescription) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, db_1.updatePrompt)(promptType, newDescription);
        });
    }
    updateFull(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, db_1.updateFullPrompt)(config);
            return result !== null;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, db_1.deletePrompt)(id);
        });
    }
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, db_1.deleteAllPrompt)();
        });
    }
}
// Singleton instance
function init(dbConfig) {
    (0, db_1.configureDatabase)(dbConfig);
    return new LifterHub();
}
