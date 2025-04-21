## FOREX - CALENDÁRIO ECONÔMICO

  
Api desenvolvida para oferecer informações que são divulgadas diariamente sobre o calendário econômico. Taxa de desemprego e estoque de petróleo divulgados em tempo real pelo governo são exemplos do que se pode obter desta API

Tome duas decisões e programe suas automações.

  


### Aviso !

- São retornados apenas os eventos do dia atual;

- O horário retornado na API é referente ao servidor onde está hospedada, deve-se observar sempre o GMT/ZULU/UTC retornado;

- O tempo de resposta depende do servidor e da API intermediária de scraping. Se precisa do maior tempo possível de resposta considere subir local;

  

### Ambiente local

  

- Instalar o Node versão 22;

- Após o clone do projeto deve-se criar o arquivo '.env' para evitar possível dor de cabeça preencher a variável;

```markdown

NODE_ENV=dev

```

- Instalar dependências;

```javascript

npm  install

```

- Por padrão está configurado para rodar na porta 3000 se desejar alterar deve ser alterado no arquivo Server.js pois a porta não está na variável de ambiente. Para rodar o server;

```javascript

node Server.js

```

### Documentação

- Para utilizar a API online (hospedada) é possível utilizar a *[documentação no Swagger](https://economicalendar.site/api-docs/)*;


### Exemplo de retorno
![](/doc/assets/doc_calendar_image.png)

  

### Fluxo

![Fluxo](https://res.cloudinary.com/dszqs88zv/image/upload/fl_preserve_transparency/v1732386243/Fluxo_bcpji7.jpg?_s=public-apps)
