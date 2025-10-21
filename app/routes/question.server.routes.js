const question = require("../controllers/question.server.controllers")

module.exports = function(app) {

    app.route("/item/:itemId/question")
        .get(question.get_questions_for_item)
        .post(question.ask_question_for_item);
    
    app.route ("/question/:questionId")
        .post(question.answer_for_question);
}