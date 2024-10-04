import { backend } from 'declarations/backend';

const inputText = document.getElementById('inputText');
const targetLanguage = document.getElementById('targetLanguage');
const translateBtn = document.getElementById('translateBtn');
const outputText = document.getElementById('outputText');
const speakBtn = document.getElementById('speakBtn');
const recentTranslations = document.getElementById('recentTranslations');

translateBtn.addEventListener('click', translateText);
speakBtn.addEventListener('click', speakTranslation);

async function translateText() {
    const text = inputText.value;
    const lang = targetLanguage.value;
    
    if (!text) return;

    try {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${lang}`);
        const data = await response.json();
        
        if (data.responseStatus === 200) {
            const translatedText = data.responseData.translatedText;
            outputText.textContent = translatedText;
            speakBtn.disabled = false;

            // Add translation to backend
            await backend.addTranslation(text, translatedText, getLangName(lang));

            // Update recent translations list
            updateRecentTranslations();
        } else {
            outputText.textContent = 'Translation error. Please try again.';
        }
    } catch (error) {
        console.error('Translation error:', error);
        outputText.textContent = 'Translation error. Please try again.';
    }
}

function speakTranslation() {
    const text = outputText.textContent;
    const lang = targetLanguage.value;
    
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    speechSynthesis.speak(utterance);
}

async function updateRecentTranslations() {
    const translations = await backend.getRecentTranslations();
    recentTranslations.innerHTML = '';
    translations.forEach(t => {
        const li = document.createElement('li');
        li.textContent = `${t.original} → ${t.translated} (${t.targetLanguage})`;
        recentTranslations.appendChild(li);
    });
}

function getLangName(code) {
    switch (code) {
        case 'de': return 'German';
        case 'fr': return 'French';
        case 'es': return 'Spanish';
        default: return 'Unknown';
    }
}

// Initial load of recent translations
updateRecentTranslations();
