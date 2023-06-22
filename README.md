# API com função de Refresh Token

## Como funciona?

A aplicação feita para testar a funcionalidade de refresh token ela gera dois tokens ao finalizar um cadastro ou no login bem sucedido. 
Enquanto o token com maior duração chamado de refresh token for valido não será necessário efetuar login novamente.

1 - Faça o cadastro na rota POST /users.

2 - Faça login POST /users/auth. Você receberá um token com validade de 15 minutos e a aplicação gera um refresh token interno com validade de 30 dias.

3 - Ao utilizar uma rota protegida por exemplo a rota GET /users com um token no header Authorization que esteja expirado porem seja valido você recebera um erro com status 401 e também um novo token. 

4 - Com o novo token se torna possível fazer a substituição do token expirado armazenado e continuar o fluxo do front-end sem redirecionar para uma página de login por exemplo.

5 - Ao tentar entrar com token inválido ou após os 30 dias é necessário efetuar login novamente.

6 - É possível editar o tempo de expiração dos tokens no .env.

## Exemplo de setup do projeto

1 - Instale as dependências do projeto `yarn`.

2 - Tenha um database rodando.
	Caso não tenha um database em mãos utilize o comando docker:
	`docker run -d --name refresh-token -p 5432:5432 -e POSTGRES_PASSWORD=admin -v pgdata:/var/lib/postgresql/data postgres`
	** Importante caso queira utilizar os dois containers certifique-se de que estão na mesma network.
	O segundo container é opcional, é uma ferramenta útil por exemplo caso queira visualizar se o cadastro funcionou:
	`docker run --name my-pgadmin -p 15432:80 -e PGADMIN_DEFAULT_EMAIL=test@gmail.com -e PGADMIN_DEFAULT_PASSWORD=postgres -d dpage/pgadmin4`
	
3- Renomeie o Example.env para .env e edite a url de acordo com sua configuração do seu database.

4 - Se o seu database ainda não tem as tabelas descritas em schema.prisma faça uma migration `yarn prisma migrate dev`.

## Rotas

Atualmente estão configurados 3 endpoints.

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