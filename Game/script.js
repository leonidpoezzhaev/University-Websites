const memes = [
    {
        id: 1,
        src: 'images/meme1.jpg',
        answer: 'Ждун',
        ru: ['ждун', 'ждунчик'],
        hints: ['Серое существо', 'Ожидание'],
        difficulty: 'easy'
    },
    {
        id: 2,
        src: 'images/meme2.jpg',
        answer: 'Наташа и коты',
        ru: ['наташа', 'наташа и коты', 'коты наташа'],
        hints: ['Девушка с котами', 'Кричащая женщина'],
        difficulty: 'easy'
    },
    {
        id: 3,
        src: 'images/meme3.jpg',
        answer: 'Лягушка Пепе',
        ru: ['лягушка пепе', 'пепе'],
        hints: ['Зелёная лягушка', 'Feels good man'],
        difficulty: 'medium'
    },
    {
        id: 4,
        src: 'images/meme4.jpg',
        answer: 'Успешный ребёнок',
        ru: ['успешный ребенок', 'успешный малыш'],
        hints: ['Сжатый кулак', 'Песчаный фон'],
        difficulty: 'easy'
    },
    {
        id: 5,
        src: 'images/meme5.jpg',
        answer: 'Доге',
        ru: ['доге', 'собака доге'],
        hints: ['Сиба-ину', 'Милая собака'],
        difficulty: 'medium'
    },
    {
        id: 6,
        src: 'images/meme6.jpg',
        answer: 'Жак Фреско',
        ru: ['жак фреско', 'парень с бабочкой'],
        hints: ['Мужчина с бабочкой', 'Философский мем'],
        difficulty: 'hard'
    },
    {
        id: 7,
        src: 'images/meme7.jpg',
        answer: 'Гарольд',
        ru: ['гарольд', 'скрывающий боль'],
        hints: ['Пожилой мужчина', 'Принуждённая улыбка'],
        difficulty: 'hard'
    },
    {
        id: 8,
        src: 'images/meme8.jpg',
        answer: 'Кот в сапогах',
        ru: ['кот в сапогах', 'puss in boots'],
        hints: ['Из Шрека', 'Большие глаза'],
        difficulty: 'easy'
    },
    {
        id: 9,
        src: 'images/meme9.jpg',
        answer: 'Неверный парень',
        ru: ['неверный парень', 'distracted boyfriend'],
        hints: ['Парень оглядывается', 'Девушка в красном'],
        difficulty: 'medium'
    },
    {
        id: 10,
        src: 'images/meme10.jpg',
        answer: 'Это фиаско, братан',
        ru: ['это фиаско братан', 'фиаско братан'],
        hints: ['Фраза из шоу', 'Популярная реакция'],
        difficulty: 'hard'
    }
];

const TOTAL_MEMES = 10;

const state = {
    difficulty: 'easy',
    currentMeme: null,
    score: 0,
    streak: 0,
    best: parseInt(localStorage.getItem('memeBestScore')) || 0,
    played: 0,
    timer: null,
    timeLeft: 100,
    active: false
};

const get = (id) => document.getElementById(id);
const diffBtns = document.querySelectorAll('.diff-btn');
const el = {
    image: get('memeImage'),
    placeholder: get('placeholder'),
    hint: get('hintText'),
    input: get('answerInput'),
    submit: get('submitBtn'),
    skip: get('skipBtn'),
    score: get('score'),
    streak: get('streak'),
    memeCount: get('memeCount'),
    best: get('best'),
    timerWrap: get('timerWrapper'),
    timerFill: get('timerFill'),
    message: get('message'),
    overlay: get('overlay'),
    overlayTitle: get('overlayTitle'),
    overlayBody: get('overlayBody'),
    overlayBtn: get('overlayBtn')
};

function init() {
    el.best.textContent = state.best;
    el.overlayBtn.addEventListener('click', () => {
        el.overlay.classList.remove('active');
        resetGame();
    });
    el.submit.addEventListener('click', handleSubmit);
    el.skip.addEventListener('click', handleSkip);
    el.input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSubmit();
    });
    diffBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const diff = btn.dataset.diff;
            if (state.difficulty !== diff) {
                setDifficulty(diff);
                resetGame();
            }
        });
    });
    el.image.addEventListener('error', () => {
        el.image.style.display = 'none';
        el.placeholder.style.display = 'flex';
    });
    el.image.addEventListener('load', () => {
        el.image.style.display = 'block';
        el.placeholder.style.display = 'none';
    });
    setDifficulty('easy');
    nextMeme();
}

function setDifficulty(diff) {
    state.difficulty = diff;
    diffBtns.forEach(b => b.classList.toggle('active', b.dataset.diff === diff));
    el.timerWrap.style.display = (diff === 'hard') ? 'block' : 'none';
    if (diff !== 'hard') clearTimer();
}

function getFilteredMemes() {
    return memes.filter(m => {
        if (state.difficulty === 'easy') return m.difficulty === 'easy';
        if (state.difficulty === 'medium') return ['easy', 'medium'].includes(m.difficulty);
        return true;
    });
}

function nextMeme() {
    clearTimer();
    el.message.textContent = '';
    el.input.value = '';
    el.input.disabled = false;
    el.submit.disabled = false;

    if (state.played >= TOTAL_MEMES) {
        endGame();
        return;
    }

    const pool = getFilteredMemes();
    if (pool.length === 0) {
        el.hint.textContent = 'Нет данных';
        return;
    }

    state.currentMeme = pool[Math.floor(Math.random() * pool.length)];
    state.active = true;

    el.image.src = state.currentMeme.src;

    if (state.difficulty === 'hard') {
        el.hint.textContent = '???';
        el.image.style.filter = 'blur(12px)';
        startTimer();
    } else {
        el.image.style.filter = 'none';
        if (state.difficulty === 'medium') {
            el.hint.textContent = state.currentMeme.hints[0] || 'Думай...';
        } else {
            el.hint.textContent = state.currentMeme.hints.join(' | ');
        }
    }

    updateDisplay();
}

function startTimer() {
    state.timeLeft = 100;
    el.timerFill.style.width = '100%';
    clearTimer();
    state.timer = setInterval(() => {
        state.timeLeft--;
        el.timerFill.style.width = state.timeLeft + '%';
        if (state.timeLeft <= 0) {
            clearTimer();
            timeoutLoss();
        }
    }, 100);
}

function clearTimer() {
    if (state.timer) {
        clearInterval(state.timer);
        state.timer = null;
    }
}

function timeoutLoss() {
    if (!state.active) return;
    state.active = false;
    state.score = Math.max(0, state.score - 30);
    state.streak = 0;
    state.played++;
    showMessage('ВРЕМЯ ВЫШЛО — -30', '#b91c1c');
    el.input.disabled = true;
    el.submit.disabled = true;
    updateDisplay();
    setTimeout(() => {
        if (state.played < TOTAL_MEMES) nextMeme();
        else endGame();
    }, 1500);
}

function handleSubmit() {
    if (!state.active || !state.currentMeme) return;
    const answer = el.input.value.trim().toLowerCase();
    if (!answer) return;

    const correct = state.currentMeme.ru.some(a => answer.includes(a));

    if (correct) {
        clearTimer();
        state.active = false;
        const points = state.difficulty === 'hard' ? 150 : state.difficulty === 'medium' ? 100 : 70;
        state.score += points;
        state.streak++;
        state.played++;
        showMessage(`ПРАВИЛЬНО +${points}`, '#15803d');
        el.input.disabled = true;
        el.submit.disabled = true;
        updateBest();
        updateDisplay();
        setTimeout(() => {
            if (state.played < TOTAL_MEMES) nextMeme();
            else endGame();
        }, 1200);
    } else {
        state.streak = 0;
        showMessage('НЕВЕРНО, попробуй ещё', '#b91c1c');
        el.input.value = '';
        el.input.focus();
        updateDisplay();
    }
}

function handleSkip() {
    if (!state.active) return;
    clearTimer();
    state.active = false;
    state.score = Math.max(0, state.score - 50);
    state.streak = 0;
    state.played++;
    showMessage('ПРОПУЩЕНО — -50', '#a16207');
    el.input.disabled = true;
    el.submit.disabled = true;
    updateDisplay();
    setTimeout(() => {
        if (state.played < TOTAL_MEMES) nextMeme();
        else endGame();
    }, 1200);
}

function showMessage(text, color) {
    el.message.textContent = text;
    el.message.style.color = color;
}

function updateDisplay() {
    el.score.textContent = state.score;
    el.streak.textContent = state.streak;
    el.memeCount.textContent = `${state.played}/${TOTAL_MEMES}`;
    if (state.score > state.best) {
        state.best = state.score;
        localStorage.setItem('memeBestScore', state.best);
    }
    el.best.textContent = state.best;
}

function updateBest() {
    if (state.score > state.best) {
        state.best = state.score;
        localStorage.setItem('memeBestScore', state.best);
        el.best.textContent = state.best;
    }
}

function endGame() {
    clearTimer();
    state.active = false;
    el.overlay.classList.add('active');
    el.overlayTitle.textContent = 'ИГРА ОКОНЧЕНА';
    el.overlayBody.textContent = `Пройдено мемов: ${state.played}\nФинальный счёт: ${state.score}`;
}

function resetGame() {
    clearTimer();
    state.score = 0;
    state.streak = 0;
    state.played = 0;
    state.active = false;
    el.image.style.filter = 'none';
    el.message.textContent = '';
    el.input.disabled = false;
    el.submit.disabled = false;
    el.input.value = '';
    updateDisplay();
    nextMeme();
}

window.addEventListener('load', init);