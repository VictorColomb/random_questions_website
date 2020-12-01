# random_questions_website

## Generate empty correction template

```[latex]
\\documentclass[a4paper]{{article}}\n\\usepackage[T1]{{fontenc}}\n\\usepackage[utf8]{{inputenc}}\n\\usepackage{{lmodern}}\n\\usepackage{{amsmath,amssymb}}\n\\usepackage[top=3cm,bottom=2cm,left=2cm,right=2cm]{{geometry}}\n\\usepackage{{fancyhdr}}\n\\usepackage{{esvect}}\n\\usepackage{{xcolor}}\n\\usepackage{{tikz}}\\usetikzlibrary{{calc}}\n\n\\parskip 1em\\parindent 0pt\n\n\\begin{{document}}\n\n\\pagestyle{{fancy}}\n\\fancyhf{{}}\n\\setlength{{\\headheight}}{{15pt}}\n\\fancyhead[L]{{{0}}}\\fancyhead[R]{{Question {1}}}\n\n% Énoncé\n\\begin{{center}}\n\t\\large{{\\boldmath{{\\textbf{{{2}}}}}}}\n\\end{{center}}\n\n% Correction\n\n\n\\end{{document}}\n
```

## CSV headers

`chapters.csv` : id | discipline | name

`questions.csv` : id | discipline | chapter | content | corr | suggested_corr
