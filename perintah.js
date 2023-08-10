var userdata = ('./index.js');

const perintah = [
    'aduan',
    'pengaduan',
    'keluhan',
    'laporan',
    'lapor',
    'saran',
    'masukan',
    'surat',
    'buat surat',
    'bikin surat',
    'minta surat',
    'permohonan surat',
    'pengajuan surat',
    'permintaan surat',
    'info',
    'informasi',
    'bantu',
    'bantuan',
    'minta bantuan',
    'butuh bantuan',
    'tolong dibantu',
    'perlu bantuan',
    'tanya',
    'mau tanya',
    'mau bertanya',
    'punya pertanyaan'
];

const surat = [
    'skd',
    'sku',
    'kelahiran',
    'kematian',
    'tanah',
    'sktm',
    'pernyataan',
    'nikah',
    'na',
    'beasiswa',
    'skck',
    'imb',
    'siup',
    'ktp',
    'penghasilan',
    'bansos',
    'pengantar',
    'paspor'
];

// Fungsi untuk menangani permintaan pengguna ketika menyapa dengan berbagai salam
function handleperintah(perintahs) {
    const ucapan = [
        { input: 'aduan', response: 'Kami siap menerima pengaduan anda, Silahkan lengkapi data diri terlebih dahulu' },
        { input: 'pengaduan', response: 'kami siap menerima pengaduan anda, Silahkan lengkapi data diri anda terlebih dahulu' },
        { input: 'keluhan', response: 'Perihal apa yang ingin anda keluhkan, silahkan lengkapi data anda' },
        { input: 'laporan', response: 'Kami siap menerima laporan anda, silahkan isi data terlebih dahulu' },
        { input: 'lapor', response: 'apa yang ingin anda laporkan, silahkan isi data terlebi dahulu' },
        { input: 'saran', response: 'Kami siap menerima saran dari anda, silahkan isi data terlebi dahulu' },
        { input: 'masukan', response: 'Kami siap menerima masukan dari anda, silahkan isi data terlebi dahulu' },
        
        { input: 'surat', response: 'Berikut daftar surat yang bisa anda buat' },
        { input: 'buat surat', response: 'Surat apa yang ingin anda buat' },
        { input: 'bikin surat', response: 'Surat apa yang ingin anda buat' },
        { input: 'minta surat', response: 'Berikut daftar surat yang bisa anda buat' },
        { input: 'permohonan surat', response: 'Berikut daftar surat yang bisa anda buat' },
        { input: 'pengajuan surat', response: 'Berikut daftar surat yang bisa anda buat' },
        { input: 'permintaan surat', response: 'Berikut daftar surat yang bisa anda buat' },
        
        { input: 'info', response: 'Info apa yang ingin anda ketahui' },
        { input: 'informasi', response: 'informasi apa yang ingin anda dapatkan' },
        
        { input: 'bantu', response: 'Apa yang bisa kami bantu' },
        { input: 'bantuan', response: 'Apa yang bisa kami bantu' },
        { input: 'minta bantuan', response: 'Bantuan apa yang ingin anda minta' },
        { input: 'butuh bantuan', response: 'Apa yang anda butuhkan' },
        { input: 'tolong dibantu', response: 'Bantuan apa yang sekiranya bisa kita tolong' },
        { input: 'perlu bantuan', response: 'Anda perlu bantuan apa' },
        
        { input: 'tanya', response: 'Apa yang ingin anda tanyakan' },
        { input: 'mau tanya', response: 'Anda mau bertanya apa' },
        { input: 'mau bertanya', response: 'Aya yang ingin anda tanyakan' },
        { input: 'punya pertanyaan', response: 'Pertanyaan apa yang anda punya' }
    ];
    
    const cek = perintahs.toLowerCase()
    // Cari salam yang sesuai dengan yang diketahui oleh chatbot
    const matcheducapan = ucapan.find(item => item.input.toLowerCase() === cek);
    // Jika ada salam yang cocok, kembalikan responsnya, jika tidak, kembalikan respons default
    if (cek === 'aduan' || cek === 'pengaduan' || cek === 'keluhan' || cek === 'laporan' || cek === 'lapor' || cek === 'saran' || cek === 'masukan'){
        matcheducapan.response = matcheducapan.response;
    } else if (cek === 'surat' || cek === 'buat surat' || cek === 'bikin surat' || cek === 'minta surat' || cek === 'permohonan surat' || cek === 'pengajuan surat' || cek === 'permintaan surat'){
        matcheducapan.response = matcheducapan.response
    }
    return matcheducapan ? matcheducapan.response : 'Halo! Ada yang bisa saya bantu?';
}

function handlemenu(menu) {
    const nomenu = [
        { input: '1', response: 'Surat'},
        { input: '2', response: 'Pengaduan'},
        { input: '3', response: 'kejadian'},
        { input: '4', response: 'Masukan'},
        { input: '5', response: 'Bantuan'},
        { input: '6', response: 'Publik'},
        { input: '7', response: 'Darurat'},
        { input: '8', response: 'Layanan'},
        { input: '9', response: 'Pertanyaan Umum'},
    ];
    const cek = menu; // Convert input to lowercase for comparison
    const matchedmenu = nomenu.find(item => item.input === cek);

    if (matchedmenu) {
        const response = matchedmenu.response; // Access the 'response' property
        return { response }; // Return the response or do whatever you need with it
    } else {
        console.log('menu tidak ditemukan');
        return 'Menu tidak ditemukan'; // Return an appropriate response for when no match is found
    }
}
function handlesurat(surats) {
    const nosurat = [
        { input: '11', response: 'skd', jumlah: 3},
        { input: '12', response: 'sku', jumlah: 1 },
        { input: '13', response: 'kelahiran', jumlah: 4 },
        { input: '14', response: 'kematian', jumlah: 4 },
        { input: '15', response: 'tanah', jumlah: 3 },
        { input: '16', response: 'sktm', jumlah: 4 },
        { input: '17', response: 'pernyataan', jumlah: 2 },
        { input: '18', response: 'nikah', jumlah: 4 },
        { input: '19', response: 'na', jumlah: 4 },
        { input: '20', response: 'beasiswa', jumlah: 3 },
        { input: '21', response: 'skck', jumlah: 2 },
        { input: '22', response: 'imb', jumlah: 2 },
        { input: '23', response: 'siup', jumlah: 1 },
        { input: '24', response: 'ktp', jumlah: 2 },
        { input: '25', response: 'penghasilan', jumlah: 3 },
        { input: '26', response: 'bansos', jumlah: 2 },
        { input: '27', response: 'pengantar', jumlah: 2 },
        { input: '28', response: 'paspor', jumlah: 2 },

        { input: 'skd', response: 'skd', jumlah: 3},
        { input: 'sku', response: 'sku', jumlah: 1 },
        { input: 'kelahiran', response: 'kelahiran', jumlah: 4 },
        { input: 'kematian', response: 'kematian', jumlah: 4 },
        { input: 'tanah', response: 'tanah', jumlah: 3 },
        { input: 'sktm', response: 'sktm', jumlah: 4 },
        { input: 'pernyataan', response: 'pernyataan', jumlah: 2 },
        { input: 'nikah', response: 'nikah', jumlah: 4 },
        { input: 'na', response: 'na', jumlah: 4 },
        { input: 'beasiswa', response: 'beasiswa', jumlah: 3 },
        { input: 'skck', response: 'skck', jumlah: 2 },
        { input: 'imb', response: 'imb', jumlah: 2 },
        { input: 'siup', response: 'siup', jumlah: 1 },
        { input: 'ktp', response: 'ktp', jumlah: 2 },
        { input: 'penghasilan', response: 'penghasilan', jumlah: 3 },
        { input: 'bansos', response: 'bansos', jumlah: 2 },
        { input: 'pengantar', response: 'pengantar', jumlah: 2 },
        { input: 'paspor', response: 'paspor', jumlah: 2 }

    ];
    const cek = surats; // Convert input to lowercase for comparison
    const matchedsurat = nosurat.find(item => item.input === cek);

    if (matchedsurat) {
        const response = matchedsurat.response; // Access the 'response' property
        const jumlah = matchedsurat.jumlah;
        console.log(response + " " + jumlah);

        return { response, jumlah }; // Return the response or do whatever you need with it
    } else {
        console.log('Surat not found');
        return 'Surat not found'; // Return an appropriate response for when no match is found
    }
}

module.exports = {
    perintah,
    surat,
    handleperintah,
    handlesurat,
    handlemenu
}