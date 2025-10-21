module.exports = function(app) {

    app.route("/search")
        .get(auction.search_auctions);
    
    app.route("/item")
        .post(auction.create_item);

    app.route("/item/:itemId")
        .get(auction.get_1_item);

    app.route("/item/:itemId/bid")
        .post(auction.place_bid)
        .get(auction.get_bids_for_item);

}