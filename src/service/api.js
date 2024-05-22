import axios from 'axios';

export const fetchCustomer = async (apiKey, domain, retries = 3) => {
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("AuthenticationToken", apiKey);
    myHeaders.append("Access-Control-Request-Method", "GET");
    myHeaders.append("Access-Control-Request-Headers", "AuthenticationToken, Content-Type");
    myHeaders.append("Origin", `https://${domain}.weclapp.com`);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    try {
        const response = await fetch(`https://corsproxy.io/?https://${domain}.weclapp.com/webapp/api/v1/customer?properties=id,company,customerNumber`, requestOptions);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const result = await response.text();
        const parsedResult = JSON.parse(result);
        return parsedResult.result;
    } catch (error) {
        if (retries > 0 && (error.message.includes('Failed to fetch') || error.message.includes('Network Error') || (error.response && error.response.status === 0))) {
            console.error('Netzwerk- oder CORS-Fehler erkannt, versuche erneut...');
            await delay(1000);
            return fetchCustomer(apiKey, domain, retries - 1);
        } else {
            console.error('Error fetching customer data:', error);
            throw error;
        }
    }
};

export const fetchUsers = async (apiKey, domain, retries = 3) => {
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("AuthenticationToken", apiKey);
    myHeaders.append("Cookie", "sid=19");
    myHeaders.append("Access-Control-Request-Method", "GET");
    myHeaders.append("Access-Control-Request-Headers", "AuthenticationToken, Content-Type");
    myHeaders.append("Origin", `https://${domain}.weclapp.com`);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    try {
        const response = await fetch(`https://corsproxy.io/?https://${domain}.weclapp.com/webapp/api/v1/user`, requestOptions);
        if (!response.ok) throw new Error('Response not okay');
        const result = await response.text();
        const parsedResult = JSON.parse(result);
        // Wenn `users` in einem übergeordneten Kontext definiert ist, geben Sie die Daten zurück
        return parsedResult.result;
    } catch (error) {
        if (retries > 0 && (error.message.includes('Failed to fetch') || error.message.includes('Network Error') || (error.response && error.response.status === 0))) {
            console.error('Netzwerk- oder CORS-Fehler erkannt, versuche erneut...');
            setTimeout(() => fetchUsers(apiKey, domain, retries - 1), 1000);
        } else {
            console.error('Fehler beim Abrufen der Benutzerdaten:', error);
            throw error;
        }
    }
};

export const fetchSalesOrders = async (apiKey, domain, selectedCustomer, retries = 3) => {
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("AuthenticationToken", apiKey);
    myHeaders.append("Access-Control-Request-Method", "GET");
    myHeaders.append("Access-Control-Request-Headers", "AuthenticationToken, Content-Type");
    myHeaders.append("Origin", `https://${domain}.weclapp.com`);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    try {
        const response = await fetch(`https://corsproxy.io/?https://${domain}.weclapp.com/webapp/api/v1/salesOrder?customerId-eq=${selectedCustomer}&status-eq=ORDER_CONFIRMATION_PRINTED`, requestOptions);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const result = await response.json();
        const salesOrders = result.result.map(order => ({
            id: order.id,
            commission: order.commission,
            orderNumber: order.orderNumber,
        }));
        console.log('Verkaufsaufträge erfolgreich geladen');
        return salesOrders;
    }  catch (error) {
    if (retries > 0 && (error.message.includes('Failed to fetch') || error.message.includes('Network Error') || (error.response && error.response.status === 0))) {
        console.error('Netzwerk- oder CORS-Fehler erkannt, versuche erneut...');
        await (async () => {
            fetchSalesOrders(apiKey, domain, selectedCustomer, retries - 1);
        })();
    } else {
        console.error('Fehler beim Abrufen der Verkaufsaufträge:', error);
    }
}
};

export const fetchSelectedSalesOrder = async (apiKey, domain, selectedValue, retries = 3) => {
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("AuthenticationToken", apiKey);
    myHeaders.append("Access-Control-Request-Method", "GET");
    myHeaders.append("Access-Control-Request-Headers", "AuthenticationToken, Content-Type");
    myHeaders.append("Origin", `https://${domain}.weclapp.com`);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    try {
        const response = await fetch(`https://corsproxy.io/?https://${domain}.weclapp.com/webapp/api/v1/salesOrder?id-eq=${selectedValue}&properties=id,orderItems.id,orderItems.title,orderItems.articleNumber,orderItems.tasks.id`, requestOptions);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const result = await response.json();
        if (result.result && result.result.length > 0) {
            const orderData = result.result[0]; // Access the first element of result
            const orderItems = orderData.orderItems.map(item => ({
                id: item.id,
                title: item.title,
                tasks: item.tasks.map(task => task.id),
                articleNumber: item.articleNumber
            }));
            console.log('Extracted task ids: ', orderItems);
            return orderItems;
        } else {
            console.log('No data found for the given id.');
        }
    } catch (error) {
        if (retries > 0 && (error.message.includes('Failed to fetch') || error.message.includes('Network Error') || (error.response && error.response.status === 0))) {
            console.error('Netzwerk- oder CORS-Fehler erkannt, versuche erneut...');
            await delay(1000);
            return fetchSelectedSalesOrder(apiKey, domain, selectedValue, retries - 1);
        } else {
            console.error('Error fetching selected sales order:', error);
            throw error;
        }
    }
};

export const fetchTaskAndSubject = async (apiKey, domain, taskId, retries = 3) => {
    const url = `https://corsproxy.io/?https://${domain}.weclapp.com/webapp/api/v1/task?id-eq=${taskId}&properties=id,subject,plannedEffort,taskStatus`;
    try {
        const response = await axios.get(url, {
            headers: {
                "Accept": "application/json",
                "AuthenticationToken": apiKey
            }
        });
        let tasks = response.data.result;
        if (tasks.length > 0) {
            // Filtere abgeschlossene Aufgaben heraus
            tasks = tasks.filter(task => task.taskStatus !== 'COMPLETED');
            return tasks;
        } else {
            throw new Error('Keine Aufgaben gefunden');
        }
    } catch (error) {
        if (retries > 0 && (error.message.includes("Network Error") || (error.response && error.response.status === 0))) {
            console.error('Netzwerk- oder CORS-Fehler erkannt, versuche erneut...');
            setTimeout(() => fetchTaskAndSubject(apiKey, domain, taskId, retries - 1), 1000);
        } else {
            console.error('Fehler beim Abrufen der Aufgaben:', error);
        }
    }
};

export const postTimeRecord = async (item, apiKey, domain) => {
    const myHeaders = new Headers({
        "Accept": "application/json",
        "Content-Type": "application/json",
        "AuthenticationToken": apiKey
    });

    const raw = JSON.stringify({
        "billable": true,
        "billableDurationSeconds": item.duration,
        "description": item.description,
        "durationSeconds": item.duration,
        "startDate": item.startDate,
        "taskId": item.taskId,
        "userId": item.userId,
        "placeOfServiceId": item.placeOfServiceId
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    try {
        const response = await fetch(`https://corsproxy.io/?https://${domain}.weclapp.com/webapp/api/v1/timeRecord`, requestOptions);
        const result = await response.json();
        if (!response.ok && response.status === 400) {
            if (result.messages) {
                const messages = result.messages.map(message => message.message);
                return { success: false, messages };
            } else if (result.error) {
                return { success: false, messages: [result.error] };
            }
        }
        else if (response.status === 201) {
            console.log('Time record posted successfully:', result);
            return { success: true, messages: ['Time record posted successfully'] };
        }
    } catch (error) {
        console.error('Error posting time record:', error);
        return ['Error posting time record:', error];
    }
};

// api.js
export const checkTaskCompletion = async (apiKey, domain, taskId) => {
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("AuthenticationToken", apiKey);
    myHeaders.append("Access-Control-Request-Method", "GET");
    myHeaders.append("Access-Control-Request-Headers", "AuthenticationToken, Content-Type");
    myHeaders.append("Origin", `https://${domain}.weclapp.com`);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    try {
        // Fetch für timeRecords
        const timeRecordsUrl = `https://corsproxy.io/?https://${domain}.weclapp.com/webapp/api/v1/timeRecord?taskId-eq=${taskId}&properties=id,durationSeconds`;
        const timeRecordsResponse = await fetch(timeRecordsUrl, requestOptions);
        if (!timeRecordsResponse.ok) throw new Error(`HTTP error! Status: ${timeRecordsResponse.status}`);
        const timeRecordsData = await timeRecordsResponse.json();
        const timeRecords = timeRecordsData.result;

        // Summiere die Dauer aller Zeiteinträge für die gegebene taskId
        const totalDuration = timeRecords.reduce((sum, record) => sum + record.durationSeconds, 0);
        console.log('Total duration in seconds:', totalDuration);

        // Fetch für task
        const taskUrl = `https://corsproxy.io/?https://${domain}.weclapp.com/webapp/api/v1/task?id-eq=${taskId}&properties=id,subject,plannedEffort,taskStatus`;
        const taskResponse = await fetch(taskUrl, requestOptions);
        if (!taskResponse.ok) throw new Error(`HTTP error! Status: ${taskResponse.status}`);
        const taskData = await taskResponse.json();
        console.log('Task data:', taskData);
        const task = taskData.result[0];
        console.log('Task:', task);

        let finishes = totalDuration >= task.plannedEffort;
        console.log('Finishes:', finishes);
        let remainingHours = !finishes ? (task.plannedEffort - totalDuration) / 3600 : 0;
        console.log('Remaining hours:', remainingHours);
        let plannedEffortHours = task.plannedEffort / 3600;
        console.log('Planned effort hours:', plannedEffortHours);
        let completed = task.taskStatus === 'COMPLETED';

        // Ausgabe der Ergebnisse
        if (finishes) {
            console.log(`Die Aufgabe "${task.subject}" ist abgeschlossen.`);
        } else {
            console.log(`Die Aufgabe "${task.subject}" ist noch nicht abgeschlossen. Verbleibende Stunden: ${remainingHours}`);
        }

        // Rückgabe des Ergebnisses
        return {
            finishes,
            remainingHours,
            plannedEffortHours,
            completed
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
};