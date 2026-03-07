## Teste Técnico Jitterbit

### Para iniciar a aplicação, escolha uma das opções abaixo.

---

## 1. Executar com Docker

1. Rode o comando:

```bash
docker  compose  up
```

2. Após iniciar, acesse a documentação da API em:

```
http://localhost:3000/docs
```

---

## 2. Executar localmente

1. Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```
PORT=3000

DATABASE_HOST=localhost

DATABASE_NAME=nomedobanco

DATABASE_PASS=suasenha

DATABASE_PORT=5432

DATABASE_USER=usuariodobanco

JWT_SECRET=suasenha
```

2. Instale as dependências:

```
npm  install
```

3. Inicie a aplicação em modo desenvolvimento:

```bash
npm  run  dev
```

4. Acesse a documentação da API em:

```
http://localhost:3000/docs
```

## Funcionalidades

- Autenticação JWT
- Criação,listagem,edição e exclusão de pedidos

Para acessar os endpoints é importante fazer a autenticação e inserir o token no header Authorization disponibilizado no Scalar UI
