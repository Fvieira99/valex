## Usage

```bash
$ git clone https://github.com/Fvieira99/valex.git

$ cd $nome-repositorio

$ npm install

$ npm run dev
```

API:

```
- POST /cards
    - Rota para cadastrar um novo cartão. Apenas empresas com uma api-key registrada podem criar cartões.
    - Utilize a chave zadKLNx.DzvOVjQH01TumGl2urPjPQSxUbf67vs0 no header x-api-key para testar a rota.
    - headers: { "x-api-key":  }
    - Já existem dois funcionários cadastrados utilize o employeeId 1 ou 2.
    - body: {
        "employeeId": 1,
        "cardType": "transport" | "groceries" | "education" | "health" | "restaurant"
    }
    - Para facilitar os testes, após a criação de um cartão o CVC é retornado. Guarde-o para utilizar nas outras rotas
    - Ao criar um cartão o id começará em 2 para o primeiro cartão criado, 3 para o segundo e assim por diante. Utilize esse id nas próximas rotas. 

- PUT /cards/activate
    - Rota para ativar um cartão
    - Apenas cartões que não possuem senha cadastradas podem ser ativados.
    - body: {
    "cardId": number,
    "employeeId": number,
    "inputSecurityCode": string,
    "inputPassword": string,
    }
    - A propriedade inputPassword significa a senha que será registrada no cartão
    - Senhas devem ter 4 dígitos.


- PUT /cards/unblock | /cards/block
    - Rotas para bloquear ou desbloquear cartões
    - body: {
        "cardId": number,
        "employeeId": number,
        "inputPassword: string"
    }
    - A propriedade inputPassword significa a senha que será comparada com a senha registrada no banco


- GET /cards/:cardId/statement
    - Rota para listar o extrato de um cartão. Mostrando as transações, as recargas e o saldo.
    - Passar o Id do cartão por params.


- POST /payment
    - Rota para registrar uma compra ou pagamento.
    - body: {
        "cardId": number,
        "amount": number > 0,
        "employeeId": number,
        "inputPassword": string,
    }
    - A propriedade inputPassword significa a senha que será comparada com a senha registrada no banco


- POST /recharge
    - Rota para registrar uma recarga
    - Utilize novamente o header x-api-key passado na rota de criação.
   headers: {"x-api-key": }
   body: {
        "cardId": number,
        "amount": number > 0,
        "employeeId": number,
        "inputPassword": string,
    }
    - A propriedade inputPassword significa a senha que será comparada com a senha registrada no banco
```
