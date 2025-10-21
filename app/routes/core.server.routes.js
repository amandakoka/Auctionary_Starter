const core = require("../controllers/core.server.controllers")

module.exports = function(app) {

    app.route("/search")
        .get(core.search_auctions);
    
    app.route("/item")
        .post(core.create_item);

    app.route("/item/:itemId")
        .get(core.get_1_item);

    app.route("/item/:itemId/bid")
        .post(core.place_bid)
        .get(core.get_bids_for_item);

}