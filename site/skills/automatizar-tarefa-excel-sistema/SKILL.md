---
name: automatizar-tarefa-excel-sistema
description: Ajuda a montar, em etapas e com segurança, um robô em Python (openpyxl e Playwright) que lê uma planilha do Excel e preenche dados em um sistema pelo navegador. Use quando a pessoa quiser automatizar uma tarefa repetitiva de digitação entre Excel e um sistema, mesmo sem saber programar.
---

# Automatizar uma tarefa entre Excel e um sistema

Versão 1.0 · 07/11/2026 · Contas na Mesa

Skill baseada no episódio "Como automatizei uma medição no Protheus com Python e Excel" (Contas na Mesa). O exemplo do episódio usa dados fictícios. Esta skill é genérica: vale para qualquer sistema que rode no navegador.

## Princípios

1. **Entender antes de programar.** Não escreva código antes de concluir a entrevista da Etapa 0.
2. **Teste primeiro, de verdade depois.** O robô nasce em modo de teste (não salva, não confirma). Só roda de verdade em uma linha, depois em lote.
3. **Humano no comando.** Peça confirmação antes de qualquer ação que não possa ser desfeita.
4. **Sem segredos no código.** Nunca peça, grave ou repita senhas, tokens ou dados pessoais. A pessoa entra no sistema manualmente no navegador.
5. **Ambiente de teste ou dados fictícios** até a pessoa validar o resultado. Pergunte se existe uma cópia do sistema.
6. **Autorização.** Lembre a pessoa de automatizar só onde tem permissão e de respeitar as regras do sistema e da empresa.

## Etapa 0: entrevista (uma pergunta por vez)

1. Qual é a tarefa, do começo ao fim, e quantas vezes ela se repete?
2. De onde vêm os dados (planilha, sistema, e-mail) e como as colunas se chamam?
3. Em qual sistema os dados são digitados? Existe ambiente de teste ou cópia?
4. **Qual regra a pessoa usa, sem pensar, para escolher o campo ou a linha certa?** Essa é a pergunta mais importante: é a regra que o robô vai precisar aprender.
5. Como a pessoa confere que o resultado está certo?

Ao final, resuma o que entendeu em poucas linhas e peça confirmação.

## Etapa 1: a planilha de entrada

- Leia com `openpyxl`. Use `data_only=True` para ler valores e não fórmulas.
- Se houver mais de uma tabela, prefira **duas abas ligadas por um identificador** (por exemplo, `lotes` e `itens`, ligados por um `id`). Assim o programa sabe quais dados levar juntos.
- **Normalize antes de comparar**: tire espaços, padronize maiúsculas e minúsculas e converta datas para só dia, mês e ano.

```python
from datetime import date, datetime
from openpyxl import load_workbook

def so_data(valor):
    """Datas lidas do Excel podem vir com horário (meia-noite). Compare só dia, mês e ano."""
    if isinstance(valor, datetime):
        return valor.date()
    if isinstance(valor, date):
        return valor
    return datetime.strptime(str(valor).strip()[:10], "%d/%m/%Y").date()

wb = load_workbook("entrada.xlsx", data_only=True)
```

## Etapa 2: o navegador

- Use `Playwright` em modo visível (`headless=False`) enquanto estiver testando.
- **Login manual:** abra o sistema, peça para a pessoa entrar e apertar Enter no terminal.
- **Encontre a linha pela descrição completa**, nunca só pelas primeiras palavras. Duas linhas podem começar igual.

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    navegador = p.chromium.launch(headless=False)
    pagina = navegador.new_page()
    pagina.goto(URL_DE_TESTE)
    input("Entre no sistema e aperte Enter aqui...")
    linha = pagina.get_by_role("row").filter(has_text=DESCRICAO_COMPLETA)
    assert linha.count() == 1, f"Esperava 1 linha, achei {linha.count()}"
```

Se `count()` não for exatamente 1, **pare e avise**. Nunca digite na primeira que aparecer.

## Etapa 3: modo de teste

- Implemente uma opção `--teste` (ligada por padrão) que **mostra o que digitaria e onde**, sem salvar nem confirmar.
- Mostre na tela, para cada linha: identificador, descrição procurada, campo e valor.

## Etapa 4: uma linha de verdade

- Rode de verdade em **uma única linha**, só depois de a pessoa aprovar o modo de teste.
- Peça que a pessoa confira no sistema e confirme antes de ir para o lote.

## Etapa 5: lote com registro

- Grave um log por linha: identificador, resultado (sucesso ou erro) e hora.
- **Pare no primeiro erro inesperado.** Não continue em silêncio.
- Faça um segundo relatório da execução: quantas linhas, quantas com sucesso, quais falharam.

## Armadilhas já encontradas

| Armadilha | O que acontece | Como evitar |
|---|---|---|
| Linhas que começam com o mesmo texto | O robô digita na linha errada | Procurar pela descrição completa e exigir exatamente 1 resultado |
| Data com horário ao reler o Excel | A mesma data vira "dois dias" e cria lote duplicado | Comparar só dia, mês e ano |
| Exportar a mesma coisa duas vezes | Registros duplicados | Chave única por registro e teste de reexportação |
| Quantidade na linha de cima | A de baixo continua zerada | Conferir a linha exata, no modo de teste, antes de rodar |

## O que entregar à pessoa

1. A estrutura da planilha de entrada (abas e colunas, com um exemplo fictício).
2. O script em etapas, com o modo de teste ligado por padrão.
3. Um passo a passo curto de como rodar e conferir.
4. Uma lista do que **não** foi testado e do que a pessoa precisa validar.

## O que nunca fazer

- Pedir ou gravar senhas, tokens ou dados pessoais.
- Rodar em um sistema de produção sem a pessoa ter validado o teste.
- Ignorar um erro para "terminar o lote".
- Prometer economia de tempo: o ganho depende de cada tarefa e só a pessoa mede.
