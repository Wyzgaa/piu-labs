export class Ajax {
    constructor(options = {}) {
        this.options = {
            baseURL: options.baseURL || '',
            headers: options.headers || {},
            timeout: options.timeout || 5000,
        };
    }

    mergeOptions(localOptions = {}) {
        return {
            baseURL: localOptions.baseURL || this.options.baseURL,
            headers: { ...this.options.headers, ...localOptions.headers },
            timeout: localOptions.timeout || this.options.timeout,
        };
    }

    async request(method, url, data = null, localOptions = {}) {
        const opts = this.mergeOptions(localOptions);

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), opts.timeout);

        const config = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...opts.headers,
            },
            signal: controller.signal,
        };

        if (data) {
            config.body = JSON.stringify(data);
        }

        let response;
        try {
            response = await fetch(opts.baseURL + url, config);
        } catch (err) {
            clearTimeout(timer);
            if (err.name === 'AbortError') {
                throw new Error(`Request timeout after ${opts.timeout} ms`);
            }
            throw new Error(`Network error: ${err.message}`);
        }

        clearTimeout(timer);

        let json;
        try {
            json = await response.json();
        } catch {
            json = null;
        }

        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status}: ${
                    json?.message || response.statusText
                }`
            );
        }

        return json;
    }

    async get(url, options) {
        return this.request('GET', url, null, options);
    }

    async post(url, data, options) {
        return this.request('POST', url, data, options);
    }

    async put(url, data, options) {
        return this.request('PUT', url, data, options);
    }

    async delete(url, options) {
        return this.request('DELETE', url, null, options);
    }
}
