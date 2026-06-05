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

    // CRUD Operations
    async getAll(table, filters) {
        return this.request('GET', table, { filters });
    }

    async getById(table, id) {
        return this.request('GET', table, { id, single: true });
    }

    async create(table, data) {
        return this.request('POST', table, { data });
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