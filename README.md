# API com Função de Refresh Token

## Como Funciona?

Esta aplicação foi desenvolvida para testar a funcionalidade de Refresh Token. Ela gera dois tokens ao finalizar um cadastro ou após um login bem-sucedido. Enquanto o token com maior duração, chamado de Refresh Token, estiver válido, não será necessário efetuar o login novamente.

1. Realize o cadastro na rota POST /users.

2. Efetue o login utilizando o método POST na rota /users/auth. Você receberá um token com validade de 15 minutos, e a aplicação gerará um Refresh Token interno com validade de 30 dias.

3. Ao acessar uma rota protegida, como a rota GET /users, inclua o token no header Authorization. Se o token estiver expirado mas ainda for válido, você receberá um erro com o status 401, juntamente com um novo token.

4. Com o novo token, é possível substituir o token expirado armazenado e continuar o fluxo do front-end sem a necessidade de redirecionar para uma página de login, por exemplo.

5. Caso tente acessar com um token inválido ou após os 30 dias, será necessário efetuar o login novamente.

6. É possível editar o tempo de expiração dos tokens no arquivo .env.

## Exemplo de Configuração do Projeto

1. Instale as dependências do projeto com o comando `yarn`.

2. Tenha um banco de dados em funcionamento.
   Se não possuir um banco de dados, você pode executar o seguinte comando Docker:
	`docker run -d --name refresh-token -p 5432:5432 -e POSTGRES_PASSWORD=admin -v pgdata:/var/lib/postgresql/data postgres`
	** Importante: caso deseje utilizar os dois containers, certifique-se de que eles estão na mesma rede.
O segundo container é opcional e é uma ferramenta útil para visualizar, por exemplo, se o cadastro foi realizado corretamente:
	`docker run --name my-pgadmin -p 15432:80 -e PGADMIN_DEFAULT_EMAIL=test@gmail.com -e PGADMIN_DEFAULT_PASSWORD=postgres -d dpage/pgadmin4`
	
3. Renomeie o arquivo Example.env para .env e edite a URL de acordo com a configuração do seu banco de dados.

4. Caso o seu banco de dados ainda não possua as tabelas descritas no arquivo schema.prisma, execute a migração com o comando yarn prisma migrate dev.

## Rotas

Atualmente, estão configurados 3 endpoints.

POST: /users
Rota de cadastro
Request Body: {"name": "user", "username": "user1", "password": "123456"}
Response: {
"id": "560f2a78-706a-4cc7-b507-432b6a7ae61c",
"name": "user",
"token": ""
}

POST: /users/auth
Rota de login
body: {"username": "user", "password": "123456"}
Response: { "token": "string" }

GET: /users
Rota para listar users
Header: { Authentication: token }
Response: [
{
"id": "560f2a78-706a-4cc7-b507-432b6a7ae61c",
"name": "user",
"username": "user1"
}, ... ]
