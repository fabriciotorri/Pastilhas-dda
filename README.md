# Controle de Estoque - DDA Metalúrgica

API desenvolvida para gestão de estoque da DDA Metalúrgica.


## Tecnologias
- Node.js, TypeScript, Express
- Prisma (ORM) com SQLite

- controle-dda
├── Tree.md
├── estrutura.txt
├── package-lock.json
├── package.json
├── prisma
│   └── schema.prisma
├── prisma.config.ts
├── skills-lock.json
├── src
│   ├── lib
│   │   └── prisma.ts
│   ├── routes
│   │   ├── fornecedorRoutes.ts
│   │   ├── movimentacaoRoutes.ts
│   │   └── pastilhasRoutes.ts
│   └── server.ts
└── tsconfig.json

## Como rodar
1. Instale as dependências: `npm install`
2. Gere o Prisma: `npx prisma generate`
3. Rode o servidor: `npx tsx watch src/server.ts`
