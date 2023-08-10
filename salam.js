const greetings = [
    'hi',
    'halo',
    'hallo',
    'assalamualaikum',
    'assalamu\'alaikum',
    'asalamualaikum',
    'asalamu\'alaikum',
    'salam',
    'pagi',
    'siang',
    'sore',
    'malam',
    'p',
    'ass',
    'asslkum...',
    'test'
];

// Fungsi untuk menangani permintaan pengguna ketika menyapa dengan berbagai salam
function handleGreetingRequest(greeting) {
    const ucapan='Selamat datang di Asisten Desa, apa yang bisa saya bantu?'
    const greetings = [
        { input: 'hi', response: 'Halo!\n'+ ucapan },
        { input: 'halo', response: 'Hai!\n'+ ucapan },
        { input: 'hallo', response: 'Hai!\n'+ ucapan },
        { input: 'assalamu\'alaikum', response: 'Waalaikumsalam!\n'+ ucapan },
        { input: 'asalamualaikum', response: 'Waalaikumsalam!\n'+ ucapan },
        { input: 'asalamu\'alaikum', response: 'Waalaikumsalam!\n'+ ucapan },
        { input: 'salam', response: 'Waalaikumsalam!\n'+ ucapan },
        { input: 'assalamualaikum', response: 'Waalaikumsalam!\n'+ ucapan },
        { input: 'pagi', response: 'Pagi!\n'+ ucapan },
        { input: 'siang', response: 'Siang!\n'+ ucapan },
        { input: 'sore', response: 'Sore!\n'+ ucapan },
        { input: 'malam', response: 'Malam!\n'+ ucapan },
        { input: 'p', response: 'ya!\n'+ ucapan },
        { input: 'ass', response: 'Waalaikumsalam!\n'+ ucapan },
        { input: 'asslkum...', response: 'Waalaikumsalam!\n'+ ucapan },
        { input: 'test', response: 'Baik\n'+ ucapan },
    ];
    
    // Cari salam yang sesuai dengan yang diketahui oleh chatbot
    const matchedGreeting = greetings.find(item => item.input.toLowerCase() === greeting.toLowerCase());

    // Jika ada salam yang cocok, kembalikan responsnya, jika tidak, kembalikan respons default
    return matchedGreeting ? matchedGreeting.response : 'Halo! Ada yang bisa saya bantu?';
}


module.exports = {
    greetings,
    handleGreetingRequest,
}