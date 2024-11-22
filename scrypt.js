document.getElementById('start').addEventListener('click', function () {
    // Werte aus den Eingabefeldern abrufen
    const startNumber = parseInt(document.getElementById('startNumber').value);
    const endNumber = parseInt(document.getElementById('endNumber').value);
    const examDate = document.getElementById('examDate').value;
    const birthDate = document.getElementById('birthDate').value;
    const output = document.getElementById('output');
    let positiveResults = []; // Speicherung der positiven Ergebnisse
    let totalPositive = 0; // Zähler für positive Ergebnisse

    // Funktion zum Senden von Anfragen
    async function sendRequest(participantNumber) {
        const url = `https://results.telc.net/api/results/loopkup/${participantNumber}/pruefung/${examDate}/birthdate/${birthDate}`;
        try {
            const response = await fetch(url);

            if (response.ok) {
                const result = await response.json();

                // Überprüfung der Schlüssel in den Ergebnissen
                if (result.examinationInstituteId && result.examId && result.attendeeId) {
                    const successMessage = `Teilnehmer ${participantNumber}: Erfolg, Daten: ${JSON.stringify(result)}\n`;
                    positiveResults.push(successMessage); // Hinzufügen zum positiven Array
                    totalPositive++;
                } else {
                    const partialMessage = `Teilnehmer ${participantNumber}: Unvollständiges positives Ergebnis, Daten: ${JSON.stringify(result)}\n`;
                    appendMessage(partialMessage, 'error');
                }
            } else {
                const errorMessage = `Teilnehmer ${participantNumber}: Fehler ${response.status}\n`;
                appendMessage(errorMessage, 'error');
            }
        } catch (error) {
            const errorMessage = `Teilnehmer ${participantNumber}: Anfragefehler\n`;
            appendMessage(errorMessage, 'error');
        }
    }

    // Funktion zum Hinzufügen von Nachrichten mit unterschiedlichen Stilen
    function appendMessage(message, type) {
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        if (type === 'success') {
            messageElement.classList.add('success');
        } else if (type === 'error') {
            messageElement.classList.add('error');
        }
        output.appendChild(messageElement);
    }

    // Aktualisierung der Gesamtausgabe
    function updateOutput() {
        output.textContent = ''; // Feld vor der Aktualisierung leeren

        // Anzeige der Anzahl positiver Ergebnisse
        const summary = `Positive Antworten: ${totalPositive}\n`;
        appendMessage(summary, 'success');

        // Zuerst positive Ergebnisse anzeigen
        positiveResults.forEach(result => appendMessage(result, 'success'));

        // Zusätzliche Informationen hinzufügen
        const divider = '========================\n';
        appendMessage(divider, 'error');
        appendMessage('Alle anderen Ergebnisse:\n', 'error');
    }

    // Hauptschleife zur Nummerndurchlauf
    async function startCheck() {
        positiveResults = []; // Positive Ergebnisse zurücksetzen
        totalPositive = 0; // Zähler zurücksetzen
        output.textContent = ''; // Feld vor Beginn leeren

        for (let num = startNumber; num <= endNumber; num++) {
            // Nummer mit führender Null erstellen
            const participantNumber = num.toString().padStart(7, '0');
            appendMessage(`Nummer wird überprüft: ${participantNumber}\n`);
            await sendRequest(participantNumber); // Warten auf Abschluss der Anfrage für jede Nummer
            updateOutput(); // Ausgabe nach jeder Anfrage aktualisieren
        }
    }

    startCheck();
});