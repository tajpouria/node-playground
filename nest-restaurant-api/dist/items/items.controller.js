"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const items_service_1 = require("./items.service");
const item_1 = require("../item");
let ItemsController = class ItemsController {
    constructor(itemsService) {
        this.itemsService = itemsService;
    }
    async findAll() {
        return this.itemsService.findAll();
    }
    async find(id) {
        return this.itemsService.find(id);
    }
    create(item) {
        return this.itemsService.create(item);
    }
    update(item) {
        return this.itemsService.update(item);
    }
    delete(id) {
        return this.itemsService.delete(id);
    }
};
__decorate([
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "findAll", null);
__decorate([
    common_1.Get(':id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "find", null);
__decorate([
    common_1.Post(),
    __param(0, common_1.Body('item')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [item_1.Item]),
    __metadata("design:returntype", item_1.Item)
], ItemsController.prototype, "create", null);
__decorate([
    common_1.Put(),
    __param(0, common_1.Body('item')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [item_1.Item]),
    __metadata("design:returntype", item_1.Item)
], ItemsController.prototype, "update", null);
__decorate([
    common_1.Delete(':id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Boolean)
], ItemsController.prototype, "delete", null);
ItemsController = __decorate([
    common_1.Controller('items'),
    __metadata("design:paramtypes", [items_service_1.ItemsService])
], ItemsController);
exports.ItemsController = ItemsController;
//# sourceMappingURL=items.controller.js.map