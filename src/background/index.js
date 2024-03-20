chrome.webNavigation.onCompleted.addListener((details) => {
  if (details.frameId === 0) { // Verifica se é a página principal que foi carregada
    // Faz uma varredura no chrome.storage por chaves com o prefixo "DTF_"
    chrome.storage.local.get(null, (items) => {
      for (const key in items) {
        if (key.startsWith('DTF_')) {
          const value = items[key];
          console.log(`Key: ${key}, Value: ${value}`);
        }
      }
    });
  }
}, { url: [{ schemes: ['http', 'https'] }] }); // Filtra para apenas URLs HTTP e HTTPS