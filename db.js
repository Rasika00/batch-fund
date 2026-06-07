/**
 * RT Funds - Supabase Database Client
 * Handles all CRUD operations with Supabase PostgreSQL database
 */

class Database {
    constructor() {
        this.url = window.SUPABASE_URL;
        this.key = window.SUPABASE_ANON_KEY;
        this.headers = {
            'apikey': this.key,
            'Authorization': `Bearer ${this.key}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        };
    }

    async request(method, table, options = {}) {
        const { id, data, filters, single, count } = options;
        let url = `${this.url}/rest/v1/${table}`;
        const params = [];

        // Build URL with filters
        if (id) {
            url += `?id=eq.${id}`;
        } else if (filters) {
            const filterStr = Object.entries(filters)
                .map(([k, v]) => `${k}=eq.${v}`)
                .join('&');
            url += `?${filterStr}`;
        }

        if (count) {
            url += url.includes('?') ? '&' : '?';
            url += 'select=*,count:exact_count(*)';
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: this.headers,
                body: method !== 'GET' && method !== 'HEAD' ? JSON.stringify(data) : undefined
            });

            if (!response.ok) {
                const error = await response.text();
                console.error(`DB Error [${method} ${table}]:`, error);
                return { error };
            }

            if (single || id) {
                return response.json();
            }
            return response.json();
        } catch (err) {
            console.error(`DB Error [${method} ${table}]:`, err);
            return { error: err.message };
        }
    }

    buildQueryParams(options = {}) {
        const params = [];
        if (options.select) params.push(`select=${options.select}`);
        if (options.order) params.push(`order=${options.order}`);
        if (options.limit != null) params.push(`limit=${options.limit}`);
        if (options.offset != null) params.push(`offset=${options.offset}`);
        if (options.filters) {
            Object.entries(options.filters).forEach(([key, value]) => {
                params.push(`${key}=eq.${value}`);
            });
        }
        return params.length ? `?${params.join('&')}` : '';
    }

    async fetchRows(table, options = {}) {
        const query = this.buildQueryParams(options);
        const url = `${this.url}/rest/v1/${table}${query}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: this.headers
        });
        if (!response.ok) {
            const error = await response.text();
            console.error(`DB Error [GET ${table}]:`, error);
            return { error };
        }
        return response.json();
    }

    // CRUD Operations
    async getAll(table, options = {}) {
        try {
            return await this.fetchRows(table, options);
        } catch (err) {
            console.error(`DB Error [GET ${table}]:`, err);
            return { error: err.message };
        }
    }

    async getAllPaginated(table, options = {}) {
        const pageSize = options.pageSize || 500;
        let offset = 0;
        const allRows = [];

        try {
            while (true) {
                const batch = await this.fetchRows(table, {
                    ...options,
                    limit: pageSize,
                    offset
                });

                if (batch?.error) return batch;
                if (!Array.isArray(batch) || batch.length === 0) break;

                allRows.push(...batch);
                if (batch.length < pageSize) break;
                offset += pageSize;
            }

            return allRows;
        } catch (err) {
            console.error(`DB Error [GET paginated ${table}]:`, err);
            return { error: err.message };
        }
    }

    async getById(table, id) {
        return this.request('GET', table, { id, single: true });
    }

    async create(table, data) {
        return this.request('POST', table, { data });
    }

    async createMany(table, rows) {
        const url = `${this.url}/rest/v1/${table}`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(rows)
            });
            if (!response.ok) {
                const error = await response.text();
                console.error(`DB Error [POST bulk ${table}]:`, error);
                return { error };
            }
            return response.json();
        } catch (err) {
            console.error(`DB Error [POST bulk ${table}]:`, err);
            return { error: err.message };
        }
    }

    async update(table, id, data) {
        return this.request('PATCH', table, { id, data });
    }

    async delete(table, id) {
        return this.request('DELETE', table, { id });
    }

    // Custom query with RPC (for complex operations)
    async rpc(functionName, params = {}) {
        const url = `${this.url}/rest/v1/rpc/${functionName}`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(params)
            });
            return response.json();
        } catch (err) {
            console.error(`RPC Error [${functionName}]:`, err);
            return { error: err.message };
        }
    }
}

// Global database instance
const db = new Database();