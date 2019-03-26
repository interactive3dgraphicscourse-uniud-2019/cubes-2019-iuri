# Diario di sviluppo

## Sinossi

Nel seguente documento saranno riportate tutte le fasi dello sviluppo del progetto _Boxes_  per il corso di _Interactive 3D Graphics_ dell'_Università degli Studi di Udine_ con particolare attenzione sulle scelte progettuali effettate, sui problemi incontrati e le rispettive soluzioni.

Il progetto verterà sulla realizzazione di una scena 3D composta unicamente da cubi bianchi di varie dimensioni prendendo ispirazione da alcuni ambienti del videogioco _NieR: Automata_ come la
_Copied City_ ([esempio 1](https://i.pinimg.com/originals/20/b8/c5/20b8c50b9ab9b90f5bef86c0ce2d386d.jpg), [esempio2](https://steamuserimages-a.akamaihd.net/ugc/947341295631366587/AB7D5149E653F0F5018483E310B4545002E49A48/)) o la _Tower_ (di cui purtroppo non ho trovato esempi da linkare direttamente, lascio comunque una [pagina](https://lparchive.org/NieR-Automata/Update%20135/) in cui è possibile vederne varie viste dell'interno).
Per ottenere quindi il risultato voluto (il gioco di luci ombre che rende belli questi ambienti) si utilizzerà il codice di partenza contenente un semplice lightset (che verrà opportunamente modificato).

## 26/03/2019 - Giorno 1: organizzazione del lavoro

Lo sviluppo del progetto sarà organizzato, in linea di massima, come segue:

1. Design della scena su Unreal Engine 4;
2. Calcolo delle operazioni rotazione, traslazione e scalatura necessarie;
3. Ricostruzione della scena con three.js;
4. Ottimizzazione della scena;
5. Studio delle animazioni della scena;
6. Implementazione delle animazioni;
7. Validazione del risultato;
8. Eventuali extra per migliorare la resa finale (da definire);

I dettagli delle varie fasi verranno aggiunti di volta in volta all'elenco.