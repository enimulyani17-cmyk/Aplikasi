import { QuestionItem } from '../types';

export interface GenerateParams {
  topic: string;
  gradeLevel: string;
  questionType: string;
  cognitiveLevel: string;
  optionsCount: number;
  indicator?: string;
  referenceText?: string;
  count: number;
}

export async function generateQuestionsApi(params: GenerateParams): Promise<{
  success: boolean;
  questions: QuestionItem[];
  source?: string;
}> {
  try {
    const res = await fetch('/api/generate-questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        return {
          success: true,
          questions: data.questions,
          source: data.source,
        };
      }
    }
  } catch (err) {
    console.warn('API call to /api/generate-questions had an error, using fallback client generator:', err);
  }

  // Client-side fallback generator if server is unavailable
  return {
    success: true,
    source: 'client_generator',
    questions: generateClientFallbackQuestions(params),
  };
}

function generateClientFallbackQuestions(params: GenerateParams): QuestionItem[] {
  const letters = ['A', 'B', 'C', 'D', 'E'].slice(0, Math.min(5, Math.max(2, params.optionsCount)));
  const bloomLevels = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'];
  const questions: QuestionItem[] = [];
  const topic = params.topic.trim() || 'Kerucut';

  for (let i = 1; i <= params.count; i++) {
    const cLevel = params.cognitiveLevel.includes('HOTS')
      ? ['C4', 'C5', 'C6'][i % 3]
      : params.cognitiveLevel.includes('MOTS')
      ? 'C3'
      : params.cognitiveLevel.includes('LOTS')
      ? ['C1', 'C2'][i % 2]
      : bloomLevels[(i - 1) % bloomLevels.length];

    let question = '';
    let explanation = '';
    let options: { key: string; text: string }[] = [];
    const correctKey = letters[(i - 1) % letters.length];

    if (topic.toLowerCase().includes('kerucut')) {
      const presets = [
        {
          q: 'Sebuah kerucut memiliki jari-jari alas 7 cm dan panjang garis pelukis 25 cm. Berapakah luas selimut kerucut tersebut? (π = 22/7)',
          ans: ['550 cm²', '525 cm²', '600 cm²', '350 cm²', '480 cm²'],
          exp: 'L = π × r × s = (22/7) × 7 × 25 = 550 cm².',
        },
        {
          q: 'Jika tinggi kerucut 12 cm dan jari-jari alasnya 5 cm, maka panjang garis pelukis kerucut adalah...',
          ans: ['13 cm', '15 cm', '17 cm', '10 cm', '14 cm'],
          exp: 's = √(r² + t²) = √(5² + 12²) = 13 cm.',
        },
        {
          q: 'Volume kerucut dengan diameter 14 cm dan tinggi 18 cm adalah... (π = 22/7)',
          ans: ['924 cm³', '880 cm³', '1.024 cm³', '616 cm³', '720 cm³'],
          exp: 'r = 7 cm. V = (1/3) × π × r² × t = (1/3) × (22/7) × 49 × 18 = 924 cm³.',
        },
        {
          q: 'Sebuah topi ulang tahun berbentuk kerucut memiliki diameter alas 20 cm dan garis pelukis 26 cm. Luas kertas karton minimal yang digunakan adalah... (π = 3,14)',
          ans: ['816,4 cm²', '753,6 cm²', '942 cm²', '628 cm²', '840 cm²'],
          exp: 'r = 10 cm. L selimut = 3,14 × 10 × 26 = 816,4 cm².',
        },
        {
          q: 'Hubungan yang tepat antara jari-jari kerucut (r), tinggi kerucut (t), dan garis pelukis (s) adalah...',
          ans: ['s² = r² + t²', 'r² = s² + t²', 't² = s² + r²', 's = r + t', 's² = r × t'],
          exp: 'Berdasarkan teorema Pythagoras segitiga siku-siku penampang kerucut, s² = r² + t².',
        },
      ];
      const cur = presets[(i - 1) % presets.length];
      question = cur.q;
      explanation = cur.exp;
      options = letters.map((k, idx) => ({ key: k, text: cur.ans[idx] || `Opsi ${k}` }));
    } else {
      question = `Pada materi "${topic}" (${params.gradeLevel}): Manakah simpulan analisis yang paling tepat dalam konteks capaian pembelajaran?`;
      if (params.indicator) {
        question += ` (Indikator: ${params.indicator})`;
      }
      explanation = `Konsep ini merupakan pilar esensial dalam penguasaan materi ${topic} untuk jenjang ${params.gradeLevel}.`;
      options = letters.map((k, idx) => ({
        key: k,
        text:
          idx === 0
            ? `Pernyataan komprehensif mengenai penerapan konsep utama ${topic} secara mendalam.`
            : `Pernyataan alternatif ${idx} yang hanya relevan pada sebagian parameter pengamatan ${topic}.`,
      }));
    }

    questions.push({
      number: i,
      question,
      options,
      correctAnswer: correctKey,
      cognitiveLevel: cLevel,
      explanation,
    });
  }

  return questions;
}
