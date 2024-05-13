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

    try {
        const response = await fetch(`https://${domain}.weclapp.com/webapp/api/v1/customer?properties=id,company`, requestOptions);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const result = await response.text();
        const parsedResult = JSON.parse(result);
        return parsedResult.result;
    } catch (error) {
        if (retries > 0 && (error.message.includes('Failed to fetch') || error.message.includes('Network Error') || (error.response && error.response.status === 0))) {
            console.error('Netzwerk- oder CORS-Fehler erkannt, versuche erneut...');
            setTimeout(() => fetchCustomer(apiKey, domain, retries - 1), 1000);
        } else {
            console.error('Error fetching customer data:', error);
        }
    }
}

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
        const response = await fetch(`https://${domain}.weclapp.com/webapp/api/v1/user`, requestOptions);
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
        const response = await fetch(`https://${domain}.weclapp.com/webapp/api/v1/salesOrder?properties=id,commission&customerId-eq="${selectedCustomer}"`, requestOptions);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const result = await response.json();
        const salesOrders = result.result.map(order => ({
            id: order.id,
            commission: order.commission
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

export const fetchSelectedSalesOrder = async (apiKey, domain, selectedValue) => {
    console.log('fetchSelectedSalesOrder called with: ', selectedValue);
    if (!selectedValue) return;
    const url = `https://${domain}.weclapp.com/webapp/api/v1/salesOrder?id-eq="${selectedValue}"&properties=id,orderItems.id,orderItems.title,orderItems.tasks.id`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "AuthenticationToken": apiKey
            }
        });
        const result = await response.json();
        if (response.ok) {
            if (result.result && result.result.length > 0) {
                const orderData = result.result[0]; // Access the first element of result
                const orderItems = orderData.orderItems.map(item => ({
                    id: item.id,
                    title: item.title,
                    tasks: item.tasks.map(task => task.id),
                }));
                console.log('Extracted task ids: ', orderItems);
                return orderItems;
            } else {
                console.log('No data found for the given id.');
            }
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (e) {
        console.error("Error fetching selected sales order: ", e);
    }
};

export const fetchTaskAndSubject = async (apiKey, domain, taskId, retries = 3) => {
    const url = `https://${domain}.weclapp.com/webapp/api/v1/task?id-eq=${taskId}&properties=id,subject`;
    try {
        const response = await axios.get(url, {
            headers: {
                "Accept": "application/json",
                "AuthenticationToken": apiKey
            }
        });
        const tasks = response.data.result;
        if (tasks.length > 0) {
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
        const response = await fetch(`https://${domain}.weclapp.com/webapp/api/v1/timeRecord`, requestOptions);
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

