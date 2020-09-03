# **Come gestire le cartelle**

Il file index.js si occupa di renderizzare tutta l'applicazione che io costruisco nella cartella App
Ogni componente principale è inserito in una cartella apposita e richiamato tramite un file index.js.
Questo previene di dover scrivere l'intero path di un componente con ripetizioni.

ES. se ho un componente Home.js nella sua cartella Home, poi dovrei scrivere:

***import Home from './components/Home/Home.js'***

In questo modo invece posso direttamente scrivere:

***import Home from './components/Home'***

e migliorare ordine delle cartelle e semplicità di lettura dei file


## Usare sempre la stessa terminologia e struttura

- Gli export vanno __sempre__ alla fine
- I nomi dei componenti e delle relative cartelle hanno liniziale in ***maiuscolo***
- I nomi dei file devono seguire un criterio in base all funzione e all'euristica scelta