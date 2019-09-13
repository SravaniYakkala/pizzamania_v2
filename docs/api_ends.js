let endpoints = [
    {
        path: "/orders/create",
        type: "POST",
        request: {
            body: {
                customer: "amazon <or> facebook <or> infosys ...etc", //optional,
                items: {"small pizza": 2, "medium pizza": 1, "large pizza": 3}
            }
        },
        response: {
            status: 200,
            body: {
                total_price: 549
            }
        }
    },
    {
        path: "/offers/create",
        type: "POST",
        request: {
            body: {
                customer: "amazon <or> facebook <or> infosys ...etc", //optional,
                item: "small pizza <or> medium pizza <or> large pizza",
                offer_type: "get_more <or> price_drop",
                //only for get_more type
                count: 4,
                get: 5,
                //only for price_drop type
                min_count: 1,
                price: 299

            }
        },
        response: {
            status: 200,
            body: {}
        }
    },
    {
        path: "/items/create",
        type: "POST",
        request: {
            body: {
                item : "small pizza <or> medium pizza <or> large pizza",
                desc : "asdlfkjasl",
                price : 269.99
            }
        },
        response: {
            status: 200,
            body: {}
        }
    }
]