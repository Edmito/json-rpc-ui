# JSON-RPC UI

Este projeto é uma interface de usuário para um serviço de pedidos utilizando JSON-RPC. Ele permite criar, consultar e listar pedidos.

## Funcionalidades

- **Criar Pedido:** Permite criar um novo pedido fornecendo o ID do cliente, item e quantidade.
- **Consultar Pedido:** Permite consultar um pedido existente fornecendo o ID do pedido.
- **Listar Pedidos:** Permite listar todos os pedidos existentes.

## Tecnologias Utilizadas

- **React:** Biblioteca JavaScript para construção de interfaces de usuário.
- **TypeScript:** Superset de JavaScript que adiciona tipagem estática ao código.
- **Zod:** Biblioteca de validação de esquemas.
- **React Hook Form:** Biblioteca para gerenciamento de formulários em React.
- **Shadcn:** Conjunto de componentes de UI.
- **Sonner:** Biblioteca para exibição de toasts.
- **Tailwind CSS:** Framework de CSS para estilização.

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/Edmito/json-rpc-ui.git
   ```

2. Navegue até o diretório do projeto:

   ```bash
   cd /json-rpc-ui
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

4. Atualize o endpoint do serviço de pedidos:

Localize a linha de código:

```javascript
const res = await fetch('http://localhost:5186/rpc', {
```

Em seguida, substitua o endereço 'http://localhost:5186/rpc' pelo endereço do servidor onde está rodando o serviço de pedidos. Por exemplo:

```javascript
const res = await fetch('http://SEU_ENDERECO_DO_SERVIDOR/rpc', {
```

Certifique-se de que o novo URL corresponda ao endereço correto do ambiente em que o serviço está implantado.

## Uso

1. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

2. Abra o navegador e acesse:

   ```
   http://localhost:3000
   ```

## Estrutura do Projeto

- **app/page.tsx:** Componente principal da aplicação.
- **components/ui:** Componentes de UI reutilizáveis.

## Contribuição

1. Faça um fork do projeto.
2. Crie uma nova branch:

   ```bash
   git checkout -b minha-nova-feature
   ```

3. Faça as alterações desejadas e commit:

   ```bash
   git commit -m 'Adiciona nova feature'
   ```

4. Envie para o repositório remoto:

   ```bash
   git push origin minha-nova-feature
   ```

5. Abra um Pull Request.
