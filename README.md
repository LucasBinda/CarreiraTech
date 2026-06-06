# ML-Carreira

 - datasets extraidos de https://github.com/StackExchange/Survey/tree/main/packages/archive

para ativar o frontend do projeto e a web-page instale BUN e use bun dev no terminal, na pasta raiz do projeto.

e para inicializar a api do backend instale todos os requisitos do python em analytics/requirements.txt. 

- Ex com python instalado e dentro de qualquer tipo de terminal com o python funcionando: Python -r requirements.txt [uma vez ja dentro da pasta contendo o arquivo requirements.txt]
  
para inicializar finalmente, depois de baixar essas dependencias use: uvicorn analytics.api.main:app --reload