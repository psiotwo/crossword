# crossword
Simple crossword generator

## Usage:
1. Edit `questionBank.json` -- add as many questions as possible. `key` denotes what is expected to fill by the user, `legend` denotes what is shown to her/him as a hint.
2. run `npm start`
3. Request the crossword - `http://localhost:5000/?solution=list` will render a crossword with solution 'list' using some of the questions from the bank.
