import {
    introspectSchema,
    isResourceExcluded,
    isResourceIncluded,
} from './introspection';
import {
    GET_LIST,
    GET_ONE,
    GET_MANY,
    GET_MANY_REFERENCE,
    CREATE,
    UPDATE,
    DELETE,
    UPDATE_MANY,
    DELETE_MANY,
} from './actions';
describe('introspection', () => {

    describe('introspection parsing returns an object', () => {
        const client = {
            query: jest.fn(() =>
                Promise.resolve({
                    
                    data: {
                        __schema: {
                            queryType: { name: 'query_root' },
                            mutationType: { name: 'mutation_root' },
                            subscription_root:
                            {
                                "name": "subscription_root",
                            },
                            directives:
                            [
                                {
                                    "name": "include",
                                    "description": "whether this query should be included",
                                    "locations": [
                                        "FIELD",
                                        "FRAGMENT_SPREAD",
                                        "INLINE_FRAGMENT"
                                    ],
                                    "args": [
                                        {
                                            "name": "if",
                                            "description": null,
                                            "type": {
                                                "kind": "NON_NULL",
                                                "name": null,
                                                "ofType": {
                                                    "kind": "SCALAR",
                                                    "name": "Boolean",
                                                    "ofType": null,
                                                    "__typename": "__Type"
                                                },
                                                "__typename": "__Type"
                                            },
                                            "defaultValue": null,
                                            "__typename": "__InputValue"
                                        }
                                    ],
                                    "__typename": "__Directive"
                                },
                                {
                                    "name": "skip",
                                    "description": "whether this query should be skipped",
                                    "locations": [
                                        "FIELD",
                                        "FRAGMENT_SPREAD",
                                        "INLINE_FRAGMENT"
                                    ],
                                    "args": [
                                        {
                                            "name": "if",
                                            "description": null,
                                            "type": {
                                                "kind": "NON_NULL",
                                                "name": null,
                                                "ofType": {
                                                    "kind": "SCALAR",
                                                    "name": "Boolean",
                                                    "ofType": null,
                                                    "__typename": "__Type"
                                                },
                                                "__typename": "__Type"
                                            },
                                            "defaultValue": null,
                                            "__typename": "__InputValue"
                                        }
                                    ],
                                    "__typename": "__Directive"
                                },
                                {
                                    "name": "cached",
                                    "description": "whether this query should be cached (Hasura Cloud only)",
                                    "locations": [
                                        "QUERY"
                                    ],
                                    "args": [
                                        {
                                            "name": "ttl",
                                            "description": "measured in seconds",
                                            "type": {
                                                "kind": "NON_NULL",
                                                "name": null,
                                                "ofType": {
                                                    "kind": "SCALAR",
                                                    "name": "Int",
                                                    "ofType": null,
                                                    "__typename": "__Type"
                                                },
                                                "__typename": "__Type"
                                            },
                                            "defaultValue": "60",
                                            "__typename": "__InputValue"
                                        },
                                        {
                                            "name": "refresh",
                                            "description": "refresh the cache entry",
                                            "type": {
                                                "kind": "NON_NULL",
                                                "name": null,
                                                "ofType": {
                                                    "kind": "SCALAR",
                                                    "name": "Boolean",
                                                    "ofType": null,
                                                    "__typename": "__Type"
                                                },
                                                "__typename": "__Type"
                                            },
                                            "defaultValue": "false",
                                            "__typename": "__InputValue"
                                        }
                                    ],
                                    "__typename": "__Directive"
                                }
                            ],
                            types: [
                                {
                                    name: 'query_root',
                                    fields: [
                                        { name: 'api_role' },
                                        { name: 'api_role_by_pk' },
                                        { name: 'api_role_aggregate' },
                                    ],
                                },
                                {
                                    name: 'mutation_root',
                                    fields: [
                                        { name: 'delete_api_role' },
                                        { name: 'insert_api_role' },
                                        { name: 'update_api_role' },
                                    ],
                                },
                                { name: 'api_role' },
                            ],
                        },
                    },
                })
            ),
        };

        // @ts-ignore
        const introspectionResultsPromise = introspectSchema(client, {
            operationNames: {
                [GET_LIST]: (resource) => `${resource.name}`,
                [GET_ONE]: (resource) => `${resource.name}`,
                [GET_MANY]: (resource) => `${resource.name}`,
                [GET_MANY_REFERENCE]: (resource) => `${resource.name}`,
                [CREATE]: (resource) => `insert_${resource.name}`,
                [UPDATE]: (resource) => `update_${resource.name}`,
                [UPDATE_MANY]: (resource) => `update_${resource.name}`,
                [DELETE]: (resource) => `delete_${resource.name}`,
                [DELETE_MANY]: (resource) => `delete_${resource.name}`,

            },
            exclude: ['ImExcluded'],
        });

        it('with a "types" array containing all types found', async () => {
            const introspectionResults = await introspectionResultsPromise;
            console.log("introspectionResults",introspectionResults)
            expect(introspectionResults.types).toHaveLength(1);
        });

        it('with a "queries" array containing all queries and mutations found', async () => {
            const introspectionResults = await introspectionResultsPromise;
            console.log("introspectionResults:queries",introspectionResults.queries)
            expect(introspectionResults.queries).toEqual([
                { name: 'api_role' },
                { name: 'api_role_by_pk' },
                { name: 'api_role_aggregate' },
                { name: 'delete_api_role' },
                { name: 'insert_api_role' },
                { name: 'update_api_role' },
            ]);
        });

        it('with a "resources" array containing objects describing resources', async () => {
            const introspectionResults = await introspectionResultsPromise;
            console.log("introspectionResults:resources",introspectionResults.resources)
            expect(introspectionResults.resources).toEqual([
                {
                    type: { name: 'api_role' },
                    [GET_LIST]: { name: 'api_role' },
                    [GET_ONE]: { name: 'api_role' },
                    [GET_MANY]: { name: 'api_role' },
                    [GET_MANY_REFERENCE]: { name: 'api_role' },
                    [CREATE]: { name: 'insert_api_role' },
                    [UPDATE]: { name: 'update_api_role' },
                    [DELETE]: { name: 'delete_api_role' },
                    [UPDATE_MANY]: { name: 'update_api_role' },
                    [DELETE_MANY]: { name: 'delete_api_role' },
                    [DELETE]: { name: 'delete_api_role' },
                },
            ]);
        });
    });
});
