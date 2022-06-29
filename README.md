﻿# Flappy Bird Game
 - Esse jogo foi criado para exercitar HTML, CSS (Flexbox) e Javascript. 
 - Não foi trabalhada canvas ou algo dessa natureza para criação do game, pois o intuito do código é o que está descrito na linha acima.
 - Para dar início ao jogo basta apertar qualquer tecla do seu teclado, que o pássaro começará a se movimentar para cima.
 - Ao soltar a tecla o pássaro começará a "cair", e para que volte a subir, basta apertar qualquer tecla do seu teclado novamente.
 - Ao passar por qualquer uma das barreiras, automaticamente será acrescentado um ponto no score.
 - Ao colidir com qualquer uma das barreiras, automaticamente o jogo é encerrado. E para reiniciar basta dar refresh no browser.

 - Para criação das barreiras foi utilizada uma function onde a altura da abertura entre elas é sempre fixa, ou seja, o que muda é o tamanho das barreiras propriamente ditas, através do Math.random();
 - O elementos do jogo não foram inseridos diretamento no HTML, e sim através da manipulação da DOM, com a function appendChild();
