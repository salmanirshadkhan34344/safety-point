import { Injectable } from '@nestjs/common';
import { Model } from "objection";

var dotenv = require('dotenv');
dotenv.config();
const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT),
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        // timezone: process.env.UTC
    }
});

Model.knex(knex);

@Injectable()
export class Mapping extends Model {

    static getCalledClassName: any
    static tableNameCurrent: any
    static table
    constructor() {
        super()
        Mapping.getCalledClassName = this.constructor;

    }
    static get tableName () {
        if (this.table) {
            this.tableNameCurrent = this.table
        }
        return this.tableNameCurrent
    }

    static async create (column: any) {
        let currentClass: any
        currentClass = new this()
        currentClass = Object.assign(currentClass, column)
        var currentModel = this;
        return currentModel.query().insert(currentClass);
    }

    static update (column: any) {
        let currentClass: any
        currentClass = new this()
        currentClass = Object.assign(currentClass, column)
        var currentModel = this;
        return currentModel.query().update(currentClass);
    }

    static async pagination (query, req: any = {}) {
        let params = req.query
        let request = req.req
        let data: any = {}
        const baseUrl = process.env.BASE_URL + request.route.path;
        let perPage = params.perPage ? Number(params.perPage) : 10
        let currentPage = 0
        let previous = null
        let next = null
        if (params.page) {
            currentPage = (params.page) ? (Number(params.page) - 1) : 0
            previous = params.page != 1 ? (Number(params.page) - 1) : null
        }
        data = await query.page(currentPage, perPage)
        const totalPages = Math.ceil(data.total / perPage);
        next = totalPages > 1 ? 2 : null
        if (params.page) {
            next = totalPages > Number(params.page) ? (Number(params.page) + 1) : null
        }
        data.page = Number(params.page)
        data.meta = {
            itemCount: 0,
            totalItems: data.total,
            itemsPerPage: perPage,
            totalPages: totalPages,
            currentPage: params.page ? Number(params.page) : 1
        }

        data.links = {
            first: baseUrl + "/?page=1&limit=" + perPage,
            previous: previous ? baseUrl + "/?page=" + previous + "&limit=" + perPage : null,
            next: next ? baseUrl + "/?page=" + next + "&limit=" + perPage : null,
            last: totalPages > 0 ? baseUrl + "/?page=" + totalPages + "&limit=" + perPage : null
        }
        return data;
    }

    static async findOneCustom (query) {
        let data: any = await query.first()
        return data ? data : null;
    }

    static async findAllCustom (query) {
        let data: any = {}
        data = await query
        return data.length > 0 ? data : [];
    }
}