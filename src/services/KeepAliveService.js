// services/KeepAliveService.js

export default class KeepAliveService {
    static keepAlive(url) {
        const fetchData = async () => {
            try {
                const response = await fetch(url);
                console.log("Keep-Alive-Anfrage erfolgreich:", response.statusText);
            } catch (error) {
                console.error("Fehler bei der Keep-Alive-Anfrage:", error);
            }
        };
        setInterval(fetchData, 300000);
    }
}
