# YT Converter — Backend

API REST desenvolvida com Node.js, Express e TypeScript para processamento assíncrono e conversão de mídias autorizadas nos formatos MP3 e MP4.

## Tecnologias utilizadas

- Node.js
- TypeScript
- Express
- Zod
- Axios
- YouTube Data API v3
- yt-dlp
- FFmpeg
- FFprobe
- Helmet
- Express Rate Limit

## Funcionalidades

- Validação de URLs do YouTube.
- Consulta de informações e metadados dos vídeos.
- Conversão de mídias para MP3 e MP4.
- Otimização de conversões utilizando análise de codecs.
- Fila de processamento assíncrona.
- Controle de conversões simultâneas.
- Acompanhamento do progresso das conversões.
- Downloads com nomes personalizados.
- Limpeza automática de arquivos temporários.
- Controle de duração e tamanho dos arquivos.
- Proteção de arquivos durante conversões e downloads.
- Limitação de requisições por IP.
- Configuração de CORS e cabeçalhos de segurança.

## Pré-requisitos

- Node.js 20 ou superior, utilizando uma versão compatível e com suporte ativo.
- npm.
- FFmpeg.
- FFprobe.
- yt-dlp.
- Chave da YouTube Data API v3.

O FFmpeg, FFprobe e yt-dlp devem estar disponíveis no PATH do sistema operacional.

## Instalação

```bash
npm install
```

Crie um arquivo `.env` utilizando o `.env.example` como referência e preencha as variáveis de ambiente necessárias.

## Executar em desenvolvimento

```bash
npm run dev
```

## Verificar os tipos

```bash
npm run typecheck
```

## Compilar e executar

```bash
npm run build
npm start
```

Por padrão, a API estará disponível em `http://localhost:3333`.

## Endpoints

| Método | Endpoint | Descrição |
|---|---|---|
| POST | /api/converter/validate | Validar dados da conversão |
| POST | /api/converter/info | Consultar informações do vídeo |
| POST | /api/converter/convert | Adicionar conversão à fila |
| GET | /api/converter/status/:id | Consultar andamento da conversão |
| GET | /api/converter/download/:filename | Baixar arquivo convertido |

## Status das conversões

- `queued`: aguardando processamento.
- `downloading`: baixando mídia original.
- `converting`: convertendo mídia.
- `completed`: conversão concluída.
- `failed`: falha no processamento.
- `expired`: arquivo expirado.

## Arquitetura

O projeto utiliza uma arquitetura modular, separando rotas, controllers, services, middlewares, schemas, configurações, tipos e funções utilitárias.

A fila de processamento é mantida em memória e os arquivos são armazenados temporariamente no servidor.

## Limitações

- As tarefas não persistem após a reinicialização do servidor.
- A arquitetura atual foi desenvolvida para uma única instância do backend.
- Os arquivos convertidos possuem tempo de disponibilidade limitado.
- O percentual de progresso é uma estimativa baseada nas etapas de download e conversão.

## Uso responsável

O projeto possui finalidade educacional e deve ser utilizado exclusivamente para conteúdos cujo download e conversão sejam autorizados, respeitando os direitos autorais e os termos de uso das plataformas envolvidas.