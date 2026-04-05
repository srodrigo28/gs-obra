Quero criar um sistema web/mobile de controle de gastos e orçamento para prestadores de serviço, com foco em usabilidade simples e fluxo step-by-step.

Objetivo do sistema:
Permitir que o usuário controle entradas e saídas diárias, organize tudo por fundo de custo (ex.: Obra do João), gere orçamentos com serviços e materiais, calcule totais automaticamente, gere PDF e compartilhe por WhatsApp.

Regras principais:
1. O usuário pode se cadastrar com email e senha ou login com Google.
2. No cadastro deve informar nome, email, telefone, sexo e endereço.
3. O endereço deve ser preenchido automaticamente via CEP usando ViaCEP.
4. O sistema deve permitir criar fundos de custo, que funcionam como grupos de controle financeiro.
5. Todo lançamento financeiro deve ser vinculado a um fundo de custo.
6. O lançamento pode ser de entrada ou saída.
7. Deve existir cadastro de categorias de entrada e categorias de saída.
8. O sistema deve trazer 3 categorias padrão para entrada e 3 para saída, mas permitir criar novas.
9. Deve haver filtros e cálculos:
   - diário
   - semanal
   - mensal
   - por fundo de custo
10. O sistema deve permitir criar orçamentos vinculados a um fundo de custo.
11. Em um orçamento o usuário pode adicionar itens de serviço e material.
12. Cada item deve ter nome, quantidade, valor unitário e total por linha.
13. O sistema deve calcular subtotal de serviços, subtotal de materiais e total geral.
14. O orçamento deve ser salvo para consulta futura.
15. Deve gerar PDF do orçamento.
16. Deve permitir compartilhar o PDF por WhatsApp.
17. O módulo de perfil deve ser dividido em passos internos: dados da empresa, conta e preferências.
18. Campos de telefone, CEP e CNPJ devem usar máscara para facilitar o preenchimento.
19. O CNPJ deve ser validado localmente antes do envio.
20. O CEP deve auto preencher logradouro, bairro, cidade e UF via ViaCEP.

O que eu preciso que você faça:
- organizar a regra de negócio completa
- sugerir módulos do sistema
- sugerir estrutura de banco de dados
- sugerir fluxo de telas simples e step-by-step
- sugerir MVP e roadmap por fases
- sugerir nomes de telas, campos e ações
- pensar em uma experiência clara, com pouca informação por tela
- priorizar a visão de prestadores de serviço como pedreiros, eletricistas, pintores, encanadores e autônomos em geral
