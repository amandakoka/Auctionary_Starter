const create_item = (core, done) => {

    let values = [core.name, core.description, core.staring_bid, core.start_date, core.end_date, core_creator_id];
    db.run(
        `INSERT INTO items (item_name, item_description, item_starting_bid, item_start_date, item_end_date, item_creator_id) VALUES (?,?,?,?,?,?,?)`,
        values, 
        function(err) {
            if(err){
                console.log(err);
                return done(err);
            }
            return done(err, this.lastID)
    })


}

module.exports = {
    create_item: create_item
}