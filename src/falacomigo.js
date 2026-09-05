// FalaComigo — comunicação assistiva (AAC) integrada ao SchuleZap.
// Cartões e frases vindos do app FalaComigo (jacksontomelin/FALOAPP).
// O aluno toca, o app fala em voz alta e avisa a coordenação.

export const CATEGORIAS = [
{
"id": "sos",
"e": "🆘",
"n": "Urgente"
},
{
"id": "sentimento",
"e": "😊",
"n": "Como Estou"
},
{
"id": "sensorial",
"e": "🔇",
"n": "Sensorial"
},
{
"id": "regulacao",
"e": "🧸",
"n": "Preciso"
},
{
"id": "dor",
"e": "🩹",
"n": "Dói Aqui"
},
{
"id": "comida",
"e": "🍕",
"n": "Comida"
},
{
"id": "bebida",
"e": "🥤",
"n": "Bebida"
},
{
"id": "corpo",
"e": "🚿",
"n": "Corpo"
},
{
"id": "atividade",
"e": "⚽",
"n": "Atividade"
},
{
"id": "social",
"e": "💬",
"n": "Social"
},
{
"id": "lugar",
"e": "🏠",
"n": "Lugar"
},
{
"id": "pessoa",
"e": "👨‍👩‍👧",
"n": "Pessoa"
}
];

export const CARTOES = {
"sos": [
{
"id": "socorro",
"n": "SOCORRO",
"f": "Eu preciso de ajuda agora!",
"sos": true
},
{
"id": "demais",
"n": "Tá demais",
"f": "Está tudo demais para mim! Estou sobrecarregado!",
"sos": true
},
{
"id": "sair",
"n": "Quero sair",
"f": "Eu preciso sair daqui agora!",
"sos": true
},
{
"id": "perdido",
"n": "Estou perdido",
"f": "Eu estou perdido! Preciso de ajuda!",
"sos": true
},
{
"id": "parar",
"n": "PARA",
"f": "Para! Eu não aguento mais!",
"sos": true
},
{
"id": "dor",
"n": "Com dor",
"f": "Eu estou com dor!",
"sos": true
},
{
"id": "medo",
"n": "Com medo",
"f": "Eu estou com muito medo!",
"sos": true
},
{
"id": "naoentendo",
"n": "Não entendo",
"f": "Eu não estou entendendo! Me ajuda!",
"sos": true
}
],
"sentimento": [
{
"id": "calmo",
"n": "Calmo",
"f": "Eu estou calmo"
},
{
"id": "feliz",
"n": "Feliz",
"f": "Eu estou feliz"
},
{
"id": "amor",
"n": "Te amo",
"f": "Eu te amo"
},
{
"id": "triste",
"n": "Triste",
"f": "Eu estou triste"
},
{
"id": "bravo",
"n": "Bravo",
"f": "Eu estou bravo"
},
{
"id": "medo",
"n": "Com medo",
"f": "Eu estou com medo"
},
{
"id": "cansado",
"n": "Cansado",
"f": "Eu estou cansado"
},
{
"id": "ansioso",
"n": "Ansioso",
"f": "Eu estou ansioso"
},
{
"id": "dor",
"n": "Com dor",
"f": "Eu estou com dor"
}
],
"sensorial": [
{
"id": "barulho",
"n": "Muito barulho",
"f": "Está com muito barulho! Eu não aguento!",
"sos": true
},
{
"id": "luz",
"n": "Muita luz",
"f": "Está com muita luz! Me incomoda!",
"sos": true
},
{
"id": "toque",
"n": "Não toca",
"f": "Não me toca por favor!",
"sos": true
},
{
"id": "cheiro",
"n": "Cheiro ruim",
"f": "O cheiro está me incomodando!"
},
{
"id": "apertado",
"n": "Apertado",
"f": "A roupa está me incomodando! Está apertada!"
},
{
"id": "demais",
"n": "Tá demais",
"f": "Tem estímulo demais! Estou sobrecarregado!",
"sos": true
},
{
"id": "calmo",
"n": "Tá bom",
"f": "Agora está bom. Estou bem."
}
],
"regulacao": [
{
"id": "fone",
"n": "Fone",
"f": "Eu preciso do meu fone de ouvido"
},
{
"id": "cobertor",
"n": "Cobertor",
"f": "Eu preciso do meu cobertor pesado"
},
{
"id": "cantocalma",
"n": "Canto calmo",
"f": "Eu preciso ir para o meu cantinho de calma"
},
{
"id": "pausa",
"n": "Pausa",
"f": "Eu preciso de uma pausa agora"
},
{
"id": "abraco",
"n": "Abraço",
"f": "Eu quero um abraço"
},
{
"id": "fidget",
"n": "Fidget",
"f": "Eu preciso do meu brinquedo de apertar"
},
{
"id": "balanco",
"n": "Balanço",
"f": "Eu quero balançar"
},
{
"id": "agua",
"n": "Água",
"f": "Eu preciso beber água"
},
{
"id": "dormir",
"n": "Descansar",
"f": "Eu preciso descansar"
}
],
"dor": [
{
"id": "dorcabeca",
"n": "Cabeça",
"f": "Minha cabeça está doendo!",
"sos": true
},
{
"id": "dorbarriga",
"n": "Barriga",
"f": "Minha barriga está doendo!",
"sos": true
},
{
"id": "dorouvido",
"n": "Ouvido",
"f": "Meu ouvido está doendo!",
"sos": true
},
{
"id": "dordente",
"n": "Dente",
"f": "Meu dente está doendo!",
"sos": true
},
{
"id": "dorperna",
"n": "Perna",
"f": "Minha perna está doendo!"
},
{
"id": "dorbraco",
"n": "Braço",
"f": "Meu braço está doendo!"
},
{
"id": "frio",
"n": "Com frio",
"f": "Eu estou com frio"
},
{
"id": "calor",
"n": "Com calor",
"f": "Eu estou com calor"
},
{
"id": "coceira",
"n": "Coceira",
"f": "Eu estou com coceira"
}
],
"comida": [
{
"id": "pizza",
"n": "Pizza",
"f": "Eu quero pizza"
},
{
"id": "arroz",
"n": "Arroz",
"f": "Eu quero arroz"
},
{
"id": "feijao",
"n": "Feijão",
"f": "Eu quero feijão"
},
{
"id": "carne",
"n": "Carne",
"f": "Eu quero carne"
},
{
"id": "frango",
"n": "Frango",
"f": "Eu quero frango"
},
{
"id": "macarrao",
"n": "Macarrão",
"f": "Eu quero macarrão"
},
{
"id": "pao",
"n": "Pão",
"f": "Eu quero pão"
},
{
"id": "banana",
"n": "Banana",
"f": "Eu quero banana"
},
{
"id": "maca",
"n": "Maçã",
"f": "Eu quero maçã"
},
{
"id": "biscoito",
"n": "Biscoito",
"f": "Eu quero biscoito"
},
{
"id": "bolo",
"n": "Bolo",
"f": "Eu quero bolo"
},
{
"id": "ovo",
"n": "Ovo",
"f": "Eu quero ovo"
}
],
"bebida": [
{
"id": "agua",
"n": "Água",
"f": "Eu quero água"
},
{
"id": "suco",
"n": "Suco",
"f": "Eu quero suco"
},
{
"id": "leite",
"n": "Leite",
"f": "Eu quero leite"
},
{
"id": "refri",
"n": "Refrigerante",
"f": "Eu quero refrigerante"
},
{
"id": "cha",
"n": "Chá",
"f": "Eu quero chá"
},
{
"id": "iogurte",
"n": "Iogurte",
"f": "Eu quero iogurte"
}
],
"corpo": [
{
"id": "banheiro",
"n": "Banheiro",
"f": "Eu quero ir ao banheiro"
},
{
"id": "banho",
"n": "Banho",
"f": "Eu quero tomar banho"
},
{
"id": "trocar",
"n": "Trocar roupa",
"f": "Eu quero trocar de roupa"
},
{
"id": "dente",
"n": "Escovar dente",
"f": "Eu quero escovar os dentes"
},
{
"id": "remedio",
"n": "Remédio",
"f": "Eu preciso de remédio"
}
],
"atividade": [
{
"id": "brincar",
"n": "Brincar",
"f": "Eu quero brincar"
},
{
"id": "tv",
"n": "Assistir TV",
"f": "Eu quero assistir TV"
},
{
"id": "musica",
"n": "Música",
"f": "Eu quero ouvir música"
},
{
"id": "desenhar",
"n": "Desenhar",
"f": "Eu quero desenhar"
},
{
"id": "tablet",
"n": "Tablet",
"f": "Eu quero usar o tablet"
},
{
"id": "parque",
"n": "Parque",
"f": "Eu quero ir ao parque"
},
{
"id": "dormir",
"n": "Dormir",
"f": "Eu quero dormir"
},
{
"id": "ler",
"n": "Ler",
"f": "Eu quero ler"
},
{
"id": "passear",
"n": "Passear",
"f": "Eu quero passear"
}
],
"social": [
{
"id": "querojogar",
"n": "Quero brincar",
"f": "Eu quero brincar com você!"
},
{
"id": "sim",
"n": "Sim",
"f": "Sim!"
},
{
"id": "nao",
"n": "Não",
"f": "Não!"
},
{
"id": "espera",
"n": "Espera",
"f": "Espera um pouco por favor"
},
{
"id": "naoentendo",
"n": "Não entendi",
"f": "Eu não entendi. Fala de novo?"
},
{
"id": "repete",
"n": "Repete",
"f": "Pode repetir por favor?"
},
{
"id": "obrigado",
"n": "Obrigado",
"f": "Obrigado!"
},
{
"id": "tchau",
"n": "Tchau",
"f": "Tchau! Até mais!"
},
{
"id": "parar",
"n": "Para",
"f": "Para por favor! Eu não gosto!"
}
],
"lugar": [
{
"id": "casa",
"n": "Casa",
"f": "Eu quero ir para casa"
},
{
"id": "escola",
"n": "Escola",
"f": "Eu quero ir para escola"
},
{
"id": "medico",
"n": "Médico",
"f": "Eu preciso ir ao médico"
},
{
"id": "mercado",
"n": "Mercado",
"f": "Eu quero ir ao mercado"
},
{
"id": "praia",
"n": "Praia",
"f": "Eu quero ir à praia"
},
{
"id": "carro",
"n": "Carro",
"f": "Eu quero andar de carro"
}
],
"pessoa": [
{
"id": "mamae",
"n": "Mamãe",
"f": "Eu quero a mamãe"
},
{
"id": "papai",
"n": "Papai",
"f": "Eu quero o papai"
},
{
"id": "vovo",
"n": "Vovó",
"f": "Eu quero a vovó"
},
{
"id": "amigo",
"n": "Amigo",
"f": "Eu quero meu amigo"
},
{
"id": "professor",
"n": "Professor",
"f": "Eu quero o professor"
},
{
"id": "ajuda",
"n": "Ajuda",
"f": "Eu preciso de ajuda"
}
]
};

// fala em voz alta usando a voz do próprio aparelho
export function falar(frase, { velocidade = 0.9 } = {}) {
  try {
    if (!("speechSynthesis" in window)) return false;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(frase);
    u.lang = "pt-BR";
    u.rate = velocidade;
    u.pitch = 1;
    const vozes = window.speechSynthesis.getVoices();
    const pt = vozes.find((v) => v.lang && v.lang.toLowerCase().startsWith("pt"));
    if (pt) u.voice = pt;
    window.speechSynthesis.speak(u);
    return true;
  } catch (e) {
    return false;
  }
}
