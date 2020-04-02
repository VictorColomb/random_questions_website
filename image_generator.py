from tkinter import Tk, Label, Entry, Button, StringVar, Canvas
import sympy as sp
from io import BytesIO
from random import shuffle
from tkinter.filedialog import askopenfilename
from sys import argv
from os import mkdir, chdir, remove, system
from shutil import move, rmtree, get_terminal_size
from glob import glob


# Fetch questions (discard empty lines and comments)
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
    while line_idx < len(temp_questions) - 1 and temp_questions[line_idx][:2] != '##' :
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
    entry.pack(side="left",padx=5,pady=10)
    def output_folder_destroy(*args):
        global output_folder
        print(f'Setting output folder to {entry_text.get()}')
        output_folder = entry_text.get()
        root.destroy()
    button = Button(root, text='Ok', command=output_folder_destroy)
    button.pack(side='right', padx=5,pady=10)
    Label(root, text='Warning : Folder will be deleted.').pack(side='bottom',padx=5,pady=5)
    root.attributes('-topmost', 1)
    root.focus_force()
    root.attributes('-topmost', 0)
    root.mainloop()
else:
    output_folder = argv[2]


# Create output and temp folders
try:
    rmtree(output_folder)
except FileNotFoundError:
    pass
mkdir(output_folder)
chdir(output_folder)
mkdir('tmp')


# Compile single question into ps byte streams
def on_latex(idx, exprr):
    global no_latex_errors
    # Assumes we are in the temp directory...

    exprrr = exprr.split(r'\\')

    ps_no = 0

    for expr in exprrr:
        f = BytesIO()
        try:
            sp.preview(expr, euler=True, preamble=r"\documentclass[border=2pt]{standalone}"
                       r"\usepackage[T1]{fontenc}"
                       r"\usepackage[utf8]{inputenc}"
                       r"\usepackage{amssymb}"
                       r"\usepackage{amsmath}"
                       r"\usepackage{lmodern}"
                       r"\usepackage{xcolor}"
                       r"\begin{document}"
                       r"\color{white}",
                       viewer="BytesIO", output="ps", outputbuffer=f)
        except RuntimeError:
            no_latex_errors += 1
            with open('../errors.txt','a') as latex_error_output:
                print(f'# Question {idx}', exprr, sep='\n', file=latex_error_output)
            for file in glob('*.ps'):
                remove(file)
            return False
        f.seek(0)
        with open(f'{ps_no}.ps', 'wb') as ps_output:
            ps_output.write(f.read())
        f.close()
        ps_no += 1
    return True


# Convert ps files into single jpg
def ps_to_jpg(idx):    
    # Assumes we are in the temp folder...
    png_out = f'{idx}.png'

    # Concatenate all ps files into one jpg
    process = system(f'convert -colorspace rgb -background none -density 1000 -append *.ps {idx}.png')

    if process != 0:
        raise Exception('Fuck, convert ps to jpg did not work...\nDo you have ImageMagick installed ?')

    # Move output jpg to parent directory
    move(png_out, '..')

    # Clear temp directory from ps files
    for file in glob('*.ps'):
        try:
            remove(file)
        except NotImplementedError:
            pass

nb_chapters = len(questions)
columns = get_terminal_size(fallback=(40,24))[0]
no_latex_errors = 0

i = 0
# Convert all questions in numbered jpg files
for chapter_questions in questions:
    chapter = chapter_questions[0]
    chapter_questions = chapter_questions[1:]
    for idx, question in enumerate(chapter_questions):
        # Move to tmp directory
        chdir('tmp')

        # Progress bar
        progress_bar = f'Progress : |{"="*(i*30//nb_questions)}{" "*(30-i*30//nb_questions)}| {i*100//nb_questions}% - {i}/{nb_questions}'
        print(progress_bar, ' '*(columns-len(progress_bar)-1), sep='', end='\r')

        # Create ps files from expression
        generate_images = on_latex(idx, question)

        # ps files to a single concatenated jpg file
        if generate_images:
            ps_to_jpg(idx)

        # Back to output_folder
        chdir('..')

        # increment progress counter
        i += 1

    try:
        mkdir(chapter)
    except FileExistsError:
        raise Exception('Two chapters with the same name')
    for file in glob('*.png'):
        move(file,chapter)


progress_bar = f'Progress : |{"="*30}| 100% - {nb_questions}/{nb_questions}'
print(progress_bar, ' '*(columns-len(progress_bar)-1), sep='')

rmtree('tmp')
if no_latex_errors:
    if no_latex_errors > 1:
        latex_str = f'\nThere were {no_latex_errors} latex compilation errors.\nThe corresponding questions have been recorded to errors.txt'
    else:
        latex_str = '\nThere was one latex compilation error.\nThe corresponding question has been recorded to errors.txt'
else:
    latex_str = ''
print(f'Successfully rendered {nb_questions-no_latex_errors} questions.{latex_str}')

if len(argv) == 1:
    input("Press ENTER to continue...")
