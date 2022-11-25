const url = require('url');
const http = require('http');

const fs = require("fs");
const questions = JSON.parse(fs.readFileSync("questionBank.json"));

function createCrossword(questions,solution) {
    const crossword = { rows : [], min: 0, error : undefined};
    const used = []

    let row = 0;
    for(c in solution) {
        const letter = solution[c]
        let found = false;
        for (q in questions.questions) {
            const question = questions.questions[q];
            if ( used.indexOf(question.key) >= 0 ) {
                continue;
            }
            const key = question.key;
            const index = key.indexOf(letter);
            if (index >= 0) {
                found = true;
                crossword.rows[row++] = {
                    question : question,
                    position: index
                }
                used.push(key);
                crossword.min = Math.max(crossword.min,index)
                break;
            }
        }

        if (!found) {
            crossword.error = "Unable to create the crossword, question bank not complete";
        }
    }

    return crossword;
}

function render( crossword, solution ) {
    let result = '<table>';
    for(r in crossword.rows) {
        const row = crossword.rows[r];
        result += '<tr>'
        result += '<td>'+ row.question.legend + '</td>'
        const minx = crossword.min-row.position;
        const width = "15px";
        for ( let i = 0; i < minx + row.question.key.length; i++) {
            if ( (i < minx) ) {
                result += '<td bgcolor="white" width={width}>&nbsp;</td>'
            } else if ( (i == minx + row.position) ) {
                    result += '<td style="border: 1px solid" width=' + width +'>' +
                        (solution ? row.question.key[i-minx]: '&nbsp;') +
                        '</td>'
            } else {
                result += '<td bgcolor="#d3d3d3" width=' + width +'>' +
                    (solution ? row.question.key[i-minx]: '&nbsp;') +
                '</td>'
            }
        }
        result += '</tr>'
    }
    result += '</table>'
    return result;
}

const server = http.createServer(function (req, res) {   // 2 - creating server
    const queryObject = url.parse(req.url,true).query;
    const crossword = createCrossword(questions, queryObject["solution"])

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<html><head><meta charset="UTF-8"></head><body>');
    res.write(crossword.error ? "Unable to create crossword - not enough terms " + JSON.stringify(crossword.rows) : (
        render(crossword,false) + '<hr/>' + render(crossword, true))
    );
    res.write('</body></html>');
    res.end();
});

server.listen(5000);

console.log('Crossword endpoint at port 5000 is running..')

