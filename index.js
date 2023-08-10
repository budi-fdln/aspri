const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fse = require('fs-extra');
const fs = require('fs');
const tanya = require('./tanya');
const salam = require('./salam');
const perintah = require('./perintah');
const label = require('./caption');
const pertanyaan = require('./pertanyaan');
const clear = require('clear');
const Redis = require('ioredis');

// Konfigurasi WhatsApp Web
const config = require('./config.json');
const SESSION_FILE_PATH = './session.json';

const redisClient = new Redis(); // Inisialisasi klien Redis


let sessionData;
if (fse.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);}

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
    headless: true,
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
    ],
    },
    session: sessionData,
    restartOnAuthFail: true,
    takeoverOnConflict: true,
    qrTimeoutMs: 0, // Infinite QR code scanning timeout
    authTimeout: 60000,
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });});

client.on('authenticated', (session) => {
    console.log('WhatsApp bot berhasil terhubung');});

client.on('auth_failure', (error) => {
    console.error('Error autentikasi:', error.message);});

client.on('ready', () => {
    console.log('WhatsApp bot siap untuk menerima pesan!');}
);

const { menu, daftarsurat } = require('./menu.js');

// Fungsi untuk membaca daftar menu dari file menu.txt dan memberikan nomor
function tambpilkanMenu() {
    let response = "Menu Utama:\n";
        menu.forEach((item) => {
        response += item + '\n';
        });
        response += '\nSilahkan masukan pilihan anda dengan mengetikan nomor atau satu kata kunci dari menu seperti contoh "surat" atau "laporan"'
    return response;
}

function tampilkanSurat() {
    let response = "Menu Pembuatan Surat:\n";
        daftarsurat.forEach((item) => {
        response += item + '\n';
        });
        response += '\nSilahkan masukan pilihan anda dengan mengetikan nomor atau satu kata kunci dari menu seperti contoh "SKTM" atau "SKU"'
    return response;
}

const menuresponse = tambpilkanMenu();
const suratresponse = tampilkanSurat();



client.on('message', async (msg) => {
    try {
        if (msg.body.toLowerCase() === 'menu' || msg.body.toLowerCase() === 'help') {
            // Munculkan daftar menu sebagai respons
            sendMessage(msg.from, menuresponse);
            kosongkan(msg.from);
            isimenu(msg.from);
            return;
        } else {

            var pesan ={};
            //clear();
            await semuadata(msg.from);
            const userKey = msg.from; // Gunakan nomor HP sebagai kunci unik
            const userDataExists = await redisClient.exists(userKey);
            const userData = await redisClient.hgetall(userKey);
            if (userDataExists) {
                const userData = await redisClient.hgetall(userKey);
                pesan ='definisi ada';
                if (msg.body.toLowerCase() === 'keluar'){
                    kosongkan(msg.from);
                    pesan = ' dihapus';
                    sendMessage(msg.from, 'dihapus');
                } else if (userData.perihal === ''){
                    pesan = ' perihal masih kosong';
                    let nomor = msg.body;
                    if (isNaN(nomor)) {
                        // Pilihan adalah teks
                        if (msg.body.toLowerCase() === 'surat'){
                            sendMessage(msg.from, suratresponse);
                        } else if (perintah.perintah.includes(msg.body.toLowerCase())){
                            //jika perintah ada maka
                            await simpan(msg.from, 'perihal', msg.body.toLowerCase());
                            await simpan(msg.from, 'terakhir', 0);
                            const perintahResponse = perintah.handleperintah(msg.body.toLowerCase(), msg.from);
                            sendMessage(msg.from, perintahResponse);
                            const sindex = await satudata(msg.from,'terakhir');
                            await ajukanPertanyaan(msg.body.toLowerCase(), sindex, msg.from);
                        } else if (perintah.surat.includes(msg.body.toLowerCase())){
                                //jika ada dalam daftar surat
                                const suratResponse = perintah.handlesurat(msg.body.toLowerCase());
                                await simpan(msg.from, 'perihal', suratResponse.response);
                                await simpan(msg.from, 'terakhir', 0);
                                await simpan(msg.from, 'media', suratResponse.jumlah);
                                console.log(perintah.surat.includes(msg.body.toLowerCase()) + ' ' +suratResponse.jumlah + ' ' + suratResponse.response);
                                const sindex = await satudata(msg.from,'terakhir');
                                await ajukanPertanyaan(msg.body.toLowerCase(), sindex, msg.from);
                        } else {
                                sendMessage(msg.from, 'perintah tidak ada silahkan ulangi lagi');
                        }
                    } else {
                        // Pilihan adalah angka
                        nomor = parseInt(nomor);
                        if (nomor > 0 && nomor < 10) {
                            if (nomor === 1){
                                sendMessage(msg.from, suratresponse);

                            } else if (nomor === 2){
                                await simpan(msg.from, 'perihal', 'pengaduan');
                                await simpan(msg.from, 'media', 1);
                                await simpan(msg.from, 'terakhir', 0);
                                sendMessage(msg.from, 'Pengaduan apa yang ingin anda buat\nSilahkan ketik balas dengan \"keluar" jika anda ingin membatalkan');
                                await ajukanPertanyaan('pengaduan', 0, msg.from);

                            } else if (nomor === 3){
                                await simpan(msg.from, 'perihal', 'laporan');
                                await simpan(msg.from, 'media', 1);
                                await simpan(msg.from, 'terakhir', 0);
                                sendMessage(msg.from, 'Ada kejadian darurat apa yang ingin anda laporkan\nSilahkan ketik balas dengan \"keluar" jika anda ingin membatalkan');
                                await ajukanPertanyaan('laporan', 0, msg.from);

                            } else if (nomor === 4){
                                await simpan(msg.from, 'perihal', 'masukan');
                                await simpan(msg.from, 'media', 0);
                                await simpan(msg.from, 'terakhir', 0);
                                sendMessage(msg.from, 'Masukan anda sangat berarti dalam memajukan pelayanan desa, silahkan isi saran dan masukan anda\nSilahkan ketik balas dengan \"keluar" jika anda ingin membatalkan');
                                await ajukanPertanyaan('masukan', 0, msg.from);
                                
                            } else if (nomor === 5){
                                sendMessage(msg.from, 'Fitur permohonan bantuan akan segera hadir');
                            } else if (nomor === 6){
                                sendMessage(msg.from, 'Berikut informasi pulbik desa ....... ');
                            } else if (nomor === 7){
                                sendMessage(msg.from, 'Berikut informasi layanan darurat bagi warga desa ....... ');
                            } else if (nomor === 8){
                                sendMessage(msg.from, 'Berikut informasi Layanan publik terdekat ....... \nNomor Polisi +62262466110\nNomor PLN +62262466011');
                            } else if (nomor === 9){
                                sendMessage(msg.from, 'Silahkan anda bertanya tentang pemerintahan desa, pertanian, perikanan dan peternakan')
                            }
                        } else if (nomor >= 10 && nomor <= 28 ) {
                            const suratResponse = perintah.handlesurat(msg.body);
                            await simpan(msg.from, 'perihal', suratResponse.response);
                            await simpan(msg.from, 'media', suratResponse.jumlah);
                            await simpan(msg.from, 'terakhir', 0);
                            const sindex = await satudata(msg.from,'terakhir');
                            sendMessage(msg.from, 'Anda memilih untuk membuat surat ' + suratResponse.response + ' silahkan isi data persyaratan pembuatan surat\nSilahkan ketik balas dengan \"keluar" jika anda ingin membatalkan');
                            await ajukanPertanyaan(suratResponse.response, sindex, msg.from);
                        } else if (nomor > 28) {
                            sendMessage(msg.from, 'Mohon maaf pilihan anda tidak ada silahkan diulangi kembali');
                        }
                    }
                } else {
                    const cekk = await satudata(msg.from,'perihal');
                    const cek = cekk.toLowerCase();
                    //clear();
                    var isifoto = 0;
                    if ( perintah.perintah.includes(cek) ){
                        if (cek === 'saran' || cek === 'masukan'){
                            isifoto = 0;
                        } else {
                            isifoto = 1;
                        }
                    } else if ( perintah.surat.includes(cek) ){
                        const jlhmedia = await satudata(msg.from, 'media')
                        const jlmedia = parseInt(jlhmedia);
                        isifoto = jlmedia;
                    }
                    console.log('isifoto ' +await satudata(msg.from, 'media'));
                    const terakhir = parseInt(await satudata(msg.from,'terakhir'));
                    const isi = 'ket'+terakhir
                    const jlhpertanyaan = pertanyaan[cek].length;
                    const sindex = parseInt(await satudata(msg.from,'terakhir')) + 1;
                    const perihal = await satudata(msg.from,'perihal');
                    const akhir = terakhir+1;
                    if (terakhir +1 > jlhpertanyaan - isifoto ){
                        if(msg.hasMedia) {
                            //await simpan(msg.from,isi,media);
                            //userData[isi] = media;
                            
                            if (terakhir +1 >= jlhpertanyaan){
                                let hasil = "Berikut ringkasan yang anda kirimkan :\nPerihal : " + await satudata(msg.from,'perihal');
                                for (let i=0;i<jlhpertanyaan-isifoto;i++){
                                    let isiket = 'ket'+i;
                                    const labelResult = await isilabel(await satudata(msg.from,'perihal'), i);
                                    hasil = hasil +'\n'+labelResult+await satudata(msg.from, isiket) ;
                                }
                                sendMessage('6281286980493@c.us', msg.from + '\n' + hasil);
                                sendMessage(msg.from, hasil);
                                //menangani media
                                const downmedia = await msg.downloadMedia();
                                const base64data= downmedia.data;
                                const mime = downmedia.mimetype
                                simpan(msg.from, isi, base64data);
                                simpan(msg.from, isi+'mime', mime);
                                if (isifoto === 1) {
                                    console.log(terakhir);
                                    const mediaData = await redisClient.hget(msg.from, isi); // Get the media data from Redis
                                    const kirimmime = await redisClient.hget(msg.from, isi+'mime'); // Parse the stored data back to an object
                                    const mediaMessage = new MessageMedia(kirimmime, mediaData); // Create a new MessageMedia object
                                    const labelResult = await isilabel(await satudata(msg.from,'perihal'), terakhir);
                                    await client.sendMessage('6281286980493@c.us', mediaMessage, { caption: labelResult });
                                    await client.sendMessage(msg.from, mediaMessage, { caption: labelResult });
                                } else {
                                    for (i = jlhpertanyaan -isifoto ; i<jlhpertanyaan ; i++){
                                        let km = 'ket'+i
                                        const mediaData = await redisClient.hget(msg.from, km); // Get the media data from Redis
                                        const kirimmime = await redisClient.hget(msg.from, km+'mime'); // Parse the stored data back to an object
                                        const mediaMessage = new MessageMedia(kirimmime, mediaData); // Create a new MessageMedia object
                                        const labelResult = await isilabel(await satudata(msg.from,'perihal'), i);
                                        await client.sendMessage('6281286980493@c.us', mediaMessage, { caption: labelResult });
                                        await client.sendMessage(msg.from, mediaMessage, { caption: labelResult });
                                    }
                                }
                                sendMessage(msg.from, 'Terima kasih, kami akan segera menghubungi anda');
                                kosongkan(msg.from);
                            } else {
                                const downmedia = await msg.downloadMedia();
                                const base64data= downmedia.data;
                                const mime = downmedia.mimetype
                                await simpan(msg.from, isi, base64data);
                                await simpan(msg.from, isi+'mime', mime);
                                await simpan(msg.from, 'terakhir', akhir);
                                await ajukanPertanyaan(perihal.toLowerCase(), sindex, msg.from);
                            }
                        } else {
                            sendMessage(msg.from,'Silahkan masukan foto atau dokumen');
                        }
                    } else {
                            await simpan(msg.from, isi, msg.body);
                            await simpan(msg.from, 'terakhir', akhir);
                            await ajukanPertanyaan(perihal.toLowerCase(), sindex, msg.from);
                    }
                }
            } else {
                pesan ='definisi tidak ada';
                if (msg.body.toLowerCase() === 'keluar') {
                    sendMessage(msg.from,'Data anda di hapus');
                } else if (salam.greetings.includes(msg.body.toLowerCase())) {
                    // Jika pesan merupakan salam, berikan respons salam
                    //const greetings = ['hi', 'hallo', 'assalamualaikum', 'assalamu\'alaikum', 'asalamualaikum', 'asalamu\'alaikum', 'salam'];
                    const greetingResponse = salam.handleGreetingRequest(msg.body);
                    sendMessage(msg.from, greetingResponse + '\nSilahkan balas dengan Menu / Help untuk bantuan \natau anda bisa langsung menanyakan apapun yang berkaitan dengan Pemerintahan desa, pertanian, peternakan dan perikanan \nterima kasih');;
                    return;
                } else if (perintah.perintah.includes(msg.body.toLowerCase())) {
                    const perintahResponse = perintah.handleperintah(msg.body);
                    const cek = msg.body.toLowerCase();
                    if (cek === 'surat' || cek === 'buat surat' || cek === 'bikin surat' || cek === 'minta surat' || cek === 'permohonan surat' || cek === 'pengajuan surat' || cek === 'permintaan surat'){
                        isimenu(msg.from);
                        sendMessage(msg.from, suratresponse + '\n\nSilahkan pilih salah satu surat yang ingin anda buat')
                    } else {
                        isimenu(msg.from);
                        await simpan(msg.from, 'perihal', msg.body);
                        await simpan(msg.from, 'terakhir', 0);
                        const sindex = await satudata(msg.from,'terakhir');
                        await ajukanPertanyaan(msg.body.toLowerCase(), sindex, msg.from);
                        return;
                    }
                    
                } else {
                    pesan = pesan + ' diai';
                    const response = await tanya.getOpenAIResponse(msg.body); // Kirim pesan ke OpenAI API
                    sendMessage(msg.from, response +"\n\nSemoga bermanfaat dan jangan ragu untuk bertanya\nSalam Desa Situ Gede Juara"); // Kirim balasan dari OpenAI ke pengirim pesan
                    // ...
                }
                
            }
            
        }

    } catch (error) {
        console.error('Error sending message:', error);
    }
    console.log(msg.body);
});

// Fungsi untuk mengosongkan data pengguna dalam Redis
async function kosongkan(dari) {
    await redisClient.del(dari);
}

// Fungsi untuk mengisi data pengguna pada Redis saat memulai
async function isimenu(dari) {
    const objmenu = {
        menu: 'menu', perihal: '',ket0: '',ket1: '',ket2: '',ket3: '',ket4: '',ket5: '',ket6: '',
        ket7: '',ket8: '',ket9: '',ket10: '',ket11: '',ket12: '',terakhir: '',dari: dari,
    };
    await redisClient.hmset(dari, objmenu);
}

async function ajukanPertanyaan(topik, index, dari) {
    const arrPertanyaan = pertanyaan[topik];
    const pertanyaanText = arrPertanyaan[index];
    sendMessage(dari, pertanyaanText);
}

async function isilabel(topik, index) {
    const arrlabel = label[topik];
    const labelText = arrlabel[index];
    return labelText;
}

async function sendMessage(phoneNumber, message) {
    try {
      // Send a message to the specified phone number
        const result = await client.sendMessage(phoneNumber, message);
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

async function simpan(dari, kunci, isi) {
    try {
        await redisClient.hset(dari, kunci, isi);
    } catch (err) {
        console.error('Error:', err);
    }
}

async function satudata(key, field) {
    try {
      // Use hget command to get the value of a specific field from the hash
        const value = await redisClient.hget(key, field);
        return value;
    } catch (err) {
        console.error('Error:', err);
    }
}

async function semuadata(key) {
    try {
        const data = await redisClient.hgetall(key);
        console.log(`semua data ${key}:`, data);
    }catch (err) {
        console.error('Error:', err);
    }
}
client.initialize();
