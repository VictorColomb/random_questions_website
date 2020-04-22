from tkinter import Tk, Label, Entry, Button, StringVar, Canvas
from tkinter.filedialog import askopenfilename
from sys import argv
from os import chdir, mkdir
from os.path import exists


# Fetch questions
def init_question_list(filename):
    temp_questions = []
    global questions, nb_questions
    try:
        with open(filename, 'r', encoding='utf-8-sig') as input:
            for line in input:
                temp_questions.append(line)
    except FileNotFoundError:
        print('No such file. Exiting...')
        input('Press ENTER to continue...')
        exit(1)
    line_idx = 0
    chapter_questions = ['Questions']
    while line_idx < len(temp_questions) - 1 and temp_questions[line_idx][:2] != '##':
        line = temp_questions[line_idx]
        if line[0] != '#':
            for chr in line[:-1]:
                if chr != ' ':
                    chapter_questions.append(line[:-1])
                    nb_questions += 1
                    break
        line_idx += 1
    while line_idx < len(temp_questions) - 1:
        questions.append(chapter_questions)
        chapter_questions = [temp_questions[line_idx][3:].strip()]
        line_idx += 1
        while line_idx < len(temp_questions) - 1 and temp_questions[line_idx][:2] != '##':
            line = temp_questions[line_idx]
            if line[0] != '#':
                for chr in line[:-1]:
                    if chr != ' ':
                        chapter_questions.append(line[:-1])
                        nb_questions += 1
                        break
            line_idx += 1
    if temp_questions[-1][0] != '#':
        for chr in temp_questions[-1]:
            if chr != ' ':
                chapter_questions.append(temp_questions[-1])
                nb_questions += 1
                break
    questions.append(chapter_questions)

    if questions[0] == ['Questions']:
        del(questions[0])


# Fetch input file and output folder from arguments or prompts
questions = []
nb_questions = 0
if len(argv) == 1:
    print('Not enough arguments, opening file prompt.')
    root = Tk()
    root.withdraw()
    root.wm_iconbitmap('favicon.ico')
    input_filename = askopenfilename()
    init_question_list(input_filename)
    root.attributes('-topmost', 1)
    root.focus_force()
    root.attributes('-topmost', 0)
    root.destroy()
    del root
else:
    input_filename = argv[1]
    init_question_list(input_filename)
output_folder = 'output'
if len(argv) <= 2:
    print("Not enough arguments, opening output folder prompt.")
    root = Tk()
    root.wm_iconbitmap('favicon.ico')
    root.title('Output folder')
    entry_text = StringVar()
    entry = Entry(root, textvariable=entry_text)
    entry_text.set(input_filename.split('\\')[-1].split('/')[-1].split('.')[0])
    entry.pack(side="left", padx=5, pady=10)

    def output_folder_destroy(*args):
        global output_folder
        print(f'Setting output folder to {entry_text.get()}')
        output_folder = entry_text.get()
        root.destroy()
    button = Button(root, text='Ok', command=output_folder_destroy)
    button.pack(side='right', padx=5, pady=10)
    root.attributes('-topmost', 1)
    root.focus_force()
    root.attributes('-topmost', 0)
    root.mainloop()
else:
    output_folder = argv[2]


out_string = '\\documentclass[a4paper]{{article}}\n\\usepackage[T1]{{fontenc}}\n\\usepackage[utf8]{{inputenc}}\n\\usepackage{{lmodern}}\n\\usepackage{{amsmath,amssymb}}\n\\usepackage[top=3cm,bottom=2cm,left=2cm,right=2cm]{{geometry}}\n\\usepackage{{fancyhdr}}\n\\usepackage{{esvect}}\n\\usepackage{{xcolor}}\n\\usepackage{{tikz}}\\usetikzlibrary{{calc}}\n\n\\parskip 1em\\parindent 0pt\n\n\\begin{{document}}\n\n\\pagestyle{{fancy}}\n\\fancyhf{{}}\n\\setlength{{\\headheight}}{{15pt}}\n\\fancyhead[L]{{{0}}}\\fancyhead[R]{{Question {1}}}\n\n% Énoncé\n\\begin{{center}}\n\t\\large{{\\boldmath{{\\textbf{{{2}}}}}}}\n\\end{{center}}\n\n% Correction\n\n\n\\end{{document}}\n'

chdir(output_folder)

for ch_nb,chapter_questions in enumerate(questions):
    chapter = chapter_questions[0]
    chapter_questions = chapter_questions[1:]
    chapter_outname = "%02d" % ch_nb + chapter

    try:
        mkdir(chapter_outname)
    except FileExistsError:
        pass
    chdir(chapter_outname)

    for idx,question in enumerate(chapter_questions):
        if not exists(f'{idx}.tex'):
            with open(f'{idx}.bad.tex', 'w', encoding='utf-8-sig') as output:
                output.write( out_string.format(chapter, idx + 1, question) )
    
    chdir('..')
