1. Visao do projeto

Seu sistema pode ser dividido em 3 grandes areas:

Area A - Financeiro diario

registrar entradas
registrar saidas
associar tudo a um fundo de custo / grupo
categorizar
filtrar por periodo e por grupo
acompanhar saldo

Area B - Orcamentos / obras / servicos

criar um orcamento para uma obra ou cliente
adicionar itens de servico e material
calcular subtotal por item, total por tipo e total geral
gerar PDF
compartilhar no WhatsApp
salvar historico do orcamento

Area C - Perfil e configuracoes

completar dados da empresa
editar conta do usuario
configurar preferencias do app
validar CNPJ
auto preencher endereco via CEP

A melhor decisao aqui e tratar fundo de custo como centro do negocio, sem esquecer que o perfil precisa estar completo para melhorar relatorios, documentos e configuracoes.

2. Regra de negocio central

Entidades principais
1) Usuario

Campos:

id
nome
email
telefone
senha_hash
tipo_login: local | google
sexo
cep
rua
numero
bairro
cidade
estado
created_at

2) Empresa / perfil empresarial

Campos:

id
user_id
nome_fantasia
razao_social
cnpj
email_comercial
cep
rua
numero
bairro
cidade
estado
complemento
logo_url

3) Fundo de custo

Representa uma obra, cliente, projeto ou servico.

Campos:

id
user_id
nome
descricao
status: ativo | concluido | arquivado
data_inicio
data_fim
observacoes

4) Categoria de entrada

Campos:

id
user_id
nome
cor/icone opcional
padrao: true/false

5) Categoria de saida

Campos:

id
user_id
nome
cor/icone opcional
padrao: true/false

6) Lancamento financeiro

Campos:

id
user_id
fundo_custo_id
tipo: entrada | saida
categoria_id
descricao
valor
data_lancamento
forma_pagamento: dinheiro | pix | cartao | boleto | transferencia
comprovante_url opcional
observacoes

7) Orcamento

Campos:

id
user_id
fundo_custo_id
cliente_nome
cliente_telefone
cliente_email opcional
status: rascunho | enviado | aprovado | recusado
validade
desconto
observacoes
subtotal_servicos
subtotal_materiais
total_geral
pdf_url

8) Itens do orcamento

Campos:

id
orcamento_id
tipo_item: servico | material
nome
quantidade
valor_unitario
total_item

3. Fluxo de telas simples, em step-by-step

Fluxo A - Onboarding e cadastro
Tela 1 - Boas-vindas
Tela 2 - Cadastro basico
Tela 3 - Endereco com CEP automatico
Tela 4 - Criar primeiro fundo de custo

Fluxo B - Perfil
Tela 1 - Dados da Empresa
logo
nome fantasia
razao social
cnpj com mascara e validacao
email
cep com auto preenchimento
endereco completo

Tela 2 - Conta
avatar
nome completo
telefone com mascara
senha atual
nova senha
confirmar nova senha
notificacoes

Tela 3 - Preferencias
tema
moeda padrao
prazo padrao
notificacoes
backup automatico
plano atual

Fluxo C - Lancamento diario
Tela 1 - Escolha do tipo
Tela 2 - Escolha do fundo de custo
Tela 3 - Dados do lancamento
Tela 4 - Revisao

Fluxo D - Criar orcamento
Tela 1 - Escolher fundo de custo
Tela 2 - Dados do cliente
Tela 3 - Adicionar servicos
Tela 4 - Adicionar materiais
Tela 5 - Resumo do orcamento
Tela 6 - Finalizacao

Fluxo E - Relatorios
Tela 1 - Escolha do periodo
Tela 2 - Escolha do agrupamento
Tela 3 - Resultado com cards, grafico simples e lista detalhada

4. Regras importantes de UX

- pouca informacao por tela
- formularios com mascara quando fizer sentido
- progresso visual entre etapas do perfil
- cards e formularios com fundo branco para melhorar leitura
- componentes preparados para trocar mocks por API no futuro
