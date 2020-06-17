# random_questions_website

[![Releases](https://img.shields.io/github/v/release/viccol961/random_questions_website?sort=semver)](https://github.com/viccol961/random_questions_website/releases)
[![Issues](https://img.shields.io/github/issues/viccol961/random_questions_website)](https://github.com/viccol961/random_questions_website/issues)
[![License](https://img.shields.io/github/license/viccol961/random_questions_website)](https://github.com/viccol961/random_questions_website/blob/master/LICENSE)
[![Website](https://img.shields.io/website?down_message=down&up_color=green&up_message=up&url=http%3A%2F%2F78.193.98.200)](http://78.193.98.200)

Site de révisions du programme de MP

![See preview : [https://i.imgur.com/gN97psS.jpg](https://i.imgur.com/gN97psS.jpg)](https://i.imgur.com/gN97psS.jpg)

## Generate questions with `image_generator.py`

### Requirements

* `python` 3.x
* python module `sympy`
* `latex`
* latex packages `amsmath`, `amssymb`, `lmodern`, `xcolor`, `geometry`, `xcolor`, `esvect`, `esint` and `tikz`

### Usage

```[batch]
python3 image_generator.py textfile output_directory
```

* `textfile` : file containing questions separated with a newline, comment out lines with `#`, separate chapters with `##`
* `output_directory` : directory in which to generate the question images

Questions are generated as `??.png` and organized in folders, corresponding to chapters, where `??` is the question number in the chapter, starting with `0.png`.

Empty correction `??.bad.tex` files are created next to each question.

## `index.php`

Written for three disciplines : maths, physique and SI. Displays questions randomly from those that have not been marked by the user.

Progression for each discipline saved in the browser's local storage.

Chapters can be selected or disselected. Only questions from the chosen chapters will be displayed to the user.

If a correction is available, open with ![the filled lightbulb button](https://fonts.gstatic.com/s/i/materialicons/emoji_objects/v5/24px.svg). If not, the user can suggest one by clicking ![the empty lightbulb button](https://fonts.gstatic.com/s/i/materialiconsoutlined/emoji_objects/v5/24px.svg), which opens `correction/index.php`.

## `correction/index.php`

![See preview here : https://i.imgur.com/3RULqiP.jpg](https://i.imgur.com/3RULqiP.jpg)

Takes a suggestion for a correction, to be compiled by LaTeX, using the following header :

```[latex]
\documentclass[a4paper]{article}
\usepackage[T1]{fontenc}
\usepackage[utf8]{inputenc}
\usepackage{lmodern}
\usepackage{amsmath,amssymb}
\usepackage[top=3cm,bottom=2cm,left=2cm,right=2cm]{geometry}
\usepackage{fancyhdr}
\usepackage{esvect,esint}
\usepackage{xcolor}
\usepackage{tikz}\usetikzlibrary{calc}

\parskip1em\parindent0pt\let\ds\displaystyle
```

The textarea comes with syntax highlighting, provided by [CodeMirror](https://codemirror.net). Should a previously suggested correction is found, the existing latex code will be given to the user.

If a name is input in the corresponding textbox, it will be appended to the footer of the correction pdf.

The input code is sent via POST to `submit.php`.

## `correction/submit.php`

Receives a correction suggestion through POST php variables, creates a `.tex` file and compiles it.

On success (exit code 0), the pdf output is displayed to the user for review. On fail (exit code 1), the user is offered to open the log file and to go back to the previous page.
