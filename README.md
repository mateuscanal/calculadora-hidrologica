# Backend - Calculadora Hidrológica

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm (geralmente vem com o Node.js)

## 🚀 Instalação

1. **Crie uma pasta para o backend:**
   ```bash
   mkdir calculadora-hidrologica-backend
   cd calculadora-hidrologica-backend
   ```

2. **Crie os arquivos do projeto:**
   - Crie um arquivo `server.js` e cole o código do servidor
   - Crie um arquivo `package.json` e cole o conteúdo do package.json

3. **Instale as dependências:**
   ```bash
   npm install
   ```

## 🏃‍♂️ Executando o servidor

### Modo de produção:
```bash
npm start
```

### Modo de desenvolvimento (com auto-reload):
```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3001`

## 📁 Estrutura do projeto

```
calculadora-hidrologica-backend/
│
├── server.js          # Arquivo principal do servidor
├── package.json       # Configuração do projeto e dependências
├── package-lock.json  # Lock file (gerado automaticamente)
└── node_modules/      # Dependências (gerado automaticamente)
```

## 🔧 Configuração CORS

O servidor já está configurado para aceitar requisições de qualquer origem. Se você quiser restringir o acesso apenas ao seu frontend, modifique a configuração do CORS em `server.js`:

```javascript
app.use(cors({
    origin: 'http://localhost:8080' // URLfrontend
}));
```

## 📝 Formato do Memorial

O memorial gerado inclui:

1. **Dados de Entrada:**
   - Parâmetros da equação IDF (K, a, b, c)
   - Características da bacia (área, comprimento, altura, coeficiente)
   - Coordenadas (barramento, empréstimo, bota fora)

2. **Memorial de Cálculo:**
   - Tempo de Concentração (Tc) com fórmula e cálculo
   - Intensidade Média (Im) com fórmula e cálculo
   - Vazão (Q) com fórmula e cálculo

3. **Resumo dos Resultados:**
   - Tabela com todos os resultados calculados

## 🐛 Troubleshooting

### Erro de CORS
Se você receber erro de CORS, verifique se:
- O servidor está rodando na porta correta (3000)
- A URL no frontend está correta (`http://localhost:3000/api/generate-memorial`)

### Erro ao gerar documento
Se houver erro na geração do documento:
- Verifique se todos os dados estão sendo enviados corretamente
- Confira o console do servidor para mensagens de erro detalhadas

### Porta já em uso
Se a porta 3000 já estiver em uso, você pode:
1. Parar o processo que está usando a porta
2. Ou mudar a porta no `server.js`:
   ```javascript
   const PORT = 3001; // ou outra porta disponível
   ```
   E atualizar a URL no frontend também.

## 🤝 Testando a integração

1. Abra seu arquivo HTML no navegador
2. Preencha todos os campos obrigatórios
3. Clique em "Calcular"
4. Após ver os resultados, clique em "Gerar Memorial"
5. O arquivo .docx será baixado automaticamente
