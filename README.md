<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>README - Eliabi</title>
    <style>
        /* Estilos básicos para simular o ambiente escuro do GitHub */
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
            background-color: #0d1117; /* Fundo escuro do GitHub */
            color: #c9d1d9; /* Texto claro */
            padding: 20px;
            max-width: 980px;
            margin: 0 auto;
        }

        /* Container principal */
        .container {
            border: 1px solid #30363d; /* Borda sutil */
            border-radius: 6px;
            padding: 40px 50px;
            background-color: #161b22; /* Fundo do card ligeiramente mais claro */
        }

        /* Título principal e subtítulo */
        .title-section h1 {
            font-size: 2.5em;
            color: #58a6ff; /* Cor de destaque para o nome */
            margin-top: 0;
            margin-bottom: 5px;
        }
        .title-section h2 {
            font-size: 1.8em;
            font-weight: 600;
            margin-top: 10px;
            margin-bottom: 20px;
            border-bottom: 2px solid #21262d; /* Linha de separação */
            padding-bottom: 10px;
            color: #e6edf3;
        }
        .intro-text {
            font-size: 1.1em;
            line-height: 1.6;
            margin-bottom: 40px;
            color: #c9d1d9;
        }

        /* Seção de Tecnologias e Contato */
        .section-header {
            font-size: 1.4em;
            font-weight: 600;
            margin-top: 30px;
            margin-bottom: 15px;
            color: #8b949e;
        }

        /* Ícones de Tecnologia (simulando, pois o GitHub não carrega imagens externas facilmente) */
        .tech-icons {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            margin-top: 20px;
            margin-bottom: 40px;
        }
        .tech-icon {
            font-size: 0.85em;
            text-align: center;
            padding: 8px 15px;
            border: 1px solid #30363d;
            border-radius: 6px;
            background-color: #21262d;
            transition: transform 0.2s;
        }
        .tech-icon:hover {
            transform: translateY(-3px);
            border-color: #58a6ff;
        }
        .tech-icon span {
            display: block;
            font-size: 2em; /* Tamanho do ícone/emoji */
            margin-bottom: 5px;
        }

        /* Botões de Contato */
        .contact-buttons {
            display: flex;
            gap: 20px;
            margin-top: 20px;
        }
        .contact-btn {
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 6px;
            font-weight: 600;
            transition: background-color 0.2s;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .email-btn {
            background-color: #d73a49; /* Cor de destaque para Email */
            color: #ffffff;
        }
        .email-btn:hover {
            background-color: #cc2535;
        }
        .linkedin-btn {
            background-color: #0e76a8; /* Cor do LinkedIn */
            color: #ffffff;
        }
        .linkedin-btn:hover {
            background-color: #0a6693;
        }

        /* Separador (HR) */
        hr {
            border: 0;
            border-top: 1px solid #21262d;
            margin: 30px 0;
        }
    </style>
</head>
<body>

<div class="container">
    <div class="title-section">
        <p style="font-size: 1.2em;">Olá, eu sou o **Eliabi** 👋</p>
        <h2>Desenvolvedor Frontend com Paixão por Design</h2>
    </div>

    <p class="intro-text">
        Criando experiências digitais que não são apenas funcionais, mas também visualmente intuitivas e intuitivas. Meu foco é transformar ideias em realidade através de código limpo, interfaces modernas e uma atenção meticulosa aos detalhes. Estou sempre em busca de novos desafios e oportunidades para aprimorar minhas habilidades e contribuir para projetos inovadores.
    </p>

    <hr>

    <p class="section-header">🚀 Tecnologias que Domino</p>
    <div class="tech-icons">
        <div class="tech-icon"><span style="color: #e34c26;">&lt;/&gt;</span> HTML5</div>
        <div class="tech-icon"><span style="color: #264de4;">#</span> CSS3</div>
        <div class="tech-icon"><span style="color: #f7df1e;">JS</span> JavaScript</div>
        <div class="tech-icon"><span style="color: #007acc;">TS</span> TypeScript</div>
        <div class="tech-icon"><span style="color: #61DAFB;">⚛️</span> React</div>
        <div class="tech-icon"><span style="color: #43853d;">💚</span> Node.js</div>
        <div class="tech-icon"><span style="color: #306998;">🐍</span> Python</div>
    </div>

    <hr>

    <p class="section-header">📧 Entre em Contato</p>
    <div class="contact-buttons">
        <a href="mailto:seu.email@exemplo.com" class="contact-btn email-btn">
            <span style="font-size: 1.2em;">✉️</span>
            EMAIL
        </a>
        <a href="https://www.linkedin.com/in/seu_perfil" target="_blank" class="contact-btn linkedin-btn">
            <span style="font-size: 1.2em;">🔗</span>
            LINKEDIN
        </a>
    </div>

</div>

</body>
</html>
