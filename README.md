# CarreiraTech

Plataforma web para análise do mercado de tecnologia, recomendação de vagas e previsão salarial utilizando Machine Learning.

## Objetivo

O ML-Carreira foi desenvolvido com o objetivo de auxiliar estudantes e profissionais da área de tecnologia a compreender melhor o mercado de trabalho, identificar oportunidades compatíveis com seu perfil e estimar faixas salariais utilizando Inteligência Artificial.

A plataforma integra análise de dados, visualização de informações do mercado e modelos preditivos treinados com dados reais da indústria de tecnologia.

---

# Dataset

Os datasets utilizados neste projeto foram extraídos da pesquisa oficial da Stack Overflow:

https://github.com/StackExchange/Survey/tree/main/packages/archive

A Stack Overflow Developer Survey é uma das maiores pesquisas mundiais sobre profissionais de tecnologia, contendo informações relacionadas a:

* Salários;
* Escolaridade;
* Experiência profissional;
* Linguagens de programação;
* Frameworks;
* Bancos de dados;
* Cargos;
* Países de atuação;
* Modalidade de trabalho.

---

# MVP Final

O MVP do ML-Carreira consiste em uma plataforma funcional capaz de:

* Analisar dados do mercado de tecnologia;
* Recomendar vagas de acordo com o perfil do usuário;
* Estimar remunerações utilizando Machine Learning;
* Disponibilizar visualizações interativas para apoio ao planejamento de carreira.

## Funcionalidades Implementadas

### Dashboard do Mercado

Apresenta indicadores e visualizações sobre o mercado de tecnologia, incluindo:

* Salário médio por área;
* Habilidades mais requisitadas;
* Distribuição por senioridade;
* Distribuição por modelo de trabalho.

### Sistema de Recomendação de Vagas

Permite ao usuário informar:

* Habilidades;
* Nível profissional;
* Área de interesse;
* Modelo de trabalho desejado;
* Faixa salarial mínima.

Com base nessas informações o sistema calcula um score de compatibilidade e recomenda vagas alinhadas ao perfil.

### Preditor Salarial com Inteligência Artificial

O usuário informa características profissionais como:

* Experiência;
* Escolaridade;
* Cargo;
* Linguagens;
* Frameworks;
* Bancos de dados;
* Modelo de trabalho.

As informações são enviadas para uma API FastAPI que utiliza um modelo XGBoost treinado com dados da Stack Overflow Developer Survey para estimar a remuneração mensal do profissional.

---

# Tecnologias Utilizadas

## Frontend

* React
* TypeScript
* TanStack Router
* Tailwind CSS
* Shadcn/UI
* Recharts
* Bun

## Backend

* Python
* FastAPI
* Pandas
* NumPy
* Scikit-Learn
* XGBoost
* Uvicorn

## Machine Learning

* XGBoost Regressor
* One-Hot Encoding
* Feature Engineering
* Cross Validation

---

# Arquitetura do Sistema

Frontend React
↓
API FastAPI
↓
Modelo XGBoost
↓
Predição Salarial

O frontend é responsável pela interação com o usuário e visualização dos dados.

O backend disponibiliza endpoints REST para consulta de metadados e execução de previsões salariais.

O modelo XGBoost realiza as estimativas salariais a partir das características profissionais informadas pelo usuário.

---

# Métricas do Modelo

As métricas foram calculadas sobre o conjunto de teste após o treinamento do modelo.

| Métrica                | Valor         |
| ---------------------- | ------------- |
| R²                     | 0.600         |
| MAE                    | US$ 2.125/mês |
| RMSE                   | US$ 2.975/mês |
| Cross Validation Score | 0.588         |

## Interpretação

* R² indica que aproximadamente 60% da variabilidade salarial é explicada pelo modelo.
* MAE representa o erro absoluto médio das previsões.
* RMSE representa a magnitude média dos erros mais severos.
* O Cross Validation Score demonstra estabilidade durante validações cruzadas.

---

# Instalação

## 1. Clonar o projeto

```bash
git clone <repositorio>
cd ML-Carreira
```

---

## 2. Instalar dependências do Frontend

Instale o Bun:

https://bun.sh

Após a instalação, execute na raiz do projeto:

```bash
bun install
```

---

## 3. Executar o Frontend

Na pasta raiz do projeto:

```bash
bun dev
```

A aplicação web ficará disponível localmente.

---

## 4. Instalar dependências do Backend

Acesse a pasta:

```bash
analytics
```

Instale as dependências presentes em:

```txt
analytics/requirements.txt
```

Exemplo:

```bash
pip install -r requirements.txt
```

ou

```bash
python -m pip install -r requirements.txt
```

---

## 5. Executar a API

Após instalar as dependências:

```bash
uvicorn analytics.api.main:app --reload
```

A API será inicializada localmente e ficará responsável pelas previsões salariais.

---

# Análise Exploratória

Durante o desenvolvimento foram realizadas análises exploratórias do dataset, incluindo:

* Salário versus experiência;
* Linguagens com maiores salários médios;
* Países com maiores salários médios;
* Distribuição salarial dos profissionais de tecnologia.

Essas análises auxiliaram na compreensão dos padrões presentes nos dados e na construção do modelo preditivo.

---

# Impacto Social

O ML-Carreira busca democratizar o acesso a informações sobre o mercado de tecnologia.

Muitos estudantes e profissionais iniciantes possuem dificuldades para compreender quais habilidades são mais valorizadas, quais áreas oferecem melhores oportunidades e quais salários podem ser esperados em diferentes estágios da carreira.

A plataforma contribui para reduzir essa assimetria de informação ao disponibilizar:

* Visualizações sobre o mercado de trabalho;
* Recomendações de vagas compatíveis com o perfil do usuário;
* Estimativas salariais baseadas em dados reais do setor.

O sistema auxilia estudantes na definição de trilhas de aprendizagem, profissionais em transição de carreira e pessoas que desejam compreender melhor as tendências do mercado de tecnologia.

---

# Possíveis Trabalhos Futuros

* Integração com APIs reais de vagas;
* Recomendações baseadas em Machine Learning;
* Atualização automática do dataset;
* Predições específicas para o mercado brasileiro;
* Dashboard em tempo real;
* Sistema de autenticação e perfil de usuário.

---

## Autores

Projeto desenvolvido com o objetivo de explorar diferentes tecnologias, linguagens de programação e abordagens de desenvolvimento Full Stack, integrando análise de dados, Machine Learning e visualização de informações.

O sistema utiliza dados públicos da Stack Overflow Developer Survey para realizar análises do mercado de tecnologia, previsões salariais por meio de modelos de Inteligência Artificial treinados com dados reais.

Além do caráter educacional e experimental, o projeto busca demonstrar a aplicação prática de técnicas de Ciência de Dados e Aprendizado de Máquina em um contexto de orientação profissional e planejamento de carreira.

Data da versão atual: 10/06/2026.
