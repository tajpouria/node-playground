"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
let ItemsService = class ItemsService {
    constructor() {
        this.items = {
            1: {
                id: 1,
                name: 'Burger',
                price: 5.99,
                description: 'Tasty',
                image: 'https://cdn.auth0.com/blog/whatabyte/burger-sm.png',
            },
            2: {
                id: 2,
                name: 'Pizza',
                price: 2.99,
                description: 'Cheesy',
                image: 'https://cdn.auth0.com/blog/whatabyte/pizza-sm.png',
            },
            3: {
                id: 3,
                name: 'Tea',
                price: 1.99,
                description: 'Informative',
                image: 'https://cdn.auth0.com/blog/whatabyte/tea-sm.png',
            },
        };
        this.findAll = () => this.items;
        this.create = (newItems) => {
            const id = newItems.id || new Date().valueOf();
            const item = Object.assign(Object.assign({}, newItems), { id });
            this.items[id] = item;
            return item;
        };
        this.find = (id) => { var _a; return (_a = this.items[id]) !== null && _a !== void 0 ? _a : null; };
        this.update = (updatedItem) => {
            const item = this.items[updatedItem.id];
            if (item) {
                this.items[updatedItem.id] = updatedItem;
                return updatedItem;
            }
            return null;
        };
        this.delete = (id) => {
            if (this.items[id]) {
                delete this.items[id];
                return true;
            }
            return null;
        };
    }
};
ItemsService = __decorate([
    common_1.Injectable()
], ItemsService);
exports.ItemsService = ItemsService;
//# sourceMappingURL=items.service.js.map