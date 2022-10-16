# random_questions_website

[![Releases](https://img.shields.io/github/v/release/viccol961/random_questions_website?sort=semver&style=flat-square)](https://github.com/viccol961/random_questions_website/releases)
[![Issues](https://img.shields.io/github/issues/viccol961/random_questions_website?style=flat-square)](https://github.com/viccol961/random_questions_website/issues)
[![License](https://img.shields.io/github/license/viccol961/random_questions_website?style=flat-square)](https://github.com/viccol961/random_questions_website/blob/master/LICENSE)

**Site de révision du programme de MP**

![See preview : [https://i.imgur.com/gN97psS.jpg](https://i.imgur.com/gN97psS.jpg)](https://i.imgur.com/gN97psS.jpg)

## Features

Written for three disciplines : maths, physique and SI. Displays questions randomly from those that have not been marked by the user.

Progression for each discipline saved in the browser's local storage.

Chapters can be selected or unselected. Only questions from the chosen chapters will be displayed to the user.

If a correction is available, open with ![the filled lightbulb button](https://fonts.gstatic.com/s/i/materialicons/emoji_objects/v5/24px.svg). If not, the user can suggest one by clicking ![the empty lightbulb button](https://fonts.gstatic.com/s/i/materialiconsoutlined/emoji_objects/v5/24px.svg), which opens `correction/index.php`. Alternatively, press `C`.

### Suggest a correction

The textarea comes with syntax highlighting, provided by [CodeMirror](https://codemirror.net). Should a previously suggested correction is found, the existing latex code will be given to the user.

The user can also upload a `.tex` or `.pdf` file (5M max).

The input code or the file is sent via POST to `submit.php`.

## Installation

Clone or unpack minified version from releases.

Set up PHP server.

Make sure the following settings are set in `php.ini` :

```[ini]
file_uploads = On
upload_max_filesize = 5M
post_max_size = 8M
```

The variable `post_max_size` may be of any size a little greater than `5M` but don't make it too big though.

## CSV files

Data, except corrections, is stored in the following csv files, located in the `/data` folder (csv headers are given too) :

* `chapters.csv` : id | discipline | name
* `questions.csv` : id | discipline | chapter | content | corr
* `comments.csv` : timestamp | question_id | name | email | comment | read
* `corrections.csv` : timestamp | question_id | correction_id | file_extension

### Admin interface page coming...

## License

The code is licensed under the [MIT license](https://github.com/prepaStan-revisions/random_questions_website/blob/v2/LICENSE).

Questions and corrections are licensed under the [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-nc-sa/4.0/).
