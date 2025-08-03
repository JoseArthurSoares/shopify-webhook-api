
# Projeto Shopify Webhook API (NestJS)

Este projeto é uma API backend construída com NestJS para se integrar ao Shopify. Suas principais funcionalidades incluem:

* Autenticação segura via OAuth2 com a biblioteca oficial do Shopify.
* Suporte para múltiplas lojas, com credenciais armazenadas em um banco de dados PostgreSQL.
* Registro automático de webhooks (`orders/create`) após a instalação do aplicativo.
* Um endpoint para receber, validar e processar notificações de webhooks de novos pedidos.
* Armazenamento dos dados dos pedidos em um banco de dados relacional usando Drizzle ORM.

## Pré-requisitos

* Node.js (v20 ou superior)
* NPM
* Docker e Docker Compose
* Uma conta de Parceiro do Shopify

-----

## 🚀 Como Subir a Aplicação com Docker Compose

Este método é o recomendado para o ambiente de desenvolvimento, pois sobe tanto a API quanto o banco de dados de forma isolada e consistente.

**1. Clone o Repositório**

```bash
git clone <url-do-seu-repositorio>
cd shopify-webhook-api
```

**2. Configure as Variáveis de Ambiente**
Crie uma cópia do arquivo `.env.example` e renomeie-a para `.docker.env`.

```bash
cp .env.example .docker.env
```

Preencha o arquivo `.docker.env` com suas credenciais. A `DATABASE_URL` já está configurada para o ambiente Docker.

```env
# .docker.env
PORT=3000

# Suas credenciais do Shopify (obtidas no Passo 2)
SHOPIFY_API_KEY=...
SHOPIFY_API_SECRET=...
SHOPIFY_SCOPES=read_orders,write_orders
SHOPIFY_API_VERSION=2024-07

# URL pública para o Shopify se comunicar (ex: ngrok)
HOST=https://sua-url-publica.ngrok-free.app

# Credenciais para o container do PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=sua-senha-segura
POSTGRES_DB=shopify_loja

# URL de conexão para a API se conectar ao container do DB
DATABASE_URL=postgres://postgres:sua-senha-segura@db:5432/shopify_loja
```

**3. Suba os Containers**
Execute o seguinte comando na raiz do projeto:

```bash
docker-compose up --build
```

* `up`: Inicia os containers da API e do banco de dados.
* `--build`: Força a reconstrução da imagem da sua API, garantindo que as últimas alterações no código sejam aplicadas.

Sua aplicação estará rodando e acessível em `http://localhost:3000`.

**4. Para Desligar**
Pressione `Ctrl + C` no terminal onde os containers estão rodando, ou execute em outro terminal:

```bash
docker-compose down
```

-----

## 🔧 Como Configurar um App na Shopify

Para que a API se conecte ao Shopify, você precisa criar um **Aplicativo Público** no seu painel de parceiro.

1.  **Acesse o Painel de Parceiros:** Vá para [partners.shopify.com](https://partners.shopify.com/).

2.  **Crie o Aplicativo:**

    * No menu lateral, clique em **Aplicativos \> Criar aplicativo**.
    * Escolha "Criar app manualmente" e dê um nome a ele.

3.  **Obtenha as Credenciais:**

    * Na página do seu novo aplicativo, vá para **Credenciais da API**.
    * Copie a **"Chave da API"** (`Client ID`) e a **"Chave secreta da API"** (`Client secret`).
    * Cole esses valores nos campos `SHOPIFY_API_KEY` e `SHOPIFY_API_SECRET` do seu arquivo `.docker.env`.

4.  **Configure as URLs:**

    * Ainda na página de configuração do app, encontre a seção de URLs.
    * **URL do app:** Cole a sua URL pública (`HOST` do `.env`, ex: `https://...ngrok-free.app`).
    * **URLs de redirecionamento permitidos:** Cole a sua URL de callback: `https://<sua-url-publica>/auth/callback`.

5.  **Configure os Escopos de Acesso (Permissions):**

    * Na seção **"Credenciais da API"**, encontre a área de "Escopos de acesso".
    * Garanta que as permissões `read_orders` e `write_orders` estejam selecionadas.

6.  **Solicite Acesso a Dados Protegidos:**

    * Ainda em **"Credenciais da API"**, encontre a seção **"Acesso aos dados protegidos do cliente"**.
    * Clique em "Solicitar acesso" e preencha o formulário, selecionando "Gerenciamento da loja" como motivo e respondendo às perguntas de conformidade.

-----

## ✅ Como Gerar e Testar um Pedido (Fluxo E2E)

1.  **Instale o App:**

    * Com a aplicação rodando (localmente ou no deploy), acesse a URL de instalação em uma **janela anônima**:
      `https://<sua-url-publica>/auth?shop=<nome-da-sua-loja-de-teste>.myshopify.com`

2.  **Autorize a Instalação:**

    * Faça login na sua loja de teste e clique em **"Instalar App"** na tela de consentimento. Você será redirecionado de volta e verá a mensagem de sucesso.

3.  **Crie um Pedido de Teste:**

    * No painel da loja, vá em `Pedidos > Criar pedido`.
    * Adicione um produto, um cliente e finalize o pedido marcando-o como pago.

4.  **Verifique o Resultado:**

    * **Console:** Observe o terminal da sua aplicação NestJS. Você deverá ver os logs do `WebhooksController` e do `OrdersService` indicando que o webhook foi recebido e o pedido foi salvo.
    * **Banco de Dados:** Conecte-se ao seu banco de dados e verifique se um novo registro foi criado na tabela `orders`.

-----

## 📊 Exemplo de Dados Salvos no Banco

**Tabela `shops`:**

```
           id                  |           nome_loja          |         access_token        | ...
--------------------------------------+------------------------------+-----------------------------+-----
5a9b498c-b7d6-4819-ab57-a25d5690dc3f | testewebhook.myshopify.com | shpat_2613a9042ac0...       | ...
```

**Tabela `orders`:**

```
             id                  |              shop_id               |                                order_data
-----------------------------------+--------------------------------------+---------------------------------------------------------------------
 gid://shopify/Order/6301207593008 | 5a9b498c-b7d6-4819-ab57-a25d5690dc3f | {"id": 6301207593008, "email": "cliente@exemplo.com", "total_price": "199.90", ...}
```

-----

## 🌐 Deploy na Render

* **URL do Deploy:** `https://shopify-webhook-api-j9yj.onrender.com`
* **Como Acessar:** Para instalar o aplicativo em uma loja, use a URL de instalação com o endereço da Render:
  `https://shopify-webhook-api-j9yj.onrender.com/auth?shop=<nome-da-sua-loja>.myshopify.com`
* **Endpoint de Listagem de Pedidos:**
  `GET https://shopify-webhook-api-j9yj.onrender.com/orders`