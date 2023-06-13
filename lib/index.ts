import axios, { AxiosResponse } from 'axios';

interface RpcData {
    jsonrpc: string;
    method: string;
    id: number;
    params: any;
}

interface RpcError {
    code: number;
    message: string;
    data?: any;
}

export class SpsidRPC {
    private _url: string;
    private _next_id: number;

    constructor(url?: string) {
        this._url = url || process.env.SPSIDGUI_DB_URL || 'http://localhost';
        this._next_id = 1;
    }

    private async _call(methodName: string, args: any): Promise<any> {
        const rpcData: RpcData = {
            "jsonrpc": "2.0",
            "method": methodName,
            "id": this._next_id,
            "params": args
        };

        try {
            const response: AxiosResponse<any> = await axios.post(this._url, rpcData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 20000,
            });

            const data = response.data;
            if (data.error) {
                const err: RpcError = data.error;
                throw new Error(`RPC Error ${err.code}: ${err.message}`);
            } else {
                return data.result;
            }
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
        } finally {
            this._next_id++;
        }
    }

    public create_object(objclass: string, attr: any): Promise<any> {
        return this._call('create_object', { 'objclass': objclass, 'attr': attr });
    }

    public modify_object(id: string, mod_attr: any): Promise<any> {
        return this._call('modify_object', { 'id': id, 'mod_attr': mod_attr });
    }

    public validate_object(attr: any): Promise<any> {
        return this._call('validate_object', { 'attr': attr });
    }

    public delete_object(id: string): Promise<any> {
        return this._call('delete_object', { 'id': id });
    }

    public get_object(id: string): Promise<any> {
        return this._call('get_object', { 'id': id });
    }

    public get_object_log(id: string): Promise<any> {
        return this._call('get_object_log', { 'id': id });
    }

    public search_objects(container: string, objclass: string, search_attrs: any): Promise<any> {
        return this._call('search_objects', { 'container': container, 'objclass': objclass, 'search_attrs': search_attrs });
    }

    public search_prefix(objclass: string, attr_name: string, attr_prefix: string): Promise<any> {
        return this._call('search_prefix', { 'objclass': objclass, 'attr_name': attr_name, 'attr_prefix': attr_prefix });
    }

    public search_fulltext(objclass: string, search_string: string): Promise<any> {
        return this._call('search_fulltext', { 'objclass': objclass, 'search_string': search_string });
    }

    public contained_classes(container: string): Promise<any> {
        return this._call('contained_classes', { 'container': container });
    }

    public get_schema(): Promise<any> {
        return this._call('get_schema', {});
    }

    public new_object_default_attrs(container: string, objclass: string, templatekeys: any): Promise<any> {
        return this._call('new_object_default_attrs', { 'container': container, 'objclass': objclass, 'templatekeys': templatekeys });
    }
}
