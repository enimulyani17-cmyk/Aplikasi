import { Quiz, ExamToken, LiveStudent, ViolationRecord, GoogleFormItem, TransactionItem } from '../types';

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'quiz-1',
    title: 'Kerucut',
    subject: 'Matematika',
    gradeLevel: 'SMP Kelas 9',
    badge: 'SMP',
    questionsCount: 10,
    optionsCount: 4,
    batchId: 'UKINIW07',
    createdAt: '12 menit yang lalu',
    status: 'Terbit',
    questions: [
      {
        number: 1,
        question: 'Sebuah kerucut memiliki jari-jari alas 7 cm dan panjang garis pelukis 25 cm. Berapakah luas selimut kerucut tersebut? (Gunakan π = 22/7)',
        options: [
          { key: 'A', text: '550 cm²' },
          { key: 'B', text: '525 cm²' },
          { key: 'C', text: '600 cm²' },
          { key: 'D', text: '350 cm²' },
        ],
        correctAnswer: 'A',
        cognitiveLevel: 'C3',
        explanation: 'Rumus luas selimut kerucut = π × r × s. L = (22/7) × 7 × 25 = 550 cm².',
      },
      {
        number: 2,
        question: 'Jika tinggi sebuah kerucut adalah 12 cm dan jari-jari alasnya 5 cm, maka panjang garis pelukis (s) kerucut adalah...',
        options: [
          { key: 'A', text: '13 cm' },
          { key: 'B', text: '15 cm' },
          { key: 'C', text: '17 cm' },
          { key: 'D', text: '14 cm' },
        ],
        correctAnswer: 'A',
        cognitiveLevel: 'C2',
        explanation: 'Menggunakan rumus Pythagoras: s = √(r² + t²) = √(5² + 12²) = √(25 + 144) = √169 = 13 cm.',
      },
      {
        number: 3,
        question: 'Sebuah kerucut memiliki diameter alas 14 cm dan tinggi 24 cm. Luas permukaan kerucut tersebut adalah...',
        options: [
          { key: 'A', text: '704 cm²' },
          { key: 'B', text: '616 cm²' },
          { key: 'C', text: '550 cm²' },
          { key: 'D', text: '812 cm²' },
        ],
        correctAnswer: 'A',
        cognitiveLevel: 'C3',
        explanation: 'r = 7 cm, s = √(7² + 24²) = √(49 + 576) = 25 cm. Luas Permukaan = πr(r + s) = (22/7) × 7 × (7 + 25) = 22 × 32 = 704 cm².',
      },
      {
        number: 4,
        question: 'Volume kerucut yang memiliki diameter 20 cm dan tinggi 15 cm adalah... (π = 3,14)',
        options: [
          { key: 'A', text: '1.570 cm³' },
          { key: 'B', text: '3.140 cm³' },
          { key: 'C', text: '4.710 cm³' },
          { key: 'D', text: '1.256 cm³' },
        ],
        correctAnswer: 'A',
        cognitiveLevel: 'C3',
        explanation: 'r = 10 cm. V = (1/3) × π × r² × t = (1/3) × 3,14 × 100 × 15 = 3,14 × 100 × 5 = 1.570 cm³.',
      },
      {
        number: 5,
        question: 'Sebuah tenda berbentuk kerucut tanpa alas dibuat dari kain terpal. Jika diameter tenda 8 m dan tingginya 3 m, luas kain terpal minimum yang dibutuhkan adalah... (π = 3,14)',
        options: [
          { key: 'A', text: '62,8 m²' },
          { key: 'B', text: '75,4 m²' },
          { key: 'C', text: '50,24 m²' },
          { key: 'D', text: '100,48 m²' },
        ],
        correctAnswer: 'A',
        cognitiveLevel: 'C4',
        explanation: 'r = 4 m, t = 3 m, maka s = √(4² + 3²) = 5 m. Luas selimut = π × r × s = 3,14 × 4 × 5 = 62,8 m².',
      },
      {
        number: 6,
        question: 'Hubungan antara jari-jari alas (r), tinggi kerucut (t), dan garis pelukis (s) dinyatakan dalam persamaan...',
        options: [
          { key: 'A', text: 's² = r² + t²' },
          { key: 'B', text: 't² = s² + r²' },
          { key: 'C', text: 'r² = s² + t²' },
          { key: 'D', text: 's = r + t' },
        ],
        correctAnswer: 'A',
        cognitiveLevel: 'C1',
        explanation: 'Garis pelukis merupakan sisi miring segitiga siku-siku antara jari-jari dan tinggi, sehingga s² = r² + t².',
      },
      {
        number: 7,
        question: 'Dua buah kerucut memiliki perbandingan jari-jari 2 : 3 dan tinggi sama. Perbandingan volume kedua kerucut tersebut adalah...',
        options: [
          { key: 'A', text: '4 : 9' },
          { key: 'B', text: '2 : 3' },
          { key: 'C', text: '8 : 27' },
          { key: 'D', text: '1 : 2' },
        ],
        correctAnswer: 'A',
        cognitiveLevel: 'C4',
        explanation: 'Karena tinggi sama, perbandingan volume sebanding dengan kuadrat jari-jari: (r1/r2)² = (2/3)² = 4/9.',
      },
      {
        number: 8,
        question: 'Bentuk jaring-jaring selimut kerucut berupa bidang datar...',
        options: [
          { key: 'A', text: 'Juring lingkaran' },
          { key: 'B', text: 'Segitiga sama kaki' },
          { key: 'C', text: 'Trapesium' },
          { key: 'D', text: 'Tembereng lingkaran' },
        ],
        correctAnswer: 'A',
        cognitiveLevel: 'C1',
        explanation: 'Jika selimut kerucut dibentangkan, akan membentuk juring lingkaran dengan jari-jari sebesar garis pelukis (s).',
      },
      {
        number: 9,
        question: 'Sebuah cetakan nasi tumpeng berbentuk kerucut memiliki keliling lingkaran alas 44 cm dan tinggi 18 cm. Volume cetakan tersebut adalah...',
        options: [
          { key: 'A', text: '924 cm³' },
          { key: 'B', text: '880 cm³' },
          { key: 'C', text: '1.020 cm³' },
          { key: 'D', text: '768 cm³' },
        ],
        correctAnswer: 'A',
        cognitiveLevel: 'C4',
        explanation: 'K = 2πr -> 44 = 2 × (22/7) × r -> r = 7 cm. V = (1/3) × (22/7) × 7 × 7 × 18 = 924 cm³.',
      },
      {
        number: 10,
        question: 'Jika diameter alas kerucut diperbesar 2 kali dan tingginya diperkecil 1/2 kali tinggi semula, maka volume kerucut baru menjadi...',
        options: [
          { key: 'A', text: '2 kali volume semula' },
          { key: 'B', text: '4 kali volume semula' },
          { key: 'C', text: 'Tetap sama' },
          { key: 'D', text: '1/2 kali volume semula' },
        ],
        correctAnswer: 'A',
        cognitiveLevel: 'C5',
        explanation: 'V_baru = (1/3)π(2r)²(1/2 t) = (1/3)π × 4r² × 1/2 t = 2 × [(1/3)πr²t] = 2 kali volume semula.',
      },
    ],
  },
  {
    id: 'quiz-2',
    title: 'Bangun Ruang Tabung Sisi Lengkung',
    subject: 'Matematika',
    gradeLevel: 'SMP Kelas 9',
    badge: 'SMP',
    questionsCount: 10,
    optionsCount: 4,
    batchId: 'TABUNG99',
    createdAt: '59 menit yang lalu',
    status: 'Terbit',
    questions: [
      {
        number: 1,
        question: 'Rumus untuk menghitung luas seluruh permukaan tabung tertutup adalah...',
        options: [
          { key: 'A', text: '2πr(r + t)' },
          { key: 'B', text: 'πr²t' },
          { key: 'C', text: '2πrt' },
          { key: 'D', text: 'πr(r + s)' },
        ],
        correctAnswer: 'A',
        cognitiveLevel: 'C1',
        explanation: 'Luas tabung = 2 × Luas alas + Luas selimut = 2πr² + 2πrt = 2πr(r + t).',
      },
      {
        number: 2,
        question: 'Sebuah tabung memiliki jari-jari 7 cm dan tinggi 10 cm. Berapakah volume tabung tersebut? (π = 22/7)',
        options: [
          { key: 'A', text: '1.540 cm³' },
          { key: 'B', text: '1.450 cm³' },
          { key: 'C', text: '770 cm³' },
          { key: 'D', text: '3.080 cm³' },
        ],
        correctAnswer: 'A',
        cognitiveLevel: 'C2',
        explanation: 'V = πr²t = (22/7) × 7 × 7 × 10 = 1.540 cm³.',
      },
    ],
  },
];

export const INITIAL_TOKENS: ExamToken[] = [
  {
    token: 'ZJT0P4M',
    label: 'Ulangan',
    quizId: 'quiz-1',
    quizTitle: 'Kerucut',
    quizSubject: 'IPA',
    limit: 1,
    status: 'Aktif',
    expiresAt: null,
    waitingRoom: false,
    waitingRoomStarted: false,
    createdAt: 'Baru saja',
  },
];

export const INITIAL_STUDENTS: LiveStudent[] = [
  {
    id: 'stud-1',
    name: 'Belum mengisi nama',
    classGrade: '-',
    absentNo: '-',
    token: 'ZJT0P4M',
    status: 'Terputus',
    violations: 0,
    lastViolationReason: '—',
    lastSeen: '35 jam lalu',
  },
  {
    id: 'stud-2',
    name: 'Yan',
    classGrade: '9B',
    absentNo: '1',
    token: 'ZJT0P4M',
    status: 'Selesai',
    violations: 0,
    lastViolationReason: '—',
    lastSeen: '31 mnt lalu',
    score: 90,
    submittedAt: '31 menit lalu',
  },
];

export const INITIAL_GOOGLE_FORMS: GoogleFormItem[] = [];

export const INITIAL_TRANSACTIONS: TransactionItem[] = [
  {
    id: 'trx-1',
    packageName: 'Paket Basic',
    date: '07 Sep 2026, 00:16',
    amount: 'Rp 103.880',
    status: 'DISETUJUI',
  },
];

export const GAS_SCRIPT_CODE = `/**
 * soalpintar.ai — Google Form Creator Bridge
 * 
 * CARA SETUP (1x saja):
 * 1. Buka https://script.google.com
 * 2. Klik "New Project"
 * 3. Hapus isi default, paste seluruh kode ini
 * 4. Klik Deploy > New deployment
 * 5. Pilih type: Web app
 * 6. Execute as: Me (akun Anda)
 * 7. Who has access: Anyone
 * 8. Klik Deploy
 * 9. Copy URL yang muncul
 * 10. Paste URL ke Settings di dashboard guru
 *
 * SELESAI! Form akan dibuat di Google Drive Anda.
 *
 * VERSI 3.2: fitur "Nilai Siswa" (respons, skor, jawaban per soal) & acak soal.
 *   Respons diambil per halaman (maks. 500) & bisa hanya yang baru, aman untuk ribuan respons.
 * OPSIONAL - acak urutan PILIHAN JAWABAN: di editor Apps Script klik "Services" (+)
 *   > pilih "Google Forms API" > Add. Tanpa ini, yang diacak hanya urutan soal.
 * Jika memperbarui dari versi lama: paste ulang kode ini, lalu
 * Deploy > Manage deployments > Edit (ikon pensil) > Version: New version > Deploy.
 * URL Web App tetap sama, jadi tidak perlu mengubah Settings di dashboard.
 * Saat diminta izin, izinkan akses Google Forms & Drive.
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    
    var quizId = data.quiz_id || '';
    var title = data.title || 'Quiz soalpintar.ai';
    var guruName = data.guru_name || 'Guru';
    var questions = data.questions || [];
    var folderName = data.folder_name || guruName;
    var totalQuestions = questions.length;
    
    // 0. Cek apakah folder dan form untuk Quiz ID ini sudah pernah dibuat sebelumnya
    var parentFolderName = 'v2-soalpintar.ai';
    var folders = DriveApp.getFoldersByName(parentFolderName);
    var parentFolder = folders.hasNext() ? folders.next() : DriveApp.createFolder(parentFolderName);
    
    var guruFolders = parentFolder.getFoldersByName(folderName);
    var guruFolder = guruFolders.hasNext() ? guruFolders.next() : parentFolder.createFolder(folderName);
    
    if (quizId) {
      var searchName = "Quiz: " + title + " [ID-" + quizId + "]";
      var files = guruFolder.getFilesByName(searchName);
      if (files.hasNext()) {
        var file = files.next();
        try {
          var existingForm = FormApp.openById(file.getId());
          return ContentService.createTextOutput(JSON.stringify({
            status: 'success',
            form_url: existingForm.getPublishedUrl(),
            edit_url: existingForm.getEditUrl(),
            form_id: existingForm.getId(),
            folder: folderName,
            is_existing: true
          })).setMimeType(ContentService.MimeType.JSON);
        } catch (err) {
          // Abaikan jika error saat membuka
        }
      }
    }

    // Calculate points per question so total = 100%
    var pointsPerQuestion = totalQuestions > 0 ? Math.floor(100 / totalQuestions) : 1;
    var remainder = totalQuestions > 0 ? 100 - (pointsPerQuestion * totalQuestions) : 0;
    
    // Create Google Form
    var form = FormApp.create(title);
    form.setIsQuiz(true);
    
    var description = 'Quiz dibuat oleh ' + guruName + ' \\n\\nIsi data diri Anda di bagian pertama, lalu kerjakan soal di bagian berikutnya.';
    if (quizId) {
      description += '\\n\\n[Quiz ID: ' + quizId + ']';
    }
    form.setDescription(description);
    
    // ========================================
    // SECTION 1: Data Siswa
    // ========================================
    
    // Nama Lengkap
    var namaItem = form.addTextItem();
    namaItem.setTitle('Nama Lengkap');
    namaItem.setRequired(true);
    namaItem.setHelpText('Masukkan nama lengkap Anda');
    
    // Nomor Absen
    var absenItem = form.addTextItem();
    absenItem.setTitle('Nomor Absen');
    absenItem.setRequired(true);
    absenItem.setHelpText('Masukkan nomor absen Anda');
    
    // Kelas
    var kelasItem = form.addTextItem();
    kelasItem.setTitle('Kelas');
    kelasItem.setRequired(true);
    kelasItem.setHelpText('Contoh: 9A, 10 IPA 2, 7B');
    
    // ========================================
    // SECTION 2: Soal-Soal
    // ========================================
    
    var pageBreak = form.addPageBreakItem();
    pageBreak.setTitle('Soal Ujian');
    pageBreak.setHelpText('Kerjakan soal berikut dengan teliti. Pilih satu jawaban yang paling tepat.\\nTotal nilai: 100');
    
    // Add questions with answer key and points
    for (var i = 0; i < questions.length; i++) {
      var q = questions[i];
      
      // Distribute points: spread remainder across first few questions
      var pts = pointsPerQuestion;
      if (i < remainder) {
        pts = pointsPerQuestion + 1;
      }

      if (q.type === 'essay') {
        var item = form.addParagraphTextItem();
        item.setTitle(q.number + '. ' + q.question);
        item.setRequired(true);
        item.setPoints(pts);
      } else {
        var item = form.addMultipleChoiceItem();
        item.setTitle(q.number + '. ' + q.question);
        item.setRequired(true);
        item.setPoints(pts);
        
        // Build choices with correct answer marked
        var choices = [];
        for (var j = 0; j < q.options.length; j++) {
          var isCorrect = (j === q.answer);
          choices.push(item.createChoice(q.options[j], isCorrect));
        }
        item.setChoices(choices);
      }
    }
    
    // Acak urutan soal / pilihan jawaban (opsional, dari dashboard)
    var shuffleInfo = applyShuffle(form, !!data.shuffle_questions, !!data.shuffle_options);

    // Move form to folder (create if not exists)
    var formFile = DriveApp.getFileById(form.getId());
    if (quizId) {
      formFile.setName("Quiz: " + title + " [ID-" + quizId + "]");
    }
    guruFolder.addFile(formFile);
    DriveApp.getRootFolder().removeFile(formFile);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      form_url: form.getPublishedUrl(),
      edit_url: form.getEditUrl(),
      form_id: form.getId(),
      folder: folderName,
      total_points: 100,
      points_per_question: pointsPerQuestion,
      shuffle_questions: shuffleInfo.questions,
      shuffle_options: shuffleInfo.options
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * doGet: aksi BACA saja (tidak pernah membuat / mengubah form).
 *   ?action=version                         -> versi script
 *   ?action=responses&form_id=ID[&since=ms][&offset=0&limit=500] -> respons + nilai (per halaman)
 *   ?action=find_form&published_id=PID      -> cari ID form (edit) dari ID link publik
 *   ?action=set_shuffle&form_id=ID&questions=1&options=1 -> atur acak soal / pilihan
 */
function doGet(e) {
  var p = (e && e.parameter) || {};
  try {
    if (p.action === 'responses') return jsonOut(getFormResponses(p.form_id, p.since, p.offset, p.limit));
    if (p.action === 'find_form') return jsonOut(findFormByPublishedId(p.published_id));
    if (p.action === 'set_shuffle') {
      var target = FormApp.openById(p.form_id);
      var info = applyShuffle(target, p.questions === '1', p.options === '1');
      return jsonOut({ status: 'success', version: SCRIPT_VERSION, shuffle_questions: info.questions, shuffle_options: info.options, options_message: info.message });
    }

    return jsonOut({ status: 'ok', message: 'soalpintar.ai Form Creator is running!', version: SCRIPT_VERSION });
  } catch (error) {
    return jsonOut({ status: 'error', message: error.toString(), version: SCRIPT_VERSION });
  }
}

var SCRIPT_VERSION = '3.2';

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Ambil semua respons form beserta skor kuis.
 * Kolom identitas dicari dari judul pertanyaan yang mengandung "nama", "absen", "kelas".
 */
function getFormResponses(formId, sinceMs, offsetParam, limitParam) {
  if (!formId) return { status: 'error', message: 'form_id wajib diisi', version: SCRIPT_VERSION };

  var form;
  try {
    form = FormApp.openById(formId);
  } catch (err) {
    return { status: 'error', code: 'no_access', message: 'Form tidak bisa dibuka oleh akun Google ini. Pastikan form ada di akun yang sama dengan Apps Script.', version: SCRIPT_VERSION };
  }

  var isQuiz = form.isQuiz();
  var items = form.getItems();
  var maxScore = 0;
  var itemMeta = [];
  var idItems = { name: null, absen: null, kelas: null };

  for (var i = 0; i < items.length; i++) {
    var it = items[i];
    var title = (it.getTitle() || '').toLowerCase();
    var type = it.getType();

    if (type === FormApp.ItemType.TEXT) {
      if (!idItems.name && title.indexOf('nama') !== -1) idItems.name = it.getId();
      else if (!idItems.absen && title.indexOf('absen') !== -1) idItems.absen = it.getId();
      else if (!idItems.kelas && title.indexOf('kelas') !== -1) idItems.kelas = it.getId();
    }
    if (isQuiz) {
      var pts = itemPoints(it);
      maxScore += pts;
      if (pts > 0) itemMeta.push(describeItem(it, pts));
    }
  }

  var responses = sinceMs ? form.getResponses(new Date(Number(sinceMs))) : form.getResponses();
  // Per halaman agar tidak melewati batas waktu Apps Script / web untuk ribuan respons
  var total = responses.length;
  var offset = Math.max(0, parseInt(offsetParam, 10) || 0);
  var limit = Math.min(1000, Math.max(1, parseInt(limitParam, 10) || 500));
  var end = Math.min(total, offset + limit);
  var rows = [];
  for (var r = offset; r < end; r++) {
    var resp = responses[r];
    var row = {
      id: resp.getId(),
      submitted_at: resp.getTimestamp().toISOString(),
      email: resp.getRespondentEmail() || null,
      name: null, absen: null, kelas: null,
      score: null
    };

    var answers = resp.getItemResponses();
    for (var a = 0; a < answers.length; a++) {
      var itemId = answers[a].getItem().getId();
      var val = String(answers[a].getResponse() || '');
      if (itemId === idItems.name) row.name = val;
      else if (itemId === idItems.absen) row.absen = val;
      else if (itemId === idItems.kelas) row.kelas = val;
    }

    if (isQuiz) {
      var score = 0;
      var graded = resp.getGradableItemResponses();
      row.answers = {};
      for (var g = 0; g < graded.length; g++) {
        var gScore = Number(graded[g].getScore() || 0);
        score += gScore;
        var raw = graded[g].getResponse();
        row.answers[String(graded[g].getItem().getId())] = {
          r: Array.isArray(raw) ? raw.join(' | ') : (raw === null || raw === undefined ? '' : String(raw)),
          s: gScore
        };
      }
      row.score = score;
    }
    rows.push(row);
  }

  return {
    status: 'success',
    version: SCRIPT_VERSION,
    form_id: form.getId(),
    title: form.getTitle(),
    is_quiz: isQuiz,
    max_score: isQuiz ? maxScore : null,
    items: offset === 0 ? itemMeta : [],
    total: total,
    offset: offset,
    has_more: end < total,
    next_offset: end < total ? end : null,
    accepting_responses: form.isAcceptingResponses(),
    responses: rows
  };
}

function itemPoints(it) {
  var T = FormApp.ItemType;
  switch (it.getType()) {
    case T.MULTIPLE_CHOICE: return it.asMultipleChoiceItem().getPoints();
    case T.CHECKBOX: return it.asCheckboxItem().getPoints();
    case T.LIST: return it.asListItem().getPoints();
    case T.TEXT: return it.asTextItem().getPoints();
    case T.PARAGRAPH_TEXT: return it.asParagraphTextItem().getPoints();
    case T.SCALE: return it.asScaleItem().getPoints();
    case T.DATE: return it.asDateItem().getPoints();
    case T.TIME: return it.asTimeItem().getPoints();
    case T.DATETIME: return it.asDateTimeItem().getPoints();
    case T.DURATION: return it.asDurationItem().getPoints();
    case T.GRID: return it.asGridItem().getPoints();
    case T.CHECKBOX_GRID: return it.asCheckboxGridItem().getPoints();
    default: return 0;
  }
}

/** Metadata soal untuk analisis butir: judul, poin, pilihan & kunci jawaban. */
function describeItem(it, points) {
  var T = FormApp.ItemType;
  var meta = { id: String(it.getId()), title: it.getTitle(), type: String(it.getType()), points: points, choices: [] };
  var choices = null;
  if (it.getType() === T.MULTIPLE_CHOICE) choices = it.asMultipleChoiceItem().getChoices();
  else if (it.getType() === T.CHECKBOX) choices = it.asCheckboxItem().getChoices();
  else if (it.getType() === T.LIST) choices = it.asListItem().getChoices();
  if (choices) {
    for (var c = 0; c < choices.length; c++) {
      meta.choices.push({ value: choices[c].getValue(), correct: choices[c].isCorrectAnswer() });
    }
  }
  return meta;
}

/**
 * Acak urutan soal (FormApp) dan, jika layanan "Google Forms API" diaktifkan,
 * acak urutan pilihan jawaban setiap soal pilihan ganda.
 */
function applyShuffle(form, shuffleQuestions, shuffleOptions) {
  var result = { questions: shuffleQuestions, options: false, message: '' };
  form.setShuffleQuestions(shuffleQuestions);

  if (typeof Forms === 'undefined') {
    result.message = shuffleOptions ? 'Layanan "Google Forms API" belum diaktifkan di Apps Script, pilihan jawaban tidak diacak.' : '';
    return result;
  }

  try {
    var full = Forms.Form.get(form.getId());
    var requests = [];
    (full.items || []).forEach(function (item, index) {
      var q = item.questionItem && item.questionItem.question;
      if (q && q.choiceQuestion) {
        requests.push({ updateItem: {
          item: { questionItem: { question: { choiceQuestion: { shuffle: shuffleOptions } } } },
          location: { index: index },
          updateMask: 'questionItem.question.choiceQuestion.shuffle'
        } });
      }
    });
    if (requests.length) Forms.Form.batchUpdate({ requests: requests }, form.getId());
    result.options = shuffleOptions;
  } catch (err) {
    result.message = 'Gagal mengatur acak pilihan: ' + err;
  }
  return result;
}

/**
 * Untuk form yang di-import manual (hanya punya link publik /forms/d/e/PID/viewform):
 * cari form di Google Drive akun ini yang link publiknya cocok.
 */
function findFormByPublishedId(publishedId) {
  if (!publishedId) return { status: 'error', message: 'published_id wajib diisi', version: SCRIPT_VERSION };

  var files = DriveApp.getFilesByType(MimeType.GOOGLE_FORMS);
  var checked = 0;
  while (files.hasNext() && checked < 500) {
    var file = files.next();
    checked++;
    try {
      var f = FormApp.openById(file.getId());
      if ((f.getPublishedUrl() || '').indexOf(publishedId) !== -1) {
        return { status: 'success', version: SCRIPT_VERSION, form_id: f.getId(), title: f.getTitle(), is_quiz: f.isQuiz() };
      }
    } catch (err) {
      // Lewati form yang tidak bisa dibuka
    }
  }
  return { status: 'error', code: 'not_found', message: 'Form tidak ditemukan di Google Drive akun ini (dicek ' + checked + ' form).', version: SCRIPT_VERSION };
}
`;
