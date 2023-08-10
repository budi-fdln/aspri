const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: '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',
});
const openai = new OpenAIApi(configuration);
const keyword='pertanian, peternakan, perikanan, administrasi desa';

// Fungsi untuk mendapatkan balasan dari OpenAI API
async function getOpenAIResponse(message) {
    try {
      // Gunakan OpenAI API untuk mendapatkan balasan berdasarkan pesan yang diterima
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: message}],
            max_tokens: 2048,
        });
      // Ambil balasan dari response dari OpenAI
        const reply = response.data.choices[0].message.content;
        return reply;
    } catch (error) {
        if (error.response && error.response.status === 503) {
        console.error('Error dari OpenAI API: Service Unavailable (503)');
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait for 500ms before retrying
        return getOpenAIResponse(message); // Retry the request
    }

        console.error('Error dari OpenAI API:', error);
        return 'Maaf, terjadi kesalahan dalam mengambil balasan.' ;
    }
}

module.exports = {
    getOpenAIResponse,
};