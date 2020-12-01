from os import rename
from os.path import exists
from csv import DictWriter


# Fetch questions (discard empty lines and comments)
def init_question_list(filename):
    questions, temp_questions = [], []
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
                        break
            line_idx += 1
    if temp_questions[-1][0] != '#':
        for chr in temp_questions[-1]:
            if chr != ' ':
                chapter_questions.append(temp_questions[-1])
                break
    questions.append(chapter_questions)

    if questions[0] == ['Questions']:
        del(questions[0])

    return questions


# Parse each discipline
question_idx = 0
dict_questions = []
dict_chapters = []
for discipline in ['maths','physique','SI'] :
    # Parse question list
    questions = init_question_list(f'{discipline}.txt')

    for chapter_idx, chapter in enumerate(questions):
        chapter_name = chapter.pop(0)
        dict_chapters.append({
            'id': chapter_idx,
            'discipline': discipline,
            'name': chapter_name
        })

        for dis_question_id, question in enumerate(chapter):
            correction_path = f'corrections/{discipline}/{chapter_idx:02d}{chapter_name}/{dis_question_id}.pdf'
            correction_exists = exists(correction_path)
            if correction_exists :
                rename(correction_path, f'corrections_new/{question_idx}.pdf')
                try:
                    rename(correction_path[:-4] + '.tex', f'corrections_new/{question_idx}.tex')
                except FileNotFoundError: pass

            dict_questions.append({
                'id': question_idx,
                'discipline': discipline,
                'chapter': chapter_idx,
                'content': question,
                'corr': 1 if correction_exists else 0,
                'suggested_corr': '',
            })
            question_idx += 1

# Write dictionary lists to csv files
with open('chapters.csv', 'w', encoding='utf8', newline='') as output_file:
    keys = dict_chapters[0].keys()
    writer = DictWriter(output_file, keys, delimiter='\t')
    writer.writeheader()
    writer.writerows(dict_chapters)

with open('questions.csv', 'w', encoding='utf8', newline='') as output_file:
    keys = dict_questions[0].keys()
    writer = DictWriter(output_file, keys, delimiter='\t')
    writer.writeheader()
    writer.writerows(dict_questions)
